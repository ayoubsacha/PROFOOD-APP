const express = require('express');
const controller = require('../controllers/messaging.controller');
const authMiddleware = require('../../../middleware/authMiddleware');
const activeAccountMiddleware = require('../../../middleware/activeAccountMiddleware');
const roleMiddleware = require('../../../middleware/roleMiddleware');
const validateRequest = require('../../../middleware/validateRequest');
const validators = require('../validators/messaging.validators');

const router = express.Router();

router.use(authMiddleware, activeAccountMiddleware);

router.get(
  '/conversations',
  roleMiddleware('ADMIN', 'FOURNISSEUR', 'CLIENT_PRO'),
  controller.listConversations,
);
router.post(
  '/conversations',
  roleMiddleware('CLIENT_PRO'),
  validators.startConversationValidator,
  validateRequest,
  controller.startConversation,
);
router.get(
  '/conversations/:conversationId/messages',
  roleMiddleware('ADMIN', 'FOURNISSEUR', 'CLIENT_PRO'),
  validators.conversationIdValidator,
  validateRequest,
  controller.listMessages,
);
router.post(
  '/conversations/:conversationId/messages',
  roleMiddleware('FOURNISSEUR', 'CLIENT_PRO'),
  validators.sendMessageValidator,
  validateRequest,
  controller.sendMessage,
);
router.patch(
  '/messages/:messageId/read',
  roleMiddleware('ADMIN', 'FOURNISSEUR', 'CLIENT_PRO'),
  validators.messageIdValidator,
  validateRequest,
  controller.markRead,
);

module.exports = router;
