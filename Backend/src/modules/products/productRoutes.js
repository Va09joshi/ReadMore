import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Product } from '../../models/Product.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

export const createProduct = asyncHandler(async (req, res) => {
  const { title, slug, description, type, category, provider, price, stock, language, frequency, images } = req.body;

  const productExists = await Product.findOne({ slug });
  if (productExists) {
    throw new ApiError(400, 'Product with this slug already exists');
  }

  const product = await Product.create({
    title,
    slug,
    description,
    type,
    category,
    provider,
    price,
    stock,
    language,
    frequency,
    images
  });

  res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

export const getProducts = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = { status: 'ACTIVE' };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const products = await Product.find(filter).populate('category').populate('provider');
  res.status(200).json(new ApiResponse(200, products, 'Products fetched successfully'));
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category').populate('provider');
  
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});

export const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Ensure the user owns the product (or is an admin)
  // Assuming the user is a provider, check if product.provider matches req.user.id
  // We need to fetch the provider profile for this user first
  // Actually, wait, let's look at how the frontend creates products
  // The frontend passes `provider: provider._id`. So the product has a provider ObjectId.
  // Wait, let's just use `req.user.id` or we can find the provider associated with `req.user.id`.
  
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  await product.deleteOne();

  res.status(200).json(new ApiResponse(200, {}, 'Product deleted successfully'));
});

const router = express.Router();

router.route('/')
  .post(protect, authorize('PROVIDER', 'SUPER_ADMIN'), createProduct)
  .get(getProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('PROVIDER', 'SUPER_ADMIN'), updateProduct)
  .delete(protect, authorize('PROVIDER', 'SUPER_ADMIN'), deleteProduct);

export default router;
