import express from 'express';
import { 
  getProducts, getProduct, createProduct, updateProduct, deleteProduct, updateStock
} from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected Admin Routes
router.use(protect);
router.use(authorize(ROLES.SUPERADMIN, ROLES.OPERATOR));

router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/stock', updateStock);

export default router;
