import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  boxId: { type: mongoose.Schema.Types.ObjectId, ref: 'Box' },
  trackingNumber: { type: String, unique: true },
  courier: { type: String }, // 'fedex', 'ups', 'usps', etc.
  status: { 
    type: String, 
    enum: ['pending', 'packed', 'shipped', 'in_transit', 'delivered', 'delayed', 'returned'], 
    default: 'pending' 
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  estimatedDelivery: { type: Date },
  actualDelivery: { type: Date },
  shippingLabel: { type: String }, // URL
  weight: { type: Number },
  cost: { type: Number },
  statusHistory: [{
    status: String,
    date: Date,
    location: String,
    notes: String
  }]
}, { timestamps: true });

// Indexes
shipmentSchema.index({ userId: 1, status: 1 });
shipmentSchema.index({ status: 1, createdAt: -1 });

const Shipment = mongoose.model('Shipment', shipmentSchema);
export default Shipment;
