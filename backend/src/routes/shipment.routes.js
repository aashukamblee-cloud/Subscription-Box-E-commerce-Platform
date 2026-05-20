import express from 'express';
import { 
  getShipments, getShipment, trackShipment, createShipment, 
  updateStatus, getAllShipments, bulkCreate 
} from '../controllers/shipment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/track/:trackingNumber', trackShipment);

router.use(protect);

router.get('/', getShipments);
router.get('/:id', getShipment);

// Admin routes
router.use(authorize(ROLES.SUPERADMIN, ROLES.OPERATOR));

router.get('/admin/all', getAllShipments);
router.post('/', createShipment);
router.put('/:id/status', updateStatus);
router.post('/bulk-create', bulkCreate);

export default router;
