import Product from '../models/Product.js';
import { successResponse, errorResponse, paginateResponse } from '../utils/apiResponse.js';

export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    const query = { isActive: true };
    if (req.query.category) query.category = req.query.category;
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { tags: searchRegex }
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).sort('-createdAt'),
      Product.countDocuments(query)
    ]);

    paginateResponse(res, products, page, limit, total);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return errorResponse(res, 'Product not found', 404);
    successResponse(res, product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    if (!req.body.sku) {
      req.body.sku = `PRD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    const product = await Product.create(req.body);
    successResponse(res, product, 'Product created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return errorResponse(res, 'Product not found', 404);
    successResponse(res, product, 'Product updated');
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!product) return errorResponse(res, 'Product not found', 404);
    successResponse(res, null, 'Product deactivated');
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      { $inc: { stock: quantity } },
      { new: true }
    );
    if (!product) return errorResponse(res, 'Product not found', 404);
    successResponse(res, product, 'Stock updated');
  } catch (error) {
    next(error);
  }
};
