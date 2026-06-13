const mongoose = require('mongoose');

const ACCOUNT_REQUEST_STATUSES = ['PENDING', 'ACCEPTED', 'REFUSED'];
const REQUESTED_ROLES = ['FOURNISSEUR', 'CLIENT_PRO'];

const accountRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    requestedRole: {
      type: String,
      enum: REQUESTED_ROLES,
      required: true,
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ACCOUNT_REQUEST_STATUSES,
      default: 'PENDING',
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('AccountRequest', accountRequestSchema);
module.exports.ACCOUNT_REQUEST_STATUSES = ACCOUNT_REQUEST_STATUSES;
module.exports.REQUESTED_ROLES = REQUESTED_ROLES;
