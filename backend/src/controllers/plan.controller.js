import Plan from '../models/Plan.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getPlans = async (req, res, next) => {
  try {
    const { category, billingCycle } = req.query;
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (billingCycle) filter.billingCycle = billingCycle;

    const plans = await Plan.find(filter).sort('price');
    successResponse(res, plans);
  } catch (error) {
    next(error);
  }
};

export const getPlan = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return errorResponse(res, 'Plan not found', 404);
    successResponse(res, plan);
  } catch (error) {
    next(error);
  }
};

export const createPlan = async (req, res, next) => {
  try {
    const plan = await Plan.create(req.body);
    successResponse(res, plan, 'Plan created', 201);
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!plan) return errorResponse(res, 'Plan not found', 404);
    successResponse(res, plan, 'Plan updated');
  } catch (error) {
    next(error);
  }
};

export const deletePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!plan) return errorResponse(res, 'Plan not found', 404);
    successResponse(res, null, 'Plan deactivated');
  } catch (error) {
    next(error);
  }
};
