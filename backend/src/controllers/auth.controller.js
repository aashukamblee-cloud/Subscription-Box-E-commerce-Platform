import User from '../models/User.js';
import stripeService from '../services/stripe.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 'User already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer'
    });

    // Create Stripe customer
    const stripeCustomer = await stripeService.createCustomer(user);
    if (stripeCustomer) {
      user.stripeCustomerId = stripeCustomer.id;
      await user.save({ validateBeforeSave: false });
    }

    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();
    await user.save({ validateBeforeSave: false });

    user.password = undefined;

    successResponse(res, { user, token, refreshToken }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    user.lastLoginAt = new Date();
    
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();
    
    await user.save({ validateBeforeSave: false });
    user.password = undefined;

    successResponse(res, { user, token, refreshToken }, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken && req.user) {
      req.user.refreshTokens = req.user.refreshTokens.filter(t => t.token !== refreshToken);
      await req.user.save({ validateBeforeSave: false });
    }

    successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return errorResponse(res, 'Refresh token required', 400);

    const user = await User.findOne({ 'refreshTokens.token': token });
    if (!user) return errorResponse(res, 'Invalid refresh token', 401);

    const tokenDoc = user.refreshTokens.find(t => t.token === token);
    if (new Date() > tokenDoc.expiresAt) {
      user.refreshTokens = user.refreshTokens.filter(t => t.token !== token);
      await user.save({ validateBeforeSave: false });
      return errorResponse(res, 'Refresh token expired', 401);
    }

    // Replace old refresh token
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== token);
    
    const accessToken = user.generateAuthToken();
    const newRefreshToken = user.generateRefreshToken();
    
    await user.save({ validateBeforeSave: false });

    successResponse(res, { token: accessToken, refreshToken: newRefreshToken }, 'Token refreshed');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    successResponse(res, { user: req.user });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      preferences: req.body.preferences
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    successResponse(res, { user }, 'Profile updated');
  } catch (error) {
    next(error);
  }
};
