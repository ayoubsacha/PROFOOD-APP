const { body, param } = require('express-validator');

const startConversationValidator = [body('fournisseurId').isMongoId()];

const contactFournisseurValidator = [
  body('productId').isMongoId(),
  body('subject').isString().trim().isLength({ min: 2, max: 180 }),
  body('body').isString().trim().isLength({ min: 1, max: 2000 }),
];

const conversationIdValidator = [param('conversationId').isMongoId()];

const sendMessageValidator = [
  param('conversationId').isMongoId(),
  body('content').optional().isString().trim().isLength({ min: 1, max: 2000 }),
  body('body').optional().isString().trim().isLength({ min: 1, max: 2000 }),
  body().custom((value) => {
    if (!value.content && !value.body) {
      throw new Error('Message body is required');
    }

    return true;
  }),
];

const messageIdValidator = [param('messageId').isMongoId()];

module.exports = {
  startConversationValidator,
  contactFournisseurValidator,
  conversationIdValidator,
  sendMessageValidator,
  messageIdValidator,
};
