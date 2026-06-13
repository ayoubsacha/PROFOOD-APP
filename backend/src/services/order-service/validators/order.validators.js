const { body, param, query } = require('express-validator');
const { ORDER_STATUSES, PAYMENT_STATUSES } = require('../models/order.model');

const listOrdersValidator = [
  query('orderStatus').optional().isIn(ORDER_STATUSES),
  query('paymentStatus').optional().isIn(PAYMENT_STATUSES),
];

const orderIdValidator = [param('id').isMongoId()];

const updateOrderStatusValidator = [
  param('id').isMongoId(),
  body('orderStatus').isIn(ORDER_STATUSES),
];

module.exports = {
  listOrdersValidator,
  orderIdValidator,
  updateOrderStatusValidator,
};
