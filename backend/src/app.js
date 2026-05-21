import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/error.middleware.js';

// Import routes (will be implemented later)
import authRoutes from './routes/auth.routes.js';
import planRoutes from './routes/plan.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import productRoutes from './routes/product.routes.js';
import boxRoutes from './routes/box.routes.js';
import shipmentRoutes from './routes/shipment.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';
import orderRoutes from './routes/order.routes.js';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'https://subscription-box-e-commerce-platfor.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Stripe webhook needs raw body, so we conditionally parse JSON
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Health check
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/boxes', boxRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// Error Handler Middleware
app.use(errorHandler);

export default app;
