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
    totalClients,
    totalFournisseurs,
    usersByRole,
    pendingAccountRequests,
    requestsByStatus,
    pendingRequests,
    totalProducts,
    productsByCategory,
    totalOrders,
    ordersByStatus,
    revenueTotals,
    revenueByMonth,
    topProducts,
    lowStockProducts,
    recentOrders,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'CLIENT_PRO' }),
    User.countDocuments({ role: 'FOURNISSEUR' }),
    countBy(User, 'role'),
    AccountRequest.countDocuments({ status: 'PENDING' }),
    countBy(AccountRequest, 'status'),
    AccountRequest.find({ status: 'PENDING' }).sort({ createdAt: -1 }).limit(8),
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
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          value: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
      {
        $project: {
          _id: 0,
          label: {
            $concat: [
              { $toString: '$_id.month' },
              '/',
              { $toString: '$_id.year' },
            ],
          },
          value: 1,
        },
      },
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
    Order.find().sort({ createdAt: -1 }).limit(10),
    User.find().sort({ createdAt: -1 }).limit(10),
  ]);

  return {
    totalUsers,
    totalClients,
    totalFournisseurs,
    usersByRole,
    pendingAccountRequests,
    requestsByStatus,
    pendingRequests,
    totalProducts,
    productsByCategory,
    totalOrders,
    ordersByStatus,
    revenue: revenueTotals[0] || { revenue: 0, averageOrderValue: 0, paidOrders: 0 },
    revenueByMonth,
    topProducts,
    lowStockProducts,
    lowStockCount: lowStockProducts.length,
    recentOrders,
    recentUsers,
  };
}

module.exports = {
  getDashboardAnalytics,
};
