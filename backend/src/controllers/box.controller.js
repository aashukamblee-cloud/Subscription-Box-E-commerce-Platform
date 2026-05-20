import Box from '../models/Box.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getBoxes = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.month) filter.month = req.query.month;
    if (req.query.year) filter.year = req.query.year;

    const boxes = await Box.find(filter).populate('planId', 'name').sort('-createdAt');
    successResponse(res, boxes);
  } catch (error) {
    next(error);
  }
};

export const createBox = async (req, res, next) => {
  try {
    const box = await Box.create({
      ...req.body,
      createdBy: req.user.id
    });
    successResponse(res, box, 'Box created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateBox = async (req, res, next) => {
  try {
    const box = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!box) return errorResponse(res, 'Box not found', 404);
    successResponse(res, box, 'Box updated');
  } catch (error) {
    next(error);
  }
};

export const publishBox = async (req, res, next) => {
  try {
    const box = await Box.findByIdAndUpdate(req.params.id, { status: 'published' }, { new: true });
    if (!box) return errorResponse(res, 'Box not found', 404);
    successResponse(res, box, 'Box published');
  } catch (error) {
    next(error);
  }
};

export const deleteBox = async (req, res, next) => {
  try {
    const box = await Box.findOne({ _id: req.params.id, status: 'draft' });
    if (!box) return errorResponse(res, 'Box not found or not in draft status', 404);
    
    await box.deleteOne();
    successResponse(res, null, 'Box deleted');
  } catch (error) {
    next(error);
  }
};

export const previewBox = async (req, res, next) => {
  try {
    const box = await Box.findById(req.params.id)
      .populate('planId', 'name price')
      .populate('products.productId');
      
    if (!box) return errorResponse(res, 'Box not found', 404);
    successResponse(res, box);
  } catch (error) {
    next(error);
  }
};
