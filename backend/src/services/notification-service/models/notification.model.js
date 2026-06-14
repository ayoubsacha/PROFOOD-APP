const mongoose = require('mongoose');

const NOTIFICATION_TYPES = ['MESSAGE_RECEIVED', 'MESSAGE_REPLY', 'ORDER_UPDATE'];

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    targetRoute: {
      type: String,
      trim: true,
      default: '',
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      default: null,
      index: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Notification', notificationSchema);
module.exports.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
