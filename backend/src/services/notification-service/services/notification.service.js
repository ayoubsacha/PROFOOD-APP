const AppError = require('../../../utils/AppError');
const Notification = require('../models/notification.model');

async function createNotification(payload) {
  return Notification.create(payload);
}

async function listNotifications(user) {
  return Notification.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50);
}

async function unreadCount(user) {
  return Notification.countDocuments({ userId: user._id, read: false });
}

async function markRead(notificationId, user) {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId: user._id },
    { read: true },
    { new: true },
  );

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  return notification;
}

async function markAllRead(user) {
  const result = await Notification.updateMany(
    { userId: user._id, read: false },
    { read: true },
  );

  return { modifiedCount: result.modifiedCount || 0 };
}

module.exports = {
  createNotification,
  listNotifications,
  unreadCount,
  markRead,
  markAllRead,
};
