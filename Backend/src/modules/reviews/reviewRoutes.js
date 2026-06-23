import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Review } from '../../models/Review.js';
import { Product } from '../../models/Product.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { protect } from '../../middleware/authMiddleware.js';

export const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  // Check if user already reviewed
  const existingReview = await Review.findOne({ userId: req.user._id, productId });
  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this product');
  }

  const review = await Review.create({
    userId: req.user._id,
    productId,
    rating,
    comment
  });

  // Calculate new average rating
  const allReviews = await Review.find({ productId });
  const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
  
  product.averageRating = avgRating;
  await product.save();

  res.status(201).json(new ApiResponse(201, review, 'Review added successfully'));
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const reviews = await Review.find({ productId: id }).populate('userId', 'name avatar').sort({ createdAt: -1 });
  
  res.status(200).json(new ApiResponse(200, reviews, 'Reviews fetched successfully'));
});

const router = express.Router();

router.get('/product/:id', getProductReviews);
router.post('/', protect, createReview);

export default router;
