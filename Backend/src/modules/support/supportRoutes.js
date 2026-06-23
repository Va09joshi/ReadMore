import express from 'express';
import { createSupportTicket, getMySupportTickets } from './supportController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-tickets', protect, getMySupportTickets);
router.post('/', protect, createSupportTicket);

export default router;
