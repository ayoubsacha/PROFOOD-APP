const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const User = require('../services/auth-service/models/user.model');

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return next(new AppError('Authentication token is required', 401));
    }

    if (!env.jwt.secret) {
      return next(new AppError('JWT_SECRET is not configured', 500));
    }

    const payload = jwt.verify(token, env.jwt.secret);
    const user = await User.findById(payload.sub);

    if (!user) {
      return next(new AppError('Authenticated user no longer exists', 401));
    }

    req.user = user;
    req.forwardedAuthContext = {
      userId: user._id.toString(),
      role: user.role,
      status: user.status,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = authMiddleware;
