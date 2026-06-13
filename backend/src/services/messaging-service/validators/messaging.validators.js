const { body, param } = require('express-validator');

const startConversationValidator = [body('fournisseurId').isMongoId()];

const conversationIdValidator = [param('conversationId').isMongoId()];

const sendMessageValidator = [
  param('conversationId').isMongoId(),
  body('content').isString().trim().isLength({ min: 1, max: 2000 }),
];

const messageIdValidator = [param('messageId').isMongoId()];

module.exports = {
  startConversationValidator,
  conversationIdValidator,
  sendMessageValidator,
  messageIdValidator,
};
