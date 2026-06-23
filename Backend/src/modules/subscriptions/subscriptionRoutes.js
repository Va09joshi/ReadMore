import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Subscription } from '../../models/Subscription.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { protect } from '../../middleware/authMiddleware.js';

export const createSubscription = asyncHandler(async (req, res) => {
  const { productId, startDate, endDate } = req.body;
  const subscription = await Subscription.create({
    userId: req.user._id,
    productId,
    startDate,
    endDate,
  });
  res.status(201).json(new ApiResponse(201, subscription, 'Subscription created successfully'));
});

export const getMySubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ userId: req.user._id }).populate('productId');
  res.status(200).json(new ApiResponse(200, subscriptions, 'Subscriptions fetched successfully'));
});

export const toggleSubscriptionPause = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);
  if (!subscription) throw new ApiError(404, 'Subscription not found');
  
  subscription.paused = !subscription.paused;
  await subscription.save();

  res.status(200).json(new ApiResponse(200, subscription, `Subscription ${subscription.paused ? 'paused' : 'resumed'}`));
});

const router = express.Router();
router.use(protect);
router.post('/create', createSubscription);
router.get('/my-subscriptions', getMySubscriptions);
router.patch('/:id/toggle-pause', toggleSubscriptionPause);

export default router;
