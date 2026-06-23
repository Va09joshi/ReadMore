import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Provider } from '../../models/Provider.js';
import { User } from '../../models/User.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

export const createProvider = asyncHandler(async (req, res) => {
  const { companyName, description, gstNumber, website, email, phone } = req.body;

  // Check if a provider already exists for this user
  const existingForUser = await Provider.findOne({ ownerId: req.user._id });
  if (existingForUser) {
    throw new ApiError(400, 'You already have a provider application');
  }

  const providerExists = await Provider.findOne({ email });
  if (providerExists) {
    throw new ApiError(400, 'Provider with this email already exists');
  }

  const provider = await Provider.create({
    companyName,
    description,
    gstNumber,
    website,
    email,
    phone,
    ownerId: req.user._id,
    approved: false,
  });

  // Do NOT upgrade user role yet — wait for admin approval
  const user = await User.findById(req.user._id).select('-password');

  res.status(201).json(new ApiResponse(201, { provider, user }, 'Provider application submitted. Awaiting admin approval.'));
});

import { Product } from '../../models/Product.js';
import { Order } from '../../models/Order.js';
import { Subscription } from '../../models/Subscription.js';

export const getProviders = asyncHandler(async (req, res) => {
  const providers = await Provider.find({}).select('companyName description website logo');
  res.status(200).json(new ApiResponse(200, providers, 'Providers fetched successfully'));
});

export const getProviderProfile = asyncHandler(async (req, res) => {
  const provider = await Provider.findOne({ ownerId: req.user._id });

  if (!provider) {
    throw new ApiError(404, 'Provider profile not found');
  }

  res.status(200).json(new ApiResponse(200, provider, 'Provider profile fetched successfully'));
});

export const getProviderCatalog = asyncHandler(async (req, res) => {
  const provider = await Provider.findOne({ ownerId: req.user._id });
  if (!provider) throw new ApiError(404, 'Provider profile not found');

  const products = await Product.find({ provider: provider._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, products, 'Provider catalog fetched successfully'));
});

export const getProviderById = asyncHandler(async (req, res) => {
  const provider = await Provider.findById(req.params.id);
  if (!provider) throw new ApiError(404, 'Provider not found');

  const products = await Product.find({ provider: provider._id, status: 'ACTIVE' }).sort({ createdAt: -1 });
  
  res.status(200).json(new ApiResponse(200, { provider, products }, 'Provider details fetched successfully'));
});

export const getProviderAnalytics = asyncHandler(async (req, res) => {
  const provider = await Provider.findOne({ ownerId: req.user._id });
  if (!provider) throw new ApiError(404, 'Provider profile not found');

  const productsCount = await Product.countDocuments({ provider: provider._id });
  
  const orders = await Order.find({ providerId: provider._id, paymentStatus: 'COMPLETED' });
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalSubscribers = orders.length; // Simplified for now

  res.status(200).json(new ApiResponse(200, {
    productsCount,
    totalRevenue,
    totalSubscribers,
    orders
  }, 'Provider analytics fetched successfully'));
});

export const getProviderSubscribers = asyncHandler(async (req, res) => {
  const provider = await Provider.findOne({ ownerId: req.user._id });
  if (!provider) throw new ApiError(404, 'Provider profile not found');

  // Find all products owned by this provider
  const products = await Product.find({ provider: provider._id }).select('_id');
  const productIds = products.map(p => p._id);

  // Find all subscriptions for these products
  const subscriptions = await Subscription.find({ productId: { $in: productIds } })
    .populate('userId', 'name email')
    .populate('productId', 'title type')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, subscriptions, 'Subscribers fetched successfully'));
});

export const getProviderStatus = asyncHandler(async (req, res) => {
  const provider = await Provider.findOne({ ownerId: req.user._id });

  if (!provider) {
    return res.status(200).json(new ApiResponse(200, { status: 'NONE' }, 'No provider application found'));
  }

  res.status(200).json(new ApiResponse(200, {
    status: provider.approved ? 'APPROVED' : 'PENDING',
    provider,
  }, 'Provider status fetched'));
});

const router = express.Router();

router.get('/', getProviders);
router.post('/create', protect, createProvider);
router.get('/status', protect, getProviderStatus);
router.get('/profile', protect, authorize('PROVIDER', 'SUPER_ADMIN'), getProviderProfile);
router.get('/catalog', protect, authorize('PROVIDER', 'SUPER_ADMIN'), getProviderCatalog);
router.get('/analytics', protect, authorize('PROVIDER', 'SUPER_ADMIN'), getProviderAnalytics);
router.get('/subscribers', protect, authorize('PROVIDER', 'SUPER_ADMIN'), getProviderSubscribers);
router.get('/:id', getProviderById);

export default router;

