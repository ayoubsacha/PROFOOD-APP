const User = require('../../auth-service/models/user.model');
const AccountRequest = require('../../account-request-service/models/account-request.model');
const Product = require('../../catalog-service/models/product.model');
const Order = require('../../order-service/models/order.model');

async function countBy(model, field, match = {}) {
  return model.aggregate([
    { $match: match },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $project: { _id: 0, key: '$_id', count: 1 } },
    { $sort: { count: -1 } },
  ]);
}

async function getDashboardAnalytics() {
  const [
    totalUsers,
    usersByRole,
    pendingAccountRequests,
    requestsByStatus,
    totalProducts,
    productsByCategory,
    totalOrders,
    ordersByStatus,
    revenueTotals,
    topProducts,
    lowStockProducts,
  ] = await Promise.all([
    User.countDocuments(),
    countBy(User, 'role'),
    AccountRequest.countDocuments({ status: 'PENDING' }),
    countBy(AccountRequest, 'status'),
    Product.countDocuments(),
    countBy(Product, 'category'),
    Order.countDocuments(),
    countBy(Order, 'orderStatus'),
    Order.aggregate([
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          paidOrders: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'PAID'] }, 1, 0],
            },
          },
        },
      },
      { $project: { _id: 0, revenue: 1, averageOrderValue: 1, paidOrders: 1 } },
    ]),
    Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.productName' },
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.totalPrice' },
        },
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, productId: '$_id', productName: 1, quantitySold: 1, revenue: 1 } },
    ]),
    Product.find({ stockQuantity: { $lte: 10 }, status: { $ne: 'DISABLED' } })
      .select('name category stockQuantity fournisseurName status')
      .sort({ stockQuantity: 1 })
      .limit(20),
  ]);

  return {
    totalUsers,
    usersByRole,
    pendingAccountRequests,
    requestsByStatus,
    totalProducts,
    productsByCategory,
    totalOrders,
    ordersByStatus,
    revenue: revenueTotals[0] || { revenue: 0, averageOrderValue: 0, paidOrders: 0 },
    topProducts,
    lowStockProducts,
  };
}

module.exports = {
  getDashboardAnalytics,
};
