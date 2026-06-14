const AppError = require('../../../utils/AppError');
const User = require('../../auth-service/models/user.model');
const Product = require('../../catalog-service/models/product.model');
const notificationService = require('../../notification-service/services/notification.service');
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

function isSameId(first, second) {
  return first?.toString() === second?.toString();
}

function assertParticipant(conversation, user) {
  if (user.role === 'ADMIN') {
    return;
  }

  const isClient = isSameId(conversation.clientProId, user._id);
  const isFournisseur = isSameId(conversation.fournisseurId, user._id);

  if (!isClient && !isFournisseur) {
    throw new AppError('Conversation not found', 404);
  }
}

function dashboardRouteForRole(role) {
  if (role === 'FOURNISSEUR') {
    return '/fournisseur/dashboard';
  }

  if (role === 'CLIENT_PRO') {
    return '/client/dashboard?tab=inbox';
  }

  return '/admin/dashboard';
}

async function populateConversation(conversationId) {
  return Conversation.findById(conversationId)
    .populate('clientProId', 'name email companyName role')
    .populate('fournisseurId', 'name email companyName role');
}

async function listConversations(user) {
  const conversations = await Conversation.find(participantQuery(user))
    .populate('clientProId', 'name email companyName role')
    .populate('fournisseurId', 'name email companyName role')
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .lean();

  const conversationIds = conversations.map((conversation) => conversation._id);
  const unreadRows = conversationIds.length
    ? await Message.aggregate([
        {
          $match: {
            conversationId: { $in: conversationIds },
            receiverId: user._id,
            isRead: false,
          },
        },
        { $group: { _id: '$conversationId', count: { $sum: 1 } } },
      ])
    : [];
  const unreadCounts = new Map(
    unreadRows.map((row) => [row._id.toString(), row.count]),
  );

  return conversations.map((conversation) => ({
    ...conversation,
    unreadCount: unreadCounts.get(conversation._id.toString()) || 0,
    lastMessageAt: conversation.lastMessageAt || conversation.updatedAt || conversation.createdAt,
  }));
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

  return populateConversation(conversation._id);
}

async function contactFournisseur(clientUser, { productId, subject, body }) {
  if (clientUser.role !== 'CLIENT_PRO') {
    throw new AppError('Only CLIENT_PRO users can contact fournisseurs', 403);
  }

  const product = await Product.findById(productId);

  if (!product || product.status === 'DISABLED') {
    throw new AppError('Product not found', 404);
  }

  if (isSameId(product.fournisseurId, clientUser._id)) {
    throw new AppError('You cannot contact yourself as a client', 403);
  }

  const content = body.trim();
  const now = new Date();
  const conversation = await Conversation.findOneAndUpdate(
    {
      clientProId: clientUser._id,
      fournisseurId: product.fournisseurId,
    },
    {
      $setOnInsert: {
        clientProId: clientUser._id,
        fournisseurId: product.fournisseurId,
      },
      $set: {
        productId: product._id,
        productName: product.name,
        subject: subject.trim(),
        lastMessage: content,
        lastMessageAt: now,
      },
      $addToSet: {
        products: {
          productId: product._id,
          productName: product.name,
        },
      },
    },
    { new: true, upsert: true },
  );

  await Message.create({
    conversationId: conversation._id,
    senderId: clientUser._id,
    receiverId: product.fournisseurId,
    productId: product._id,
    productName: product.name,
    subject: subject.trim(),
    content,
  });

  await notificationService.createNotification({
    userId: product.fournisseurId,
    type: 'MESSAGE_RECEIVED',
    title: `Nouveau message concernant ${product.name}`,
    message: `${clientUser.companyName || clientUser.name} vous a contacte.`,
    targetRoute: dashboardRouteForRole('FOURNISSEUR'),
    conversationId: conversation._id,
  });

  return populateConversation(conversation._id);
}

async function getConversation(conversationId, user) {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  assertParticipant(conversation, user);
  return conversation;
}

async function getConversationThread(conversationId, user) {
  await getConversation(conversationId, user);

  const [conversation, messages] = await Promise.all([
    populateConversation(conversationId),
    listMessages(conversationId, user),
  ]);

  return { conversation, messages };
}

async function listMessages(conversationId, user) {
  await getConversation(conversationId, user);

  return Message.find({ conversationId })
    .populate('senderId', 'name role companyName')
    .populate('receiverId', 'name role companyName')
    .sort({ createdAt: 1 });
}

async function sendMessage(conversationId, user, content) {
  const conversation = await getConversation(conversationId, user);

  if (!['CLIENT_PRO', 'FOURNISSEUR'].includes(user.role)) {
    throw new AppError('Only CLIENT_PRO and FOURNISSEUR can send messages', 403);
  }

  const senderIsClient = isSameId(conversation.clientProId, user._id);
  const senderIsFournisseur = isSameId(conversation.fournisseurId, user._id);

  if (!senderIsClient && !senderIsFournisseur) {
    throw new AppError('Conversation not found', 404);
  }

  const body = content.trim();
  const receiverId = senderIsClient ? conversation.fournisseurId : conversation.clientProId;
  const receiver = await User.findById(receiverId);
  const message = await Message.create({
    conversationId,
    senderId: user._id,
    receiverId,
    content: body,
  });

  conversation.lastMessage = body;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  await notificationService.createNotification({
    userId: receiverId,
    type: senderIsClient ? 'MESSAGE_RECEIVED' : 'MESSAGE_REPLY',
    title: senderIsClient
      ? `Nouveau message concernant ${conversation.productName || 'un produit'}`
      : `Reponse du fournisseur concernant ${conversation.productName || 'un produit'}`,
    message: `${user.companyName || user.name} a envoye un message.`,
    targetRoute: dashboardRouteForRole(receiver?.role),
    conversationId: conversation._id,
  });

  return Message.findById(message._id)
    .populate('senderId', 'name role companyName')
    .populate('receiverId', 'name role companyName');
}

async function markConversationRead(conversationId, user) {
  await getConversation(conversationId, user);

  const result = await Message.updateMany(
    {
      conversationId,
      receiverId: user._id,
      isRead: false,
    },
    {
      isRead: true,
      status: 'read',
      readAt: new Date(),
    },
  );

  return { modifiedCount: result.modifiedCount || 0 };
}

async function archiveConversation(conversationId, user) {
  const conversation = await getConversation(conversationId, user);
  conversation.lastMessageAt = conversation.lastMessageAt || conversation.updatedAt;
  await conversation.save();
  return conversation;
}

async function markRead(messageId, user) {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  if (!isSameId(message.receiverId, user._id) && user.role !== 'ADMIN') {
    throw new AppError('You can only mark received messages as read', 403);
  }

  message.isRead = true;
  message.status = 'read';
  message.readAt = new Date();
  await message.save();
  return message;
}

module.exports = {
  listConversations,
  startConversation,
  contactFournisseur,
  getConversationThread,
  listMessages,
  sendMessage,
  markConversationRead,
  archiveConversation,
  markRead,
};
