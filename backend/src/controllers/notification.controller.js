import Notification from '../models/Notification.js';
import { successResponse, errorResponse, paginateResponse } from '../utils/apiResponse.js';

export const getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ userId: req.user.id }).skip(skip).limit(limit).sort('-createdAt'),
      Notification.countDocuments({ userId: req.user.id })
    ]);

    paginateResponse(res, notifications, page, limit, total);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );
    
    if (!notification) return errorResponse(res, 'Notification not found', 404);
    successResponse(res, notification);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );
    successResponse(res, null, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!notification) return errorResponse(res, 'Notification not found', 404);
    successResponse(res, null, 'Notification deleted');
  } catch (error) {
    next(error);
  }
};
