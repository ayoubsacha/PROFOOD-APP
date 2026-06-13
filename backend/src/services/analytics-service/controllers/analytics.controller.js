const asyncHandler = require('../../../utils/asyncHandler');
const analyticsService = require('../services/analytics.service');

const dashboard = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getDashboardAnalytics();
  res.json({ success: true, data: analytics });
});

module.exports = {
  dashboard,
};
