import express from 'express';
import { upload } from '../../middleware/uploadMiddleware.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('PROVIDER', 'SUPER_ADMIN'), upload.single('image'), (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload an image file');
  }

  // Return relative path so it works across proxies and remote IDEs
  const imageUrl = `/uploads/${req.file.filename}`;

  res.status(200).json(new ApiResponse(200, { url: imageUrl }, 'Image uploaded successfully'));
});

export default router;
