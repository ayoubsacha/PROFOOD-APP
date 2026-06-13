const mongoose = require('mongoose');
const slugify = require('../../../utils/slugify');

const PRODUCT_STATUSES = ['ACTIVE', 'DISABLED', 'OUT_OF_STOCK'];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 160,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    fournisseurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fournisseurName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      trim: true,
      default: '',
    },
    characteristics: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: PRODUCT_STATUSES,
      default: 'ACTIVE',
      index: true,
    },
  },
  { timestamps: true },
);

productSchema.pre('validate', function assignSlug() {
  if (!this.slug && this.name) {
    this.slug = `${slugify(this.name)}-${Date.now().toString(36)}`;
  }

  if (this.stockQuantity <= 0 && this.status === 'ACTIVE') {
    this.status = 'OUT_OF_STOCK';
  }
});

module.exports = mongoose.model('Product', productSchema);
module.exports.PRODUCT_STATUSES = PRODUCT_STATUSES;
