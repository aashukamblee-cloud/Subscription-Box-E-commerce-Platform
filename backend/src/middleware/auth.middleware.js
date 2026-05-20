import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Not authorized to access this route', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return errorResponse(res, 'User no longer exists', 401);
    }

    if (!req.user.isActive) {
      return errorResponse(res, 'User account is deactivated', 401);
    }

    next();
  } catch (err) {
    next(err); // Pass to global error handler to catch expired/invalid tokens
  }
};
