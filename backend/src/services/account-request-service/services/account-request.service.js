const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const AppError = require('../../../utils/AppError');
const { sendMail } = require('../../../shared/email/email.service');
const AccountRequest = require('../models/account-request.model');
const User = require('../../auth-service/models/user.model');
const { serializeUser } = require('../../auth-service/services/auth.service');

function generateTemporaryPassword() {
  return `Profood-${crypto.randomBytes(5).toString('base64url')}A1`;
}

async function submitRequest(payload) {
  const pendingRequest = await AccountRequest.findOne({
    email: payload.email.toLowerCase(),
    status: 'PENDING',
  });

  if (pendingRequest) {
    throw new AppError('An account request is already pending for this email', 409);
  }

  const request = await AccountRequest.create(payload);
  return request;
}

async function listRequests(filters = {}) {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.requestedRole) {
    query.requestedRole = filters.requestedRole;
  }

  return AccountRequest.find(query).populate('reviewedBy', 'name email role').sort({
    createdAt: -1,
  });
}

async function reviewRequest(requestId, adminId, decision, reviewMessage = '') {
  const request = await AccountRequest.findById(requestId);

  if (!request) {
    throw new AppError('Account request not found', 404);
  }

  if (request.status !== 'PENDING') {
    throw new AppError('This account request has already been reviewed', 400);
  }

  request.status = decision;
  request.reviewedBy = adminId;
  request.reviewedAt = new Date();
  await request.save();

  if (decision === 'REFUSED') {
    await sendMail({
      to: request.email,
      subject: 'Votre demande Profood a ete refusee',
      text:
        `Bonjour ${request.name},\n\nVotre demande de compte ${request.requestedRole} a ete refusee.` +
        (reviewMessage ? `\n\nMessage admin: ${reviewMessage}` : ''),
    });

    return { request, user: null };
  }

  const existingUser = await User.findOne({ email: request.email.toLowerCase() }).select(
    '+passwordHash',
  );
  let temporaryPassword = null;
  let user;

  if (existingUser) {
    existingUser.name = request.name;
    existingUser.role = request.requestedRole;
    existingUser.status = 'ACTIVE';
    existingUser.companyName = request.companyName;
    existingUser.phone = request.phone;
    existingUser.address = request.address;

    if (!existingUser.passwordHash) {
      temporaryPassword = generateTemporaryPassword();
      existingUser.passwordHash = await bcrypt.hash(temporaryPassword, 12);
    }

    await existingUser.save();
    user = existingUser;
  } else {
    temporaryPassword = generateTemporaryPassword();
    user = await User.create({
      name: request.name,
      email: request.email,
      passwordHash: await bcrypt.hash(temporaryPassword, 12),
      role: request.requestedRole,
      status: 'ACTIVE',
      companyName: request.companyName,
      phone: request.phone,
      address: request.address,
    });
  }

  await sendMail({
    to: request.email,
    subject: 'Votre compte Profood est active',
    text:
      `Bonjour ${request.name},\n\nVotre compte ${request.requestedRole} est maintenant actif.` +
      (temporaryPassword ? `\n\nMot de passe temporaire: ${temporaryPassword}` : ''),
  });

  return { request, user: serializeUser(user) };
}

module.exports = {
  submitRequest,
  listRequests,
  reviewRequest,
};
