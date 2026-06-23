import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load env vars
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: 'USER' },
    isVerified: { type: Boolean, default: false },
    status: { type: String, default: 'ACTIVE' },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'adminpassword';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists. Updating password and role just in case...');
      existingAdmin.password = await bcrypt.hash(adminPassword, 10);
      existingAdmin.role = 'SUPER_ADMIN';
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      console.log('Admin updated!');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = new User({
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isVerified: true,
      status: 'ACTIVE'
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
