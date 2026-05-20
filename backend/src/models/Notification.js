import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['renewal', 'shipment', 'payment_success', 'payment_failed', 'subscription_paused', 'promo'] 
  },
  title: { type: String },
  message: { type: String },
  isRead: { type: Boolean, default: false },
  channel: { 
    type: String, 
    enum: ['in_app', 'email', 'sms'],
    default: 'in_app'
  },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

// Indexes
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
