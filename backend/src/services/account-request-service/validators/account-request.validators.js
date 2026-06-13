const { body, param, query } = require('express-validator');
const {
  ACCOUNT_REQUEST_STATUSES,
  REQUESTED_ROLES,
} = require('../models/account-request.model');

const submitRequestValidator = [
  body('name').isString().trim().isLength({ min: 2, max: 120 }),
  body('email').isEmail().normalizeEmail(),
  body('requestedRole').isIn(REQUESTED_ROLES),
  body('companyName').optional().isString().trim().isLength({ max: 160 }),
  body('phone').optional().isString().trim().isLength({ max: 40 }),
  body('address').optional().isString().trim().isLength({ max: 240 }),
  body('message').optional().isString().trim().isLength({ max: 1000 }),
];

const listRequestsValidator = [
  query('status').optional().isIn(ACCOUNT_REQUEST_STATUSES),
  query('requestedRole').optional().isIn(REQUESTED_ROLES),
];

const reviewRequestValidator = [
  param('id').isMongoId().withMessage('Valid account request id is required'),
  body('message').optional().isString().trim().isLength({ max: 1000 }),
];

module.exports = {
  submitRequestValidator,
  listRequestsValidator,
  reviewRequestValidator,
};
