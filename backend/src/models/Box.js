import mongoose from 'mongoose';

const boxSchema = new mongoose.Schema({
  name: { type: String, required: true },
  month: { type: Number }, // 1-12
  year: { type: Number },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  category: { type: String },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  totalValue: { type: Number },
  maxItems: { type: Number, default: 5 },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },
  scheduledDate: { type: Date },
  previewImage: { type: String },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Box = mongoose.model('Box', boxSchema);
export default Box;
