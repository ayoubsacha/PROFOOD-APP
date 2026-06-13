const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    clientProId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fournisseurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lastMessage: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true },
);

conversationSchema.index({ clientProId: 1, fournisseurId: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);
