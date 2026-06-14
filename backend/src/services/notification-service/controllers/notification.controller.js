const asyncHandler = require('../../../utils/asyncHandler');
const notificationService = require('../services/notification.service');

const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.listNotifications(req.user);
  res.json({ success: true, data: notifications });
});

const unreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.unreadCount(req.user);
  res.json({ success: true, data: { count } });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markRead(req.params.id, req.user);
  res.json({ success: true, data: notification });
});

const markAllRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllRead(req.user);
  res.json({ success: true, data: result });
});

module.exports = {
  listNotifications,
  unreadCount,
  markRead,
  markAllRead,
};
