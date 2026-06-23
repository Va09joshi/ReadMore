import express from 'express';
import { registerUser, loginUser, logoutUser, sendOtp, verifyOtp } from './authController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/logout', protect, logoutUser);

export default router;
