const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');
const connectDatabase = require('../config/database');
const Product = require('../services/catalog-service/models/product.model');
const User = require('../services/auth-service/models/user.model');

const DEFAULT_FOURNISSEUR_EMAIL = 'fournisseur@profood.com';
const DEFAULT_MAINTENANCE_EMAIL = 'maintenance@profood.ma';
const DEFAULT_MAINTENANCE_PASSWORD = 'Maintenance12345';

function readFrontendCatalog() {
  const catalogPath = path.resolve(process.cwd(), 'src/app/models/product-catalog.models.ts');
  const source = fs.readFileSync(catalogPath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const sandbox = {
    exports: {},
    module: { exports: {} },
  };

  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(transpiled.outputText, sandbox, { filename: catalogPath });

  return sandbox.module.exports.PRODUCT_CATALOG || sandbox.exports.PRODUCT_CATALOG || [];
}

function toCharacteristics(product) {
  return {
    unit: product.unit,
    minimumQuantity: product.minimumQuantity,
    maximumQuantity: product.maximumQuantity,
    quantityStep: product.quantityStep,
    rating: product.rating,
    ratingCount: product.ratingCount,
    location: product.supplier?.location || '',
    phone: product.supplier?.phone || '',
    email: product.supplier?.email || '',
    description: product.description,
    cardCharacteristics: product.cardCharacteristics || [],
    characteristics: product.characteristics || [],
    source: 'frontend-catalog',
  };
}

function normalize(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function isMaintenanceItem(item) {
  return normalize(item.family) === normalize('Maintenance');
}

function isEquipmentItem(item) {
  return normalize(item.family) === normalize('Equipements professionnels');
}

function productType(item) {
  if (isMaintenanceItem(item)) {
    return 'SERVICE';
  }

  if (isEquipmentItem(item)) {
    return 'EQUIPEMENT';
  }

  return item.cardCharacteristics?.[0] || item.unit || 'Catalogue';
}

function stockQuantityFor(item) {
  if (isMaintenanceItem(item)) {
    return 999;
  }

  return Math.max(item.maximumQuantity || item.minimumQuantity || 1, 1);
}

async function ensureMaintenanceFournisseur() {
  const email = process.env.SEED_MAINTENANCE_EMAIL || DEFAULT_MAINTENANCE_EMAIL;
  const password = process.env.SEED_MAINTENANCE_PASSWORD || DEFAULT_MAINTENANCE_PASSWORD;

  const existing = await User.findOne({ email });

  if (existing) {
    existing.name = 'ProTech Maintenance';
    existing.role = 'FOURNISSEUR';
    existing.status = 'ACTIVE';
    existing.companyName = 'ProTech Maintenance SARL';
    existing.phone = '06 55 44 33 22';
    existing.address =
      'Casablanca - Maintenance and repair of professional kitchen equipment';
    await existing.save();
    return existing;
  }

  return User.create({
    name: 'ProTech Maintenance',
    email,
    passwordHash: await User.hashPassword(password),
    role: 'FOURNISSEUR',
    status: 'ACTIVE',
    companyName: 'ProTech Maintenance SARL',
    phone: '06 55 44 33 22',
    address: 'Casablanca - Maintenance and repair of professional kitchen equipment',
  });
}

async function seedCatalogProducts() {
  const fournisseurEmail = process.env.SEED_FOURNISSEUR_EMAIL || DEFAULT_FOURNISSEUR_EMAIL;

  await connectDatabase();

  const fournisseur = await User.findOne({
    email: fournisseurEmail,
    role: 'FOURNISSEUR',
    status: 'ACTIVE',
  });

  if (!fournisseur) {
    throw new Error(`Active fournisseur not found: ${fournisseurEmail}`);
  }

  const maintenanceFournisseur = await ensureMaintenanceFournisseur();
  const catalogProducts = readFrontendCatalog();
  let created = 0;
  let updated = 0;

  for (const item of catalogProducts) {
    const owner = isMaintenanceItem(item) ? maintenanceFournisseur : fournisseur;
    const payload = {
      name: item.name,
      slug: item.slug,
      price: item.priceMad,
      image: item.imageUrl,
      fournisseurId: owner._id,
      fournisseurName: owner.companyName || owner.name,
      category: item.family,
      type: productType(item),
      characteristics: toCharacteristics(item),
      stockQuantity: stockQuantityFor(item),
      status: 'ACTIVE',
    };

    const result = await Product.updateOne(
      { slug: item.slug },
      { $set: payload },
      { upsert: true, runValidators: true },
    );

    if (result.upsertedCount) {
      created += 1;
    } else if (result.modifiedCount) {
      updated += 1;
    }
  }

  console.log(
    `Catalog products linked to ${fournisseur.email}: ${created} created, ${updated} updated, ${catalogProducts.length} total.`,
  );
  console.log(`Maintenance fournisseur ready: ${maintenanceFournisseur.email}`);
  process.exit(0);
}

seedCatalogProducts().catch((error) => {
  console.error('Failed to seed catalog products:', error);
  process.exit(1);
});
