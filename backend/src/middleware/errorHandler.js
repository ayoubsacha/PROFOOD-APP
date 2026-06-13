const AppError = require('../utils/AppError');
const env = require('../config/env');

function normalizeError(error) {
  if (error.name === 'ValidationError') {
    return new AppError(
      'Validation failed',
      400,
      Object.values(error.errors).map((item) => item.message),
    );
  }

  if (error.code === 11000) {
    return new AppError('A record with this value already exists', 409, error.keyValue);
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return new AppError('Invalid or expired token', 401);
  }

  if (error.name === 'CastError') {
    return new AppError('Invalid resource identifier', 400);
  }

  return error;
}

function errorHandler(error, req, res, next) {
  const normalized = normalizeError(error);
  const statusCode = normalized.statusCode || 500;

  if (!normalized.isOperational) {
    console.error(normalized);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal server error' : normalized.message,
    details: normalized.details,
    stack: env.nodeEnv === 'development' ? normalized.stack : undefined,
  });
}

module.exports = errorHandler;
