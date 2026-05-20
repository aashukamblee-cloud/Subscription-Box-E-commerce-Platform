import Subscription from '../models/Subscription.js';
import Plan from '../models/Plan.js';
import { successResponse, errorResponse, paginateResponse } from '../utils/apiResponse.js';

export const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user.id })
      .populate('planId')
      .sort('-createdAt');
    successResponse(res, subscriptions);
  } catch (error) {
    next(error);
  }
};

export const createSubscription = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const plan = await Plan.findById(planId);
    
    if (!plan) return errorResponse(res, 'Plan not found', 404);

    const subscription = await Subscription.create({
      userId: req.user.id,
      planId,
      status: 'active',
      renewalDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    });

    successResponse(res, subscription, 'Subscription created', 201);
  } catch (error) {
    next(error);
  }
};

export const pauseSubscription = async (req, res, next) => {
  try {
    const { months } = req.body;
    const sub = await Subscription.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!sub) return errorResponse(res, 'Subscription not found', 404);
    if (sub.status === 'paused') return errorResponse(res, 'Already paused', 400);

    const pauseDuration = Math.min(parseInt(months) || 1, 3);
    const pauseUntil = new Date();
    pauseUntil.setMonth(pauseUntil.getMonth() + pauseDuration);

    sub.status = 'paused';
    sub.pausedAt = new Date();
    sub.pauseUntil = pauseUntil;
    await sub.save();

    successResponse(res, sub, `Subscription paused for ${pauseDuration} months`);
  } catch (error) {
    next(error);
  }
};

export const resumeSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!sub) return errorResponse(res, 'Subscription not found', 404);
    if (sub.status !== 'paused') return errorResponse(res, 'Not paused', 400);

    sub.status = 'active';
    sub.pausedAt = undefined;
    sub.pauseUntil = undefined;
    await sub.save();

    successResponse(res, sub, 'Subscription resumed');
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const sub = await Subscription.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!sub) return errorResponse(res, 'Subscription not found', 404);

    sub.status = 'cancelled';
    sub.cancellationReason = reason;
    sub.cancelledAt = new Date();
    await sub.save();

    successResponse(res, sub, 'Subscription cancelled');
  } catch (error) {
    next(error);
  }
};

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) query.status = req.query.status;

    const [subs, total] = await Promise.all([
      Subscription.find(query).populate('userId', 'name email').populate('planId', 'name').skip(skip).limit(limit).sort('-createdAt'),
      Subscription.countDocuments(query)
    ]);

    paginateResponse(res, subs, page, limit, total);
  } catch (error) {
    next(error);
  }
};
