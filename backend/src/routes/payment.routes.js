import express from 'express';
import { 
  createCheckoutSession, handleWebhook, getInvoices, processRefund
} from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

// Webhook is public and uses raw body parsing in app.js
router.post('/webhook', handleWebhook);

router.use(protect);

router.post('/create-checkout', createCheckoutSession);
router.get('/invoices', getInvoices);

router.post('/refund/:id', authorize(ROLES.SUPERADMIN, ROLES.OPERATOR), processRefund);

export default router;
