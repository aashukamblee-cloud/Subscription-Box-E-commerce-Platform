import express from 'express';
import { 
  getNotifications, markAsRead, markAllAsRead, deleteNotification 
} from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.route('/:id')
  .put(markAsRead)
  .delete(deleteNotification);

export default router;
