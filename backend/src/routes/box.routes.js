import express from 'express';
import { 
  getBoxes, createBox, updateBox, publishBox, deleteBox, previewBox 
} from '../controllers/box.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(protect);
router.use(authorize(ROLES.SUPERADMIN, ROLES.OPERATOR));

router.route('/')
  .get(getBoxes)
  .post(createBox);

router.route('/:id')
  .put(updateBox)
  .delete(deleteBox);

router.put('/:id/publish', publishBox);
router.get('/preview/:id', previewBox);

export default router;
