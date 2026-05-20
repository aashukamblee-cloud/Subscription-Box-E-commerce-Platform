import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true },
  description: { type: String },
  category: { 
    type: String,
    required: true
  },
  tags: [String],
  specs: { type: Map, of: String },
  price: { type: Number },
  cost: { type: Number }, // Cost price for margin calculation
  stock: { type: Number, default: 0 },
  images: [String], // URLs
  weight: { type: Number }, // For shipping calculations
  dimensions: { 
    length: Number, 
    width: Number, 
    height: Number 
  },
  isActive: { type: Boolean, default: true },
  metadata: {
    brand: String,
    allergens: [String],
    isVegan: Boolean,
    isOrganic: Boolean
  }
}, { timestamps: true });

// Indexes
productSchema.index({ category: 1, isActive: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
