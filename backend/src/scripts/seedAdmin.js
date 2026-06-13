const bcrypt = require('bcryptjs');
const connectDatabase = require('../config/database');
const User = require('../services/auth-service/models/user.model');

async function seedAdmin() {
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@profood.com';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error('DEFAULT_ADMIN_PASSWORD is required to seed the default admin.');
  }

  await connectDatabase();

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log('Default admin already exists');
    process.exit(0);
  }

  await User.create({
    name: 'Profood Admin',
    email: adminEmail,
    passwordHash: await bcrypt.hash(adminPassword, 12),
    role: 'ADMIN',
    status: 'ACTIVE',
    companyName: 'Profood',
    phone: '',
    address: '',
  });

  console.log(`Default admin created: ${adminEmail}`);
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error('Failed to seed admin:', error);
  process.exit(1);
});
