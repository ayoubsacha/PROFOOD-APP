const crypto = require('crypto');
const AppError = require('../../../utils/AppError');
const Cart = require('../models/cart.model');
const Product = require('../../catalog-service/models/product.model');
const Order = require('../../order-service/models/order.model');

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

function getDocumentId(value) {
  return value?._id?.toString() || value?.toString();
}

async function getOrCreateCart(clientProId) {
  let cart = await Cart.findOne({ clientProId }).populate('items.productId');

  if (!cart) {
    cart = await Cart.create({ clientProId, items: [], totalPrice: 0 });
  }

  return cart;
}

async function saveCart(cart) {
  cart.totalPrice = calculateTotal(cart.items);
  await cart.save();
  return Cart.findById(cart._id).populate('items.productId');
}

async function addItem(clientProId, productId, quantity) {
  const product = await Product.findById(productId);

  if (!product || product.status !== 'ACTIVE') {
    throw new AppError('Product is not available', 404);
  }

  if (product.stockQuantity < quantity) {
    throw new AppError('Requested quantity exceeds available stock', 400);
  }

  const cart = await getOrCreateCart(clientProId);
  const existingItem = cart.items.find((item) => getDocumentId(item.productId) === productId);

  if (existingItem) {
    const nextQuantity = existingItem.quantity + quantity;

    if (product.stockQuantity < nextQuantity) {
      throw new AppError('Requested quantity exceeds available stock', 400);
    }

    existingItem.quantity = nextQuantity;
    existingItem.unitPrice = product.price;
  } else {
    cart.items.push({
      productId: product._id,
      fournisseurId: product.fournisseurId,
      quantity,
      unitPrice: product.price,
    });
  }

  return saveCart(cart);
}

async function updateQuantity(clientProId, productId, quantity) {
  const cart = await getOrCreateCart(clientProId);
  const item = cart.items.find((cartItem) => getDocumentId(cartItem.productId) === productId);

  if (!item) {
    throw new AppError('Cart item not found', 404);
  }

  const product = await Product.findById(productId);

  if (!product || product.status !== 'ACTIVE') {
    throw new AppError('Product is not available', 404);
  }

  if (product.stockQuantity < quantity) {
    throw new AppError('Requested quantity exceeds available stock', 400);
  }

  item.quantity = quantity;
  item.unitPrice = product.price;
  item.fournisseurId = product.fournisseurId;

  return saveCart(cart);
}

async function removeItem(clientProId, productId) {
  const cart = await getOrCreateCart(clientProId);
  cart.items = cart.items.filter((item) => getDocumentId(item.productId) !== productId);
  return saveCart(cart);
}

async function clearCart(clientProId) {
  const cart = await getOrCreateCart(clientProId);
  cart.items = [];
  return saveCart(cart);
}

function sanitizePaymentInfo(paymentInfo = {}) {
  return {
    method: paymentInfo.method || 'FAKE_CARD',
    status: 'PAID',
    transactionReference: `FAKE-${crypto.randomBytes(8).toString('hex').toUpperCase()}`,
    date: new Date(),
  };
}

function sanitizeCheckoutInfo(checkoutInfo = {}) {
  return {
    contactName: checkoutInfo.contactName || '',
    companyName: checkoutInfo.companyName || '',
    email: checkoutInfo.email || '',
    phone: checkoutInfo.phone || '',
    address: checkoutInfo.address || '',
    city: checkoutInfo.city || '',
    notes: checkoutInfo.notes || '',
  };
}

async function validateCart(clientProId, paymentInfo = {}, checkoutInfo = {}) {
  const cart = await Cart.findOne({ clientProId });

  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  const orderItems = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);

    if (!product || product.status !== 'ACTIVE') {
      throw new AppError('A product in the cart is no longer available', 400);
    }

    if (product.stockQuantity < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    product.stockQuantity -= item.quantity;
    if (product.stockQuantity === 0) {
      product.status = 'OUT_OF_STOCK';
    }
    await product.save();

    orderItems.push({
      productId: product._id,
      fournisseurId: product.fournisseurId,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
      totalPrice: item.quantity * product.price,
    });
  }

  const safePaymentInfo = sanitizePaymentInfo(paymentInfo);
  const safeCheckoutInfo = sanitizeCheckoutInfo(checkoutInfo);
  const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const order = await Order.create({
    clientProId,
    items: orderItems,
    totalAmount,
    orderStatus: 'PENDING',
    paymentStatus: safePaymentInfo.status,
    paymentInfo: safePaymentInfo,
    checkoutInfo: safeCheckoutInfo,
  });

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  return order;
}

module.exports = {
  getOrCreateCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  validateCart,
};
