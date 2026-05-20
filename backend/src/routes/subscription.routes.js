import express from 'express';
import { 
  getSubscriptions, createSubscription, pauseSubscription, 
  resumeSubscription, cancelSubscription, getAllSubscriptions 
} from '../controllers/subscription.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(protect);

// Customer routes
router.route('/')
  .get(getSubscriptions)
  .post(createSubscription);

router.put('/:id/pause', pauseSubscription);
router.put('/:id/resume', resumeSubscription);
router.put('/:id/cancel', cancelSubscription);

// Admin routes
router.get('/admin/all', authorize(ROLES.SUPERADMIN, ROLES.OPERATOR), getAllSubscriptions);

export default router;
