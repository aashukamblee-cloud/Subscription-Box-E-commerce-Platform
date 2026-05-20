import mongoose from 'mongoose';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import Shipment from '../models/Shipment.js';

class AnalyticsService {
  async getMRR() {
    const result = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $lookup: { from: 'plans', localField: 'planId', foreignField: '_id', as: 'plan' } },
      { $unwind: '$plan' },
      {
        $group: {
          _id: null,
          mrr: {
            $sum: {
              $cond: [
                { $eq: ['$plan.billingCycle', 'yearly'] },
                { $divide: ['$plan.price', 12] },
                { $cond: [{ $eq: ['$plan.billingCycle', 'quarterly'] }, { $divide: ['$plan.price', 3] }, '$plan.price'] }
              ]
            }
          }
        }
      }
    ]);
    return result[0]?.mrr || 0;
  }

  async getARR() {
    const mrr = await this.getMRR();
    return mrr * 12;
  }

  async getChurnRate(startDate, endDate) {
    const [activeCount, cancelledCount] = await Promise.all([
      Subscription.countDocuments({ status: 'active', createdAt: { $lte: endDate } }),
      Subscription.countDocuments({ status: 'cancelled', cancelledAt: { $gte: startDate, $lte: endDate } })
    ]);

    const total = activeCount + cancelledCount;
    if (total === 0) return 0;
    return (cancelledCount / total) * 100;
  }

  async getSubscriberGrowth(months = 6) {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    
    return Subscription.aggregate([
      { $match: { createdAt: { $gte: date } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          newSubscribers: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
  }

  async getRevenueOverTime(months = 6) {
    const date = new Date();
    date.setMonth(date.getMonth() - months);

    return Payment.aggregate([
      { $match: { status: 'succeeded', createdAt: { $gte: date } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
  }

  async getRetentionCohorts() {
    // Simplified cohort logic for overview
    return []; 
  }

  async getSegments() {
    return User.aggregate([
      { $match: { role: 'customer' } },
      {
        $group: {
          _id: '$isActive',
          count: { $sum: 1 }
        }
      }
    ]);
  }
}

export default new AnalyticsService();
