import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { User } from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ role: 'SUPER_ADMIN' });

    if (adminExists) {
      console.log('Admin user already exists:', adminExists.email);
      process.exit(0);
    }

    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: 'adminpassword',
      phone: '1234567890',
      role: 'SUPER_ADMIN',
      isVerified: true
    });

    console.log('Admin user created successfully');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: adminpassword`);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
