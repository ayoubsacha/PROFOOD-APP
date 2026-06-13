const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../../../middleware/authMiddleware');
const activeAccountMiddleware = require('../../../middleware/activeAccountMiddleware');
const validateRequest = require('../../../middleware/validateRequest');
const validators = require('../validators/auth.validators');

const router = express.Router();

router.post('/login', validators.loginValidator, validateRequest, authController.login);

router.get('/me', authMiddleware, activeAccountMiddleware, authController.me);
router.patch(
  '/me',
  authMiddleware,
  activeAccountMiddleware,
  validators.updateProfileValidator,
  validateRequest,
  authController.updateMe,
);
router.patch(
  '/me/password',
  authMiddleware,
  activeAccountMiddleware,
  validators.changePasswordValidator,
  validateRequest,
  authController.changePassword,
);

module.exports = router;
