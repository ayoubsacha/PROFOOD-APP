const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../../../config/env');
const AppError = require('../../../utils/AppError');
const User = require('../models/user.model');

function serializeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    companyName: user.companyName,
    phone: user.phone,
    address: user.address,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function signToken(user) {
  if (!env.jwt.secret) {
    throw new AppError('JWT_SECRET is not configured', 500);
  }

  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      status: user.status,
    },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn },
  );
}

async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.status !== 'ACTIVE') {
    throw new AppError('Only ACTIVE accounts can login', 403, { status: user.status });
  }

  return {
    token: signToken(user),
    user: serializeUser(user),
  };
}

async function getProfile(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return serializeUser(user);
}

async function updateProfile(userId, payload) {
  const allowed = ['name', 'companyName', 'phone', 'address'];
  const updates = {};

  allowed.forEach((field) => {
    if (payload[field] !== undefined) {
      updates[field] = payload[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return serializeUser(user);
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId).select('+passwordHash');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 400);
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();

  return true;
}

async function createUser(payload) {
  const passwordHash = await bcrypt.hash(payload.password, 12);

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    passwordHash,
    role: payload.role,
    status: payload.status || 'ACTIVE',
    companyName: payload.companyName,
    phone: payload.phone,
    address: payload.address,
  });

  return serializeUser(user);
}

async function listUsers(filters = {}) {
  const query = {};

  if (filters.role) {
    query.role = filters.role;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  const users = await User.find(query).sort({ createdAt: -1 });
  return users.map(serializeUser);
}

async function updateUser(userId, payload) {
  const allowed = ['name', 'role', 'status', 'companyName', 'phone', 'address'];
  const updates = {};

  allowed.forEach((field) => {
    if (payload[field] !== undefined) {
      updates[field] = payload[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return serializeUser(user);
}

async function updateStatus(userId, status) {
  return updateUser(userId, { status });
}

module.exports = {
  serializeUser,
  login,
  getProfile,
  updateProfile,
  changePassword,
  createUser,
  listUsers,
  updateUser,
  updateStatus,
};
