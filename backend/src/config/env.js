const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5055),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4200',
  ragServiceUrl: process.env.RAG_SERVICE_URL || 'http://localhost:8000',
  mongoUri: process.env.MONGO_URI,
  mongoDnsServers: (process.env.MONGO_DNS_SERVERS || '8.8.8.8,8.8.4.4')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};
