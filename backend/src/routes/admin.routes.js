import express from 'express';
import { 
  getSubscribers, getSubscriber, getSegments, exportSubscribers, getDashboardStats 
} from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(protect);
router.use(authorize(ROLES.SUPERADMIN, ROLES.OPERATOR));

router.get('/subscribers', getSubscribers);
router.get('/subscribers/segments', getSegments);
router.get('/subscribers/:id', getSubscriber);
router.post('/subscribers/export', exportSubscribers);
router.get('/dashboard/stats', getDashboardStats);

export default router;
