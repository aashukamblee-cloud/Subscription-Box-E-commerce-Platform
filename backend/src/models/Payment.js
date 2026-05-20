import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  stripePaymentId: { type: String },
  stripeInvoiceId: { type: String },
  amount: { type: Number },
  currency: { type: String, default: 'usd' },
  status: { 
    type: String, 
    enum: ['succeeded', 'failed', 'refunded', 'pending'] 
  },
  paymentMethod: {
    brand: String,
    last4: String
  },
  refundAmount: { type: Number },
  refundReason: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

// Indexes
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ stripePaymentId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
