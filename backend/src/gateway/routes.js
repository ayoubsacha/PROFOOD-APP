const authRoutes = require('../services/auth-service/routes/auth.routes');
const userRoutes = require('../services/auth-service/routes/user.routes');
const accountRequestRoutes = require('../services/account-request-service/routes/account-request.routes');
const productRoutes = require('../services/catalog-service/routes/product.routes');
const cartRoutes = require('../services/cart-service/routes/cart.routes');
const orderRoutes = require('../services/order-service/routes/order.routes');
const messagingRoutes = require('../services/messaging-service/routes/messaging.routes');
const notificationRoutes = require('../services/notification-service/routes/notification.routes');
const analyticsRoutes = require('../services/analytics-service/routes/analytics.routes');
const assistantRoutes = require('../services/assistant-service/routes/assistant.routes');
const { getDatabaseStatus, requireDatabaseConnection } = require('../config/database');

function registerGatewayRoutes(app) {
  app.get('/api/health', (req, res) => {
    const database = getDatabaseStatus();

    res.json({
      success: database.connected,
      service: 'profood-api-gateway',
      status: database.connected ? 'ok' : 'degraded',
      database,
      timestamp: new Date().toISOString(),
    });
  });

  app.use(requireDatabaseConnection);

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/account-requests', accountRequestRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/messages', messagingRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/admin/analytics', analyticsRoutes);
  app.use('/api/assistant', assistantRoutes);
  app.use('/api/rag', assistantRoutes);
}

module.exports = registerGatewayRoutes;
