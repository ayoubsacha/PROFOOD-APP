const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../../../middleware/authMiddleware');
const roleMiddleware = require('../../../middleware/roleMiddleware');
const activeAccountMiddleware = require('../../../middleware/activeAccountMiddleware');
const validateRequest = require('../../../middleware/validateRequest');
const validators = require('../validators/auth.validators');

const router = express.Router();

router.use(authMiddleware, activeAccountMiddleware, roleMiddleware('ADMIN'));

router.get('/', validators.listUsersValidator, validateRequest, authController.listUsers);
router.post('/', validators.createUserValidator, validateRequest, authController.createUser);
router.patch('/:id', validators.updateUserValidator, validateRequest, authController.updateUser);
router.patch(
  '/:id/status',
  validators.updateStatusValidator,
  validateRequest,
  authController.updateStatus,
);

module.exports = router;
