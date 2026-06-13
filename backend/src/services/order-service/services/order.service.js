const AppError = require('../../../utils/AppError');
const Order = require('../models/order.model');

function filterOrderForUser(order, user) {
  const object = order.toObject ? order.toObject() : order;

  if (user.role !== 'FOURNISSEUR') {
    return object;
  }

  return {
    ...object,
    items: object.items.filter((item) => item.fournisseurId.toString() === user._id.toString()),
  };
}

function orderAccessQuery(user) {
  if (user.role === 'ADMIN') {
    return {};
  }

  if (user.role === 'CLIENT_PRO') {
    return { clientProId: user._id };
  }

  return { 'items.fournisseurId': user._id };
}

async function listOrders(user, filters = {}) {
  const query = orderAccessQuery(user);

  if (filters.orderStatus) {
    query.orderStatus = filters.orderStatus;
  }

  if (filters.paymentStatus) {
    query.paymentStatus = filters.paymentStatus;
  }

  const orders = await Order.find(query).sort({ createdAt: -1 });
  return orders.map((order) => filterOrderForUser(order, user));
}

async function getOrder(orderId, user) {
  const query = { _id: orderId, ...orderAccessQuery(user) };
  const order = await Order.findOne(query);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return filterOrderForUser(order, user);
}

async function updateOrderStatus(orderId, status, user) {
  const query = user.role === 'ADMIN' ? { _id: orderId } : { _id: orderId, ...orderAccessQuery(user) };
  const order = await Order.findOneAndUpdate(
    query,
    { orderStatus: status },
    { returnDocument: 'after', runValidators: true },
  );

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return filterOrderForUser(order, user);
}

module.exports = {
  listOrders,
  getOrder,
  updateOrderStatus,
};
