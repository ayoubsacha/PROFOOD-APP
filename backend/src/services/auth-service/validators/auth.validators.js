const { body, param, query } = require('express-validator');
const { USER_ROLES, USER_STATUSES } = require('../models/user.model');

const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

const updateProfileValidator = [
  body('name').optional().isString().trim().isLength({ min: 2, max: 120 }),
  body('companyName').optional().isString().trim().isLength({ max: 160 }),
  body('phone').optional().isString().trim().isLength({ max: 40 }),
  body('address').optional().isString().trim().isLength({ max: 240 }),
  body('profileImage').optional().isString().isLength({ max: 5000000 }),
];

const changePasswordValidator = [
  body('currentPassword').isString().notEmpty().withMessage('Current password is required'),
  body('newPassword').isString().isLength({ min: 8 }).withMessage('New password min length is 8'),
];

const userIdValidator = [param('id').isMongoId().withMessage('Valid user id is required')];

const createUserValidator = [
  body('name').isString().trim().isLength({ min: 2, max: 120 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8 }),
  body('role').isIn(USER_ROLES),
  body('status').optional().isIn(USER_STATUSES),
  body('companyName').optional().isString().trim().isLength({ max: 160 }),
  body('phone').optional().isString().trim().isLength({ max: 40 }),
  body('address').optional().isString().trim().isLength({ max: 240 }),
  body('profileImage').optional().isString().isLength({ max: 5000000 }),
];

const updateUserValidator = [
  ...userIdValidator,
  body('name').optional().isString().trim().isLength({ min: 2, max: 120 }),
  body('role').optional().isIn(USER_ROLES),
  body('status').optional().isIn(USER_STATUSES),
  body('companyName').optional().isString().trim().isLength({ max: 160 }),
  body('phone').optional().isString().trim().isLength({ max: 40 }),
  body('address').optional().isString().trim().isLength({ max: 240 }),
  body('profileImage').optional().isString().isLength({ max: 5000000 }),
];

const updateStatusValidator = [
  ...userIdValidator,
  body('status').isIn(USER_STATUSES).withMessage('Invalid user status'),
];

const updateOwnStatusValidator = [
  body('status').isIn(['ACTIVE', 'SUSPENDED']).withMessage('Invalid account status'),
];

const listUsersValidator = [
  query('role').optional().isIn(USER_ROLES),
  query('status').optional().isIn(USER_STATUSES),
];

module.exports = {
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
  createUserValidator,
  updateUserValidator,
  updateStatusValidator,
  updateOwnStatusValidator,
  listUsersValidator,
};
