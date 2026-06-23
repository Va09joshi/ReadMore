import express from 'express';
import { 
  getDashboardStats, getUsers, getProviders, getProducts, getOrders, getSubscriptions,
  getUserById, updateUser, suspendUser, deleteUser,
  getSettings, updateSettings, getSupportTickets, closeSupportTicket, getReviews,
  getActivityLogs, getCategories, createCategory, updateCategory, deleteCategory, cancelSubscription, updateProviderStatus, deleteProvider
} from './adminController.js';

const router = express.Router();

router.get('/dashboard-stats', getDashboardStats);

// User CRUD
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.put('/users/:id/suspend', suspendUser);
router.delete('/users/:id', deleteUser);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Other entities
router.get('/providers', getProviders);
router.put('/providers/:id/status', updateProviderStatus);
router.delete('/providers/:id', deleteProvider);
router.get('/products', getProducts);
router.get('/orders', getOrders);
router.get('/subscriptions', getSubscriptions);
router.put('/subscriptions/:id/cancel', cancelSubscription);
router.get('/reviews', getReviews);

// Activity Logs
router.get('/activity-logs', getActivityLogs);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Support
router.get('/support', getSupportTickets);
router.put('/support/:id/close', closeSupportTicket);

export default router;
