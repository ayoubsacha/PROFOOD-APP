const asyncHandler = require('../../../utils/asyncHandler');
const cartService = require('../services/cart.service');

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getOrCreateCart(req.user._id);
  res.json({ success: true, data: cart });
});

const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.user._id, req.body.productId, req.body.quantity);
  res.status(201).json({ success: true, data: cart });
});

const updateQuantity = asyncHandler(async (req, res) => {
  const cart = await cartService.updateQuantity(
    req.user._id,
    req.params.productId,
    req.body.quantity,
  );
  res.json({ success: true, data: cart });
});

const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user._id, req.params.productId);
  res.json({ success: true, data: cart });
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  res.json({ success: true, data: cart });
});

const validateCart = asyncHandler(async (req, res) => {
  const order = await cartService.validateCart(req.user._id, req.body.paymentInfo, req.body.checkoutInfo);
  res.status(201).json({ success: true, data: order });
});

module.exports = {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  validateCart,
};
