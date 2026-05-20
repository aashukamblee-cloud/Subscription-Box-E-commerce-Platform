import express from 'express';
import { getPlans, getPlan, createPlan, updatePlan, deletePlan } from '../controllers/plan.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', getPlans);
router.get('/:id', getPlan);

// Admin only routes
router.use(protect);
router.use(authorize(ROLES.SUPERADMIN, ROLES.OPERATOR));

router.post('/', createPlan);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

export default router;
