import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import { successResponse, errorResponse, paginateResponse } from '../utils/apiResponse.js';
import analyticsService from '../services/analytics.service.js';

export const getSubscribers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { role: 'customer' };
    if (req.query.search) {
      query.$or = [
        { name: new RegExp(req.query.search, 'i') },
        { email: new RegExp(req.query.search, 'i') }
      ];
    }

    const [subscribers, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).sort('-createdAt'),
      User.countDocuments(query)
    ]);

    // Populate subscription info for each
    const subscribersWithSubs = await Promise.all(
      subscribers.map(async (user) => {
        const sub = await Subscription.findOne({ userId: user._id, status: { $in: ['active', 'paused', 'past_due'] } })
          .populate('planId', 'name');
        return { ...user.toObject(), subscription: sub };
      })
    );

    paginateResponse(res, subscribersWithSubs, page, limit, total);
  } catch (error) {
    next(error);
  }
};

export const getSubscriber = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'customer' });
    if (!user) return errorResponse(res, 'Subscriber not found', 404);

    const subscriptions = await Subscription.find({ userId: user._id })
      .populate('planId')
      .sort('-createdAt');

    successResponse(res, { user, subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getSegments = async (req, res, next) => {
  try {
    const { segment } = req.query; // 'high_value', 'at_risk', 'cancelled', 'paused'
    
    let matchStage = { status: segment === 'cancelled' ? 'cancelled' : (segment === 'paused' ? 'paused' : 'active') };
    
    // Simplistic example for demo purposes
    const list = await Subscription.find(matchStage)
      .populate('userId', 'name email')
      .populate('planId', 'name')
      .limit(50);
      
    successResponse(res, list);
  } catch (error) {
    next(error);
  }
};

export const exportSubscribers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'customer' }).select('name email phone createdAt');
    // In a real scenario we'd generate a CSV string or file URL
    successResponse(res, users);
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = {
      mrr: await analyticsService.getMRR(),
      totalUsers: await User.countDocuments({ role: 'customer' }),
      activeBoxes: await Subscription.countDocuments({ status: 'active' }),
    };
    successResponse(res, stats);
  } catch (error) {
    next(error);
  }
};
