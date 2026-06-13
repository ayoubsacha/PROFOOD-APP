const createApp = require('./app');
const connectDatabase = require('./config/database');
const env = require('./config/env');

async function startServer() {
  await connectDatabase();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`API Gateway listening on http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
