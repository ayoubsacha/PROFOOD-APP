const mongoose = require('mongoose');
const dns = require('dns');
const env = require('./env');

const connectionState = {
  status: 'not-started',
  error: null,
  target: null,
};

function maskMongoUri(uri) {
  if (!uri) {
    return null;
  }

  try {
    const parsed = new URL(uri);
    if (parsed.username || parsed.password) {
      parsed.username = '***';
      parsed.password = '***';
    }
    return parsed.toString();
  } catch (error) {
    return uri.replace(/\/\/([^:@/]+):([^@/]+)@/, '//***:***@');
  }
}

function summarizeConnectionError(error) {
  const serverErrors = [];

  if (error.reason?.servers) {
    for (const [server, description] of error.reason.servers) {
      serverErrors.push({
        server,
        message: description.error?.message || 'No server response',
      });
    }
  }

  return {
    name: error.name,
    message: error.message,
    serverErrors,
  };
}

function getDatabaseStatus() {
  return {
    status: mongoose.connection.readyState === 1 ? 'connected' : connectionState.status,
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    target: connectionState.target,
    error: connectionState.error,
  };
}

function databaseUnavailableMessage() {
  return (
    'Database is unavailable. Check MONGO_URI, Atlas network access/IP whitelist, ' +
    'or run a local MongoDB instance for development.'
  );
}

function requireDatabaseConnection(req, res, next) {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    success: false,
    message: databaseUnavailableMessage(),
    database: getDatabaseStatus(),
  });
}

async function connectDatabase(options = {}) {
  const required = options.required ?? true;
  connectionState.target = maskMongoUri(env.mongoUri);
  connectionState.error = null;

  if (!env.mongoUri) {
    const error = new Error('MONGO_URI is required. Add it to your local .env file.');
    connectionState.status = 'missing-config';
    connectionState.error = summarizeConnectionError(error);

    if (required) {
      throw error;
    }

    console.warn(`${error.message} Starting backend without database access.`);
    return false;
  }

  if (env.mongoDnsServers.length) {
    dns.setServers(env.mongoDnsServers);
    console.log(`MongoDB DNS servers: ${env.mongoDnsServers.join(', ')}`);
  }

  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);

  try {
    connectionState.status = 'connecting';
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: env.mongoServerSelectionTimeoutMs,
    });
    connectionState.status = 'connected';
    connectionState.error = null;
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    connectionState.status = 'unavailable';
    connectionState.error = summarizeConnectionError(error);

    if (required) {
      throw error;
    }

    console.warn(`${databaseUnavailableMessage()} Starting backend in degraded mode.`);
    if (connectionState.error.serverErrors.length) {
      console.warn(
        `MongoDB connection errors: ${connectionState.error.serverErrors
          .map((item) => `${item.server}: ${item.message}`)
          .join('; ')}`,
      );
    } else {
      console.warn(`MongoDB connection error: ${error.message}`);
    }

    return false;
  }
}

module.exports = connectDatabase;
module.exports.connectDatabase = connectDatabase;
module.exports.getDatabaseStatus = getDatabaseStatus;
module.exports.requireDatabaseConnection = requireDatabaseConnection;
