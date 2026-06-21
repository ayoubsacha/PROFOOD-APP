const createApp = require('./app');
const connectDatabase = require('./config/database');
const env = require('./config/env');

async function startServer() {
  const databaseConnected = await connectDatabase({ required: env.requireMongo });

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`API Gateway listening on http://localhost:${env.port}`);
    if (!databaseConnected) {
      console.warn('Backend is running without database access. API data routes will return 503.');
    }
  });
}

startServer().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
