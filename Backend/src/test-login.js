import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { User } from './models/User.js';

dotenv.config();

const checkUsers = async () => {
  try {
    await connectDB();
    const users = await User.find({ email: 'admin@example.com' }).select('+password');
    console.log(`Found ${users.length} users with email admin@example.com`);
    users.forEach((u, i) => {
      console.log(`User ${i}: ${u._id} - Role: ${u.role} - Password: ${u.password.substring(0, 10)}...`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUsers();
