const express = require('express');
const controller = require('../controllers/notification.controller');
const authMiddleware = require('../../../middleware/authMiddleware');
const activeAccountMiddleware = require('../../../middleware/activeAccountMiddleware');
const validateRequest = require('../../../middleware/validateRequest');
const validators = require('../validators/notification.validators');

const router = express.Router();

router.use(authMiddleware, activeAccountMiddleware);

router.get('/', controller.listNotifications);
router.get('/unread-count', controller.unreadCount);
router.patch('/read-all', controller.markAllRead);
router.patch('/:id/read', validators.notificationIdValidator, validateRequest, controller.markRead);

module.exports = router;
