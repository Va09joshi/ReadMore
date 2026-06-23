import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Wishlist } from '../../models/Wishlist.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { protect } from '../../middleware/authMiddleware.js';

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const exists = await Wishlist.findOne({ userId: req.user._id, productId });
  if (exists) {
    throw new ApiError(400, 'Product already in wishlist');
  }

  const wishlist = await Wishlist.create({ userId: req.user._id, productId });
  res.status(201).json(new ApiResponse(201, wishlist, 'Added to wishlist'));
});

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.find({ userId: req.user._id }).populate('productId');
  res.status(200).json(new ApiResponse(200, wishlist, 'Wishlist fetched successfully'));
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  
  if (!wishlist) {
    throw new ApiError(404, 'Wishlist item not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Removed from wishlist'));
});

const router = express.Router();

router.use(protect);
router.route('/').post(addToWishlist).get(getWishlist);
router.delete('/:id', removeFromWishlist);

export default router;
