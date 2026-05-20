import analyticsService from '../services/analytics.service.js';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import { successResponse } from '../utils/apiResponse.js';

export const getOverview = async (req, res, next) => {
  try {
    const [mrr, arr, activeSubscriptions, totalSubscribers] = await Promise.all([
      analyticsService.getMRR(),
      analyticsService.getARR(),
      Subscription.countDocuments({ status: 'active' }),
      User.countDocuments({ role: 'customer' })
    ]);

    // Simple current month churn calculation
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const churnRate = await analyticsService.getChurnRate(firstDay, lastDay);

    successResponse(res, {
      mrr,
      arr,
      activeSubscriptions,
      totalSubscribers,
      churnRate
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenue = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months, 10) || 6;
    const revenue = await analyticsService.getRevenueOverTime(months);
    successResponse(res, revenue);
  } catch (error) {
    next(error);
  }
};

export const getSubscribers = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months, 10) || 6;
    const growth = await analyticsService.getSubscriberGrowth(months);
    successResponse(res, growth);
  } catch (error) {
    next(error);
  }
};

export const getChurn = async (req, res, next) => {
  try {
    // Return mock or simplified data for churn breakdown
    successResponse(res, {
      reasons: [
        { name: 'Too expensive', value: 40 },
        { name: 'Not using products', value: 30 },
        { name: 'Poor quality', value: 10 },
        { name: 'Other', value: 20 }
      ]
    });
  } catch (error) {
    next(error);
  }
};

export const getRetention = async (req, res, next) => {
  try {
    const cohorts = await analyticsService.getRetentionCohorts();
    successResponse(res, cohorts);
  } catch (error) {
    next(error);
  }
};

export const getShipments = async (req, res, next) => {
  try {
    successResponse(res, {
      onTime: 85,
      delayed: 10,
      returned: 5
    });
  } catch (error) {
    next(error);
  }
};

export const getSegments = async (req, res, next) => {
  try {
    const segments = await analyticsService.getSegments();
    successResponse(res, segments);
  } catch (error) {
    next(error);
  }
};
