const { body, param, query } = require('express-validator');
const { PRODUCT_STATUSES } = require('../models/product.model');

const listProductsValidator = [
  query('category').optional().isString().trim().isLength({ max: 120 }),
  query('type').optional().isString().trim().isLength({ max: 120 }),
  query('status').optional().isIn(PRODUCT_STATUSES),
  query('mine').optional().isIn(['true', 'false']),
];

const createProductValidator = [
  body('name').isString().trim().isLength({ min: 2, max: 160 }),
  body('price').isFloat({ min: 0 }).toFloat(),
  body('image').optional().isString().isLength({ max: 8_000_000 }),
  body('category').isString().trim().isLength({ min: 2, max: 120 }),
  body('type').optional().isString().trim().isLength({ max: 120 }),
  body('characteristics').optional().isObject(),
  body('stockQuantity').optional().isInt({ min: 0 }).toInt(),
];

const updateProductValidator = [
  param('id').isMongoId(),
  body('name').optional().isString().trim().isLength({ min: 2, max: 160 }),
  body('price').optional().isFloat({ min: 0 }).toFloat(),
  body('image').optional().isString().isLength({ max: 8_000_000 }),
  body('category').optional().isString().trim().isLength({ min: 2, max: 120 }),
  body('type').optional().isString().trim().isLength({ max: 120 }),
  body('characteristics').optional().isObject(),
  body('status').optional().isIn(PRODUCT_STATUSES),
];

const productIdValidator = [param('id').isMongoId()];

const productIdentifierValidator = [
  param('identifier').isString().trim().isLength({ min: 1, max: 200 }),
];

const stockValidator = [
  param('id').isMongoId(),
  body('stockQuantity').isInt({ min: 0 }).toInt(),
];

module.exports = {
  listProductsValidator,
  createProductValidator,
  updateProductValidator,
  productIdValidator,
  productIdentifierValidator,
  stockValidator,
};
