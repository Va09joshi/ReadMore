import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { User } from '../../models/User.js';
import { OTP } from '../../models/OTP.js';
import { generateTokens } from '../../utils/generateTokens.js';
import { sendEmail } from '../../utils/sendEmail.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    if (userExists.isVerified) {
      throw new ApiError(400, 'User already exists');
    }
    // If they exist but aren't verified, we can resend OTP
  }

  let user = userExists;

  if (!user) {
    user = await User.create({
      name,
      email,
      password,
      phone,
      isVerified: false,
    });
  } else {
    // Update password/phone in case they entered something new
    user.password = password;
    user.phone = phone;
    user.name = name;
    await user.save();
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await OTP.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  );

  // Send Email
  try {
    await sendEmail({
      to: email,
      subject: 'Verify Your Account - OTP',
      text: `Your OTP to verify your account is: ${otp}. It is valid for 5 minutes.`,
      html: `<p>Your OTP to verify your account is: <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
    });
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }

  res.status(201).json(new ApiResponse(201, null, 'User registered. Please verify OTP sent to your email.'));
});

export const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await OTP.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  );

  await sendEmail({
    to: email,
    subject: 'Your OTP',
    text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    html: `<p>Your OTP is: <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
  });

  res.status(200).json(new ApiResponse(200, null, 'OTP sent successfully'));
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, 'Email and OTP are required');
  }

  const otpRecord = await OTP.findOne({ email });

  if (!otpRecord || otpRecord.otp !== otp) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, 'User not found. Please register first.');
  }

  user.isVerified = true;
  await user.save();

  await OTP.deleteOne({ _id: otpRecord._id });

  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    }, 'Account verified and logged in successfully')
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isVerified) {
    throw new ApiError(403, 'Please verify your email before logging in');
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    }, 'Login successful')
  );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });

  res.status(200).json(new ApiResponse(200, null, 'User logged out successfully'));
});
