const express = require('express');
const controller = require('../controllers/order.controller');
const authMiddleware = require('../../../middleware/authMiddleware');
const activeAccountMiddleware = require('../../../middleware/activeAccountMiddleware');
const roleMiddleware = require('../../../middleware/roleMiddleware');
const validateRequest = require('../../../middleware/validateRequest');
const validators = require('../validators/order.validators');

const router = express.Router();

router.use(authMiddleware, activeAccountMiddleware);

router.get(
  '/',
  roleMiddleware('ADMIN', 'FOURNISSEUR', 'CLIENT_PRO'),
  validators.listOrdersValidator,
  validateRequest,
  controller.listOrders,
);
router.get(
  '/:id',
  roleMiddleware('ADMIN', 'FOURNISSEUR', 'CLIENT_PRO'),
  validators.orderIdValidator,
  validateRequest,
  controller.getOrder,
);
router.patch(
  '/:id/status',
  roleMiddleware('ADMIN', 'FOURNISSEUR'),
  validators.updateOrderStatusValidator,
  validateRequest,
  controller.updateOrderStatus,
);

module.exports = router;
