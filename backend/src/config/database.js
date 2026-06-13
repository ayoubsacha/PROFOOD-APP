const mongoose = require('mongoose');
const dns = require('dns');
const env = require('./env');

async function connectDatabase() {
  if (!env.mongoUri) {
    throw new Error('MONGO_URI is required. Add it to your local .env file.');
  }

  if (env.mongoDnsServers.length) {
    dns.setServers(env.mongoDnsServers);
    console.log(`MongoDB DNS servers: ${env.mongoDnsServers.join(', ')}`);
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(env.mongoUri);
  console.log('MongoDB connected');
}

module.exports = connectDatabase;
