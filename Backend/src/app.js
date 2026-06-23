import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], // Frontend and Admin URLs
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 10000 requests per `window`
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// Basic Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

import authRoutes from './modules/auth/authRoutes.js';
import providerRoutes from './modules/providers/providerRoutes.js';
import productRoutes from './modules/products/productRoutes.js';
import subscriptionRoutes from './modules/subscriptions/subscriptionRoutes.js';
import orderRoutes from './modules/orders/orderRoutes.js';
import cartRoutes from './modules/cart/cartRoutes.js';
import addressRoutes from './modules/addresses/addressRoutes.js';
import wishlistRoutes from './modules/wishlists/wishlistRoutes.js';
import paymentRoutes from './modules/payments/paymentRoutes.js';
import uploadRoutes from './modules/upload/uploadRoutes.js';
import reviewRoutes from './modules/reviews/reviewRoutes.js';
import adminRoutes from './modules/admin/adminRoutes.js';
import newsletterRoutes from './modules/newsletter/newsletterRoutes.js';
import supportRoutes from './modules/support/supportRoutes.js';
import { setupSwagger } from './config/swagger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Setup Swagger Docs
setupSwagger(app);

// Routes will be mounted here
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/providers', providerRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/wishlists', wishlistRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);
app.use('/api/v1/support', supportRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Welcome to ReadMore Backend API' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running smoothly.' });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
