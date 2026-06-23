import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { SupportTicket } from '../../models/SupportTicket.js';
import { sendEmail } from '../../utils/sendEmail.js';

export const createSupportTicket = asyncHandler(async (req, res) => {
  const { subject, message, priority } = req.body;
  const userId = req.user?._id;

  if (!subject || !message) {
    throw new ApiError(400, 'Subject and message are required');
  }

  const ticket = await SupportTicket.create({
    user: userId,
    subject,
    message,
    priority: priority || 'MEDIUM',
    status: 'OPEN',
  });

  // If user is authenticated, send them an email
  if (req.user && req.user.email) {
    try {
      await sendEmail({
        to: req.user.email,
        subject: `Support Ticket Received: ${subject}`,
        text: `We have received your support request. Our team will get back to you shortly. Ticket ID: ${ticket._id}`,
        html: `<p>We have received your support request. Our team will get back to you shortly.</p><p><strong>Ticket ID:</strong> ${ticket._id}</p>`,
      });
    } catch (error) {
      console.error('Error sending support email:', error);
    }
  }

  res.status(201).json(new ApiResponse(201, ticket, 'Support ticket created successfully'));
});

export const getMySupportTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, tickets, 'Support tickets fetched successfully'));
});
