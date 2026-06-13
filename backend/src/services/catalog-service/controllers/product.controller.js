const asyncHandler = require('../../../utils/asyncHandler');
const productService = require('../services/product.service');

const listProducts = asyncHandler(async (req, res) => {
  const products = await productService.listProducts(req.query, req.user);
  res.json({ success: true, data: products });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProduct(req.params.identifier, req.user);
  res.json({ success: true, data: product });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user);
  res.status(201).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.user);
  res.json({ success: true, data: product });
});

const updateStock = asyncHandler(async (req, res) => {
  const product = await productService.updateStock(req.params.id, req.body.stockQuantity, req.user);
  res.json({ success: true, data: product });
});

const disableProduct = asyncHandler(async (req, res) => {
  const product = await productService.disableProduct(req.params.id, req.user);
  res.json({ success: true, data: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id, req.user);
  res.json({ success: true, data: result });
});

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  updateStock,
  disableProduct,
  deleteProduct,
};
