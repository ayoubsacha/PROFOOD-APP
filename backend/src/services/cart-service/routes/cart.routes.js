const express = require('express');
const controller = require('../controllers/cart.controller');
const authMiddleware = require('../../../middleware/authMiddleware');
const activeAccountMiddleware = require('../../../middleware/activeAccountMiddleware');
const roleMiddleware = require('../../../middleware/roleMiddleware');
const validateRequest = require('../../../middleware/validateRequest');
const validators = require('../validators/cart.validators');

const router = express.Router();

router.use(authMiddleware, activeAccountMiddleware, roleMiddleware('CLIENT_PRO'));

router.get('/', controller.getCart);
router.post('/items', validators.addItemValidator, validateRequest, controller.addItem);
router.patch(
  '/items/:productId',
  validators.updateQuantityValidator,
  validateRequest,
  controller.updateQuantity,
);
router.delete(
  '/items/:productId',
  validators.productIdParamValidator,
  validateRequest,
  controller.removeItem,
);
router.delete('/', controller.clearCart);
router.post('/validate', validators.validateCartValidator, validateRequest, controller.validateCart);

module.exports = router;
