const asyncHandler = require('../../../utils/asyncHandler');
const orderService = require('../services/order.service');

const listOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.listOrders(req.user, req.query);
  res.json({ success: true, data: orders });
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrder(req.params.id, req.user);
  res.json({ success: true, data: order });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.orderStatus, req.user);
  res.json({ success: true, data: order });
});

module.exports = {
  listOrders,
  getOrder,
  updateOrderStatus,
};
