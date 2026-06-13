const express = require('express');
const controller = require('../controllers/product.controller');
const authMiddleware = require('../../../middleware/authMiddleware');
const roleMiddleware = require('../../../middleware/roleMiddleware');
const activeAccountMiddleware = require('../../../middleware/activeAccountMiddleware');
const validateRequest = require('../../../middleware/validateRequest');
const validators = require('../validators/product.validators');

const router = express.Router();

router.use(authMiddleware, activeAccountMiddleware);

router.get('/', validators.listProductsValidator, validateRequest, controller.listProducts);
router.get(
  '/:identifier',
  validators.productIdentifierValidator,
  validateRequest,
  controller.getProduct,
);
router.post(
  '/',
  roleMiddleware('FOURNISSEUR'),
  validators.createProductValidator,
  validateRequest,
  controller.createProduct,
);
router.patch(
  '/:id',
  roleMiddleware('ADMIN', 'FOURNISSEUR'),
  validators.updateProductValidator,
  validateRequest,
  controller.updateProduct,
);
router.patch(
  '/:id/stock',
  roleMiddleware('FOURNISSEUR'),
  validators.stockValidator,
  validateRequest,
  controller.updateStock,
);
router.patch(
  '/:id/disable',
  roleMiddleware('ADMIN'),
  validators.productIdValidator,
  validateRequest,
  controller.disableProduct,
);
router.delete(
  '/:id',
  roleMiddleware('ADMIN', 'FOURNISSEUR'),
  validators.productIdValidator,
  validateRequest,
  controller.deleteProduct,
);

module.exports = router;
