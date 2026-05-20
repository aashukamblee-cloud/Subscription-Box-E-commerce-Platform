import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  billingCycle: { type: String, enum: ['monthly', 'quarterly', 'yearly'] },
  category: { type: String }, // 'fitness', 'beauty', 'tech', 'food'
  features: [String],
  includedProducts: { type: Number, default: 5 },
  maxCustomization: { type: Number, default: 3 },
  trialDays: { type: Number, default: 0 },
  isPopular: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  stripePriceId: { type: String },
  stripeProductId: { type: String },
  addOns: [{
    name: String,
    price: Number,
    stripePriceId: String
  }],
  coupons: [{
    code: String,
    discountPercent: Number,
    validUntil: Date,
    maxUses: Number,
    currentUses: { type: Number, default: 0 }
  }],
  shippingRules: {
    freeShipping: Boolean,
    shippingCost: Number,
    estimatedDays: Number
  },
  inventoryLimit: { type: Number }
}, { timestamps: true });

// Pre-save hook to generate slug
planSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

const Plan = mongoose.model('Plan', planSchema);
export default Plan;
