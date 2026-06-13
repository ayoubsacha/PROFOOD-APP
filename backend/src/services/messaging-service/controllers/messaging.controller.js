const asyncHandler = require('../../../utils/asyncHandler');
const messagingService = require('../services/messaging.service');

const listConversations = asyncHandler(async (req, res) => {
  const conversations = await messagingService.listConversations(req.user);
  res.json({ success: true, data: conversations });
});

const startConversation = asyncHandler(async (req, res) => {
  const conversation = await messagingService.startConversation(req.user, req.body.fournisseurId);
  res.status(201).json({ success: true, data: conversation });
});

const listMessages = asyncHandler(async (req, res) => {
  const messages = await messagingService.listMessages(req.params.conversationId, req.user);
  res.json({ success: true, data: messages });
});

const sendMessage = asyncHandler(async (req, res) => {
  const message = await messagingService.sendMessage(
    req.params.conversationId,
    req.user,
    req.body.content,
  );
  res.status(201).json({ success: true, data: message });
});

const markRead = asyncHandler(async (req, res) => {
  const message = await messagingService.markRead(req.params.messageId, req.user);
  res.json({ success: true, data: message });
});

module.exports = {
  listConversations,
  startConversation,
  listMessages,
  sendMessage,
  markRead,
};
