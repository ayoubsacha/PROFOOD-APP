const AppError = require('../../../utils/AppError');
const User = require('../../auth-service/models/user.model');
const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');

function participantQuery(user) {
  if (user.role === 'ADMIN') {
    return {};
  }

  if (user.role === 'CLIENT_PRO') {
    return { clientProId: user._id };
  }

  return { fournisseurId: user._id };
}

function assertParticipant(conversation, user) {
  if (user.role === 'ADMIN') {
    return;
  }

  const isClient = conversation.clientProId.toString() === user._id.toString();
  const isFournisseur = conversation.fournisseurId.toString() === user._id.toString();

  if (!isClient && !isFournisseur) {
    throw new AppError('Conversation not found', 404);
  }
}

async function listConversations(user) {
  return Conversation.find(participantQuery(user))
    .populate('clientProId', 'name email companyName')
    .populate('fournisseurId', 'name email companyName')
    .sort({ updatedAt: -1 });
}

async function startConversation(clientUser, fournisseurId) {
  const fournisseur = await User.findOne({
    _id: fournisseurId,
    role: 'FOURNISSEUR',
    status: 'ACTIVE',
  });

  if (!fournisseur) {
    throw new AppError('Active fournisseur not found', 404);
  }

  const conversation = await Conversation.findOneAndUpdate(
    { clientProId: clientUser._id, fournisseurId },
    { $setOnInsert: { clientProId: clientUser._id, fournisseurId } },
    { new: true, upsert: true },
  );

  return conversation;
}

async function getConversation(conversationId, user) {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  assertParticipant(conversation, user);
  return conversation;
}

async function listMessages(conversationId, user) {
  await getConversation(conversationId, user);

  return Message.find({ conversationId })
    .populate('senderId', 'name role')
    .populate('receiverId', 'name role')
    .sort({ createdAt: 1 });
}

async function sendMessage(conversationId, user, content) {
  const conversation = await getConversation(conversationId, user);

  if (!['CLIENT_PRO', 'FOURNISSEUR'].includes(user.role)) {
    throw new AppError('Only CLIENT_PRO and FOURNISSEUR can send messages', 403);
  }

  const senderIsClient = conversation.clientProId.toString() === user._id.toString();
  const receiverId = senderIsClient ? conversation.fournisseurId : conversation.clientProId;

  const message = await Message.create({
    conversationId,
    senderId: user._id,
    receiverId,
    content,
  });

  conversation.lastMessage = content;
  await conversation.save();

  return message;
}

async function markRead(messageId, user) {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  if (message.receiverId.toString() !== user._id.toString() && user.role !== 'ADMIN') {
    throw new AppError('You can only mark received messages as read', 403);
  }

  message.isRead = true;
  await message.save();
  return message;
}

module.exports = {
  listConversations,
  startConversation,
  listMessages,
  sendMessage,
  markRead,
};
