const AppError = require('../../../utils/AppError');
const Product = require('../models/product.model');

function isOwner(product, user) {
  return product.fournisseurId.toString() === user._id.toString();
}

function assertCanManage(product, user) {
  if (user.role === 'ADMIN') {
    return;
  }

  if (user.role === 'FOURNISSEUR' && isOwner(product, user)) {
    return;
  }

  throw new AppError('You can only manage your own products', 403);
}

async function listProducts(query = {}, user) {
  const filter = {};

  if (query.category) {
    filter.category = query.category;
  }

  if (query.type) {
    filter.type = query.type;
  }

  if (query.status && user.role === 'ADMIN') {
    filter.status = query.status;
  } else {
    filter.status = { $in: ['ACTIVE', 'OUT_OF_STOCK'] };
  }

  if (user.role === 'FOURNISSEUR' && query.mine === 'true') {
    filter.fournisseurId = user._id;
  }

  return Product.find(filter).sort({ createdAt: -1 });
}

async function getProduct(identifier, user) {
  const query = identifier.match(/^[0-9a-fA-F]{24}$/) ? { _id: identifier } : { slug: identifier };
  const product = await Product.findOne(query);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.status === 'DISABLED' && user.role !== 'ADMIN') {
    throw new AppError('Product not found', 404);
  }

  return product;
}

async function createProduct(payload, user) {
  const product = await Product.create({
    name: payload.name,
    price: payload.price,
    image: payload.image,
    fournisseurId: user._id,
    fournisseurName: user.companyName || user.name,
    category: payload.category,
    type: payload.type,
    characteristics: payload.characteristics || {},
    stockQuantity: payload.stockQuantity || 0,
    status: payload.stockQuantity > 0 ? 'ACTIVE' : 'OUT_OF_STOCK',
  });

  return product;
}

async function updateProduct(productId, payload, user) {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  assertCanManage(product, user);

  const allowed = ['name', 'price', 'image', 'category', 'type', 'characteristics', 'status'];
  allowed.forEach((field) => {
    if (payload[field] !== undefined) {
      product[field] = payload[field];
    }
  });

  if (payload.name && !payload.slug) {
    product.slug = undefined;
  }

  await product.save();
  return product;
}

async function updateStock(productId, stockQuantity, user) {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  assertCanManage(product, user);

  product.stockQuantity = stockQuantity;

  if (stockQuantity <= 0) {
    product.status = 'OUT_OF_STOCK';
  } else if (product.status === 'OUT_OF_STOCK') {
    product.status = 'ACTIVE';
  }

  await product.save();
  return product;
}

async function disableProduct(productId, user) {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (user.role !== 'ADMIN') {
    throw new AppError('Only ADMIN can disable any product', 403);
  }

  product.status = 'DISABLED';
  await product.save();
  return product;
}

async function deleteProduct(productId, user) {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  assertCanManage(product, user);

  if (user.role === 'ADMIN') {
    await product.deleteOne();
    return { deleted: true };
  }

  product.status = 'DISABLED';
  await product.save();
  return product;
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  updateStock,
  disableProduct,
  deleteProduct,
};
