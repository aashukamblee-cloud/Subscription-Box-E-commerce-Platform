import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

// Order creation supports optional logged-in state (protect is not mandatory, but we handle req.user optionally inside)
router.post('/', (req, res, next) => {
  // Try to parse authorization header if it exists
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return protect(req, res, next);
  }
  next();
}, createOrder);

// Getting all orders is restricted to administrators and operators
router.get('/', protect, authorize(ROLES.SUPERADMIN, ROLES.OPERATOR), getOrders);
router.put('/:id/status', protect, authorize(ROLES.SUPERADMIN, ROLES.OPERATOR), updateOrderStatus);

export default router;
