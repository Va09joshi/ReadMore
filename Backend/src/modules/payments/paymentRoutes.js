import express from 'express';
import crypto from 'crypto';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Payment } from '../../models/Payment.js';
import { Order } from '../../models/Order.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { protect } from '../../middleware/authMiddleware.js';
import { razorpayInstance } from '../../config/razorpay.js';

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;
  
  const options = {
    amount: amount * 100, // amount in the smallest currency unit (paise)
    currency: "INR",
    receipt: `receipt_order_${orderId}`,
  };

  const razorpayOrder = await razorpayInstance.orders.create(options);

  const payment = await Payment.create({
    orderId,
    amount,
    razorpayOrderId: razorpayOrder.id,
    status: 'PENDING',
  });

  res.status(201).json(new ApiResponse(201, { razorpayOrder, paymentId: payment._id }, 'Payment order created'));
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const payment = await Payment.findById(paymentId);
    if (payment) {
      payment.status = 'SUCCESS';
      payment.transactionId = razorpay_payment_id;
      await payment.save();

      const order = await Order.findById(payment.orderId);
      if (order) {
        order.paymentStatus = 'COMPLETED';
        await order.save();
      }
    }
    res.status(200).json(new ApiResponse(200, { verified: true }, 'Payment verified successfully'));
  } else {
    throw new ApiError(400, 'Invalid payment signature');
  }
});

const router = express.Router();
router.use(protect);
router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);

export default router;
