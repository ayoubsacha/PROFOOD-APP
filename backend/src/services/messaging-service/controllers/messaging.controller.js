const asyncHandler = require('../../../utils/asyncHandler');
const messagingService = require('../services/messaging.service');

const listConversations = asyncHandler(async (req, res) => {
  const conversations = await messagingService.listConversations(req.user);
  res.json({ success: true, data: conversations });
});

const inbox = asyncHandler(async (req, res) => {
  const conversations = await messagingService.listConversations(req.user);
  res.json({ success: true, data: conversations });
});

const startConversation = asyncHandler(async (req, res) => {
  const conversation = await messagingService.startConversation(req.user, req.body.fournisseurId);
  res.status(201).json({ success: true, data: conversation });
});

const contactFournisseur = asyncHandler(async (req, res) => {
  const conversation = await messagingService.contactFournisseur(req.user, req.body);
  res.status(201).json({ success: true, data: conversation });
});

const getConversationThread = asyncHandler(async (req, res) => {
  const thread = await messagingService.getConversationThread(req.params.conversationId, req.user);
  res.json({ success: true, data: thread });
});

const listMessages = asyncHandler(async (req, res) => {
  const messages = await messagingService.listMessages(req.params.conversationId, req.user);
  res.json({ success: true, data: messages });
});

const sendMessage = asyncHandler(async (req, res) => {
  const message = await messagingService.sendMessage(
    req.params.conversationId,
    req.user,
    req.body.body || req.body.content,
  );
  res.status(201).json({ success: true, data: message });
});

const markConversationRead = asyncHandler(async (req, res) => {
  const result = await messagingService.markConversationRead(req.params.conversationId, req.user);
  res.json({ success: true, data: result });
});

const archiveConversation = asyncHandler(async (req, res) => {
  const conversation = await messagingService.archiveConversation(req.params.conversationId, req.user);
  res.json({ success: true, data: conversation });
});

const markRead = asyncHandler(async (req, res) => {
  const message = await messagingService.markRead(req.params.messageId, req.user);
  res.json({ success: true, data: message });
});

module.exports = {
  listConversations,
  inbox,
  startConversation,
  contactFournisseur,
  getConversationThread,
  listMessages,
  sendMessage,
  markConversationRead,
  archiveConversation,
  markRead,
};
