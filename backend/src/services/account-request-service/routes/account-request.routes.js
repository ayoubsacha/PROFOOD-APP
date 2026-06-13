const express = require('express');
const controller = require('../controllers/account-request.controller');
const authMiddleware = require('../../../middleware/authMiddleware');
const roleMiddleware = require('../../../middleware/roleMiddleware');
const activeAccountMiddleware = require('../../../middleware/activeAccountMiddleware');
const validateRequest = require('../../../middleware/validateRequest');
const validators = require('../validators/account-request.validators');

const router = express.Router();

router.post('/', validators.submitRequestValidator, validateRequest, controller.submitRequest);

router.use(authMiddleware, activeAccountMiddleware, roleMiddleware('ADMIN'));

router.get('/', validators.listRequestsValidator, validateRequest, controller.listRequests);
router.patch(
  '/:id/approve',
  validators.reviewRequestValidator,
  validateRequest,
  controller.approveRequest,
);
router.patch(
  '/:id/refuse',
  validators.reviewRequestValidator,
  validateRequest,
  controller.refuseRequest,
);

module.exports = router;
