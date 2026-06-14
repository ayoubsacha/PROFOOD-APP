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
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
      index: true,
    },
    productName: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      default: '',
      maxlength: 180,
    },
    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
          },
          productName: {
            type: String,
            trim: true,
            default: '',
          },
        },
      ],
      default: [],
    },
    lastMessage: {
      type: String,
      trim: true,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

conversationSchema.index({ clientProId: 1, fournisseurId: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);
