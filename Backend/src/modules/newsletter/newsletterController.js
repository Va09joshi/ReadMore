import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Newsletter } from '../../models/Newsletter.js';
import { sendEmail } from '../../utils/sendEmail.js';

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const existingSubscriber = await Newsletter.findOne({ email });

  if (existingSubscriber) {
    throw new ApiError(400, 'Already subscribed to the newsletter');
  }

  await Newsletter.create({ email });

  // Send Welcome Email
  try {
    await sendEmail({
      to: email,
      subject: 'Welcome to News Subscription!',
      text: 'Thank you for subscribing to our newsletter! Stay tuned for curated bundles and publisher news.',
      html: '<p>Thank you for subscribing to our newsletter! Stay tuned for curated bundles and publisher news.</p>',
    });
  } catch (error) {
    console.error('Error sending welcome email for newsletter:', error);
    // Don't throw error if email fails, subscription is still successful
  }

  res.status(201).json(new ApiResponse(201, null, 'Successfully subscribed to the newsletter'));
});
