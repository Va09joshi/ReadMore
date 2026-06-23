import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Order } from '../../models/Order.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { protect } from '../../middleware/authMiddleware.js';
import { Cart } from '../../models/Cart.js';
import { Subscription } from '../../models/Subscription.js';
import { Product } from '../../models/Product.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export const createOrder = asyncHandler(async (req, res) => {
  const { providerId, items, shippingAddress, totalAmount, paymentMethod } = req.body;
  const order = await Order.create({
    userId: req.user._id,
    providerId,
    items,
    shippingAddress,
    totalAmount,
    paymentMethod,
  });
  res.status(201).json(new ApiResponse(201, order, 'Order created successfully'));
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });
  res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully'));
});

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Cart is empty');
  }

  // Multiply by 100 because Razorpay expects amount in paise (smallest currency unit)
  const amount = Math.round(cart.totalPrice * 100);

  // If no razorpay keys are present, return a mock order ID
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id') {
    return res.status(200).json(new ApiResponse(200, {
      id: 'mock_order_' + Date.now(),
      amount,
      currency: 'INR',
      mock: true
    }, 'Mock Razorpay Order created'));
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount,
    currency: 'INR',
    receipt: 'receipt_' + Date.now() + '_' + req.user._id,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(new ApiResponse(200, order, 'Razorpay order created successfully'));
  } catch (error) {
    throw new ApiError(500, 'Failed to create Razorpay order', [error]);
  }
});

export const checkoutCart = asyncHandler(async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, razorpayPaymentId, razorpayOrderId, razorpaySignature, isMock } = req.body;

    // Verify Razorpay Signature if not a mock payment
    if (!isMock && razorpayPaymentId && razorpayOrderId && razorpaySignature) {
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret')
                                      .update(body.toString())
                                      .digest('hex');
      if (expectedSignature !== razorpaySignature) {
        throw new ApiError(400, 'Invalid payment signature');
      }
    }

    // 1. Get user cart with populated products to access provider
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, 'Cart is empty');
    }

    // 2. Group items by provider
    const providerGroups = {};
    for (const item of cart.items) {
      if (!item.product || !item.product.provider) {
        console.error("Cart item missing product or provider info:", item);
        continue;
      }
      const providerId = item.product.provider.toString();
      if (!providerGroups[providerId]) {
        providerGroups[providerId] = {
          items: [],
          totalAmount: 0
        };
      }
      providerGroups[providerId].items.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        language: item.language,
        frequency: item.frequency
      });
      providerGroups[providerId].totalAmount += item.price * item.quantity;
    }

    // 3. Create Orders & Subscriptions
    const createdOrders = [];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30); // Mock 30-day subscription

    for (const providerId in providerGroups) {
      const group = providerGroups[providerId];
      
      const order = await Order.create({
        userId: req.user._id,
        providerId: providerId,
        items: group.items,
        shippingAddress,
        totalAmount: group.totalAmount,
        paymentMethod: paymentMethod || 'RAZORPAY',
        paymentStatus: 'COMPLETED',
        invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 10000)}`
      });
      createdOrders.push(order);

      for (const item of group.items) {
        await Subscription.create({
          userId: req.user._id,
          productId: item.product,
          startDate,
          endDate,
          language: item.language,
          frequency: item.frequency
        });
      }
    }

    // 4. Clear the cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json(new ApiResponse(200, createdOrders, 'Checkout completed successfully'));
  } catch (error) {
    console.error("CRITICAL CHECKOUT ERROR:", error);
    throw new ApiError(500, `Checkout Error: ${error.message}`, [error.stack]);
  }
});

const router = express.Router();
router.use(protect);
router.post('/create', createOrder);
router.get('/my-orders', getMyOrders);
router.post('/razorpay-create', createRazorpayOrder);
router.post('/checkout', checkoutCart);

export default router;
