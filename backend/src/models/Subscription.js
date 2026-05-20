import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  status: { 
    type: String, 
    enum: ['active', 'paused', 'cancelled', 'past_due', 'trialing', 'expired'], 
    default: 'active' 
  },
  stripeSubscriptionId: { type: String },
  stripeCustomerId: { type: String },
  currentPeriodStart: { type: Date },
  currentPeriodEnd: { type: Date },
  renewalDate: { type: Date },
  pausedAt: { type: Date },
  pauseUntil: { type: Date }, // Max 3 months
  cancelledAt: { type: Date },
  cancellationReason: { type: String },
  skippedMonths: [{ type: Date }],
  addOns: [{
    name: String,
    price: Number
  }],
  appliedCoupon: {
    code: String,
    discountPercent: Number
  },
  billingHistory: [{
    date: Date,
    amount: Number,
    status: String, // 'paid', 'failed', 'refunded'
    invoiceId: String
  }],
  metadata: {
    upgradeHistory: [{
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
      to: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
      date: Date
    }],
    totalSpent: { type: Number, default: 0 },
    monthsActive: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Indexes
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ renewalDate: 1 });
subscriptionSchema.index({ planId: 1, status: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
