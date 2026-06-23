import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Address } from '../../models/Address.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { protect } from '../../middleware/authMiddleware.js';

export const addAddress = asyncHandler(async (req, res) => {
  const { addressLine1, addressLine2, city, state, pincode, country } = req.body;
  
  const address = await Address.create({
    userId: req.user._id,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    country,
  });

  res.status(201).json(new ApiResponse(201, address, 'Address added successfully'));
});

export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ userId: req.user._id });
  res.status(200).json(new ApiResponse(200, addresses, 'Addresses fetched successfully'));
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  
  if (!address) {
    throw new ApiError(404, 'Address not found or unauthorized');
  }

  res.status(200).json(new ApiResponse(200, null, 'Address deleted successfully'));
});

const router = express.Router();

router.use(protect);
router.route('/').post(addAddress).get(getAddresses);
router.delete('/:id', deleteAddress);

export default router;
