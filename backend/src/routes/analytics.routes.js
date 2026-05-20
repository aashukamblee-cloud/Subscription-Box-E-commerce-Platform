import express from 'express';
import { 
  getOverview, getRevenue, getSubscribers, getChurn, 
  getRetention, getShipments, getSegments
} from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(protect);
router.use(authorize(ROLES.SUPERADMIN, ROLES.OPERATOR));

router.get('/overview', getOverview);
router.get('/revenue', getRevenue);
router.get('/subscribers', getSubscribers);
router.get('/churn', getChurn);
router.get('/retention', getRetention);
router.get('/shipments', getShipments);
router.get('/segments', getSegments);

export default router;
