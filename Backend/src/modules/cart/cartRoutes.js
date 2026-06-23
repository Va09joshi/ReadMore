import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Cart } from '../../models/Cart.js';
import { Product } from '../../models/Product.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { protect } from '../../middleware/authMiddleware.js';

export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [], totalPrice: 0 });
  }
  res.status(200).json(new ApiResponse(200, cart, 'Cart fetched successfully'));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, language, frequency } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    cart = new Cart({ userId: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(p => 
    p.product.toString() === productId &&
    (p.language || 'English') === (language || 'English') &&
    (p.frequency || 'Daily') === (frequency || 'Daily')
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity || 1;
  } else {
    cart.items.push({ 
      product: productId, 
      quantity: quantity || 1, 
      price: product.price,
      language: language || 'English',
      frequency: frequency || 'Daily'
    });
  }

  await cart.save();
  res.status(200).json(new ApiResponse(200, cart, 'Item added to cart'));
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = cart.items.filter(item => item._id.toString() !== id);
  await cart.save();

  res.status(200).json(new ApiResponse(200, cart, 'Item removed from cart'));
});

export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const itemIndex = cart.items.findIndex(item => item._id.toString() === id);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }
  } else {
    throw new ApiError(404, 'Item not found in cart');
  }

  await cart.save();
  res.status(200).json(new ApiResponse(200, cart, 'Cart updated'));
});

const router = express.Router();

router.use(protect);
router.route('/').get(getCart).post(addToCart);
router.delete('/:id', removeFromCart);
router.patch('/:id', updateCartItemQuantity);

export default router;
