const { body, param } = require('express-validator');

const addItemValidator = [
  body('productId').isMongoId(),
  body('quantity').isInt({ min: 1 }).toInt(),
];

const updateQuantityValidator = [
  param('productId').isMongoId(),
  body('quantity').isInt({ min: 1 }).toInt(),
];

const productIdParamValidator = [param('productId').isMongoId()];

const validateCartValidator = [
  body('paymentInfo').optional().isObject(),
  body('paymentInfo.method').optional().isString().trim().isLength({ max: 80 }),
  body('paymentInfo.cardNumber').not().exists().withMessage('Full card number must not be sent'),
  body('paymentInfo.cvv').not().exists().withMessage('CVV must not be sent'),
  body('checkoutInfo').optional().isObject(),
  body('checkoutInfo.contactName').optional().isString().trim().isLength({ max: 120 }),
  body('checkoutInfo.companyName').optional().isString().trim().isLength({ max: 160 }),
  body('checkoutInfo.email').optional({ values: 'falsy' }).isEmail().normalizeEmail(),
  body('checkoutInfo.phone').optional().isString().trim().isLength({ max: 40 }),
  body('checkoutInfo.address').optional().isString().trim().isLength({ max: 260 }),
  body('checkoutInfo.city').optional().isString().trim().isLength({ max: 120 }),
  body('checkoutInfo.notes').optional().isString().trim().isLength({ max: 500 }),
];

module.exports = {
  addItemValidator,
  updateQuantityValidator,
  productIdParamValidator,
  validateCartValidator,
};
