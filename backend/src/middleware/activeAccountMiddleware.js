const AppError = require('../utils/AppError');

function activeAccountMiddleware(req, res, next) {
  if (!req.user) {
    return next(new AppError('Authentication is required', 401));
  }

  if (req.user.status !== 'ACTIVE') {
    return next(new AppError('Your account is not active', 403));
  }

  return next();
}

module.exports = activeAccountMiddleware;
