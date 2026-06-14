const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');
const connectDatabase = require('../config/database');
const Product = require('../services/catalog-service/models/product.model');
const User = require('../services/auth-service/models/user.model');

const DEFAULT_EQUIPMENT_EMAIL = 'equipements@profood.com';
const DEFAULT_EQUIPMENT_PASSWORD = 'Equipements12345';

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

function normalize(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function isEquipmentItem(item, equipmentEmail) {
  return normalize(item.supplier?.email || '') === normalize(equipmentEmail);
}

function productType(item) {
  return item.cardCharacteristics?.[0] || item.unit || 'EQUIPEMENT';
}

function stockQuantityFor(item) {
  return Math.max(item.maximumQuantity || item.minimumQuantity || 1, 1);
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

async function ensureEquipmentFournisseur() {
  const email = process.env.SEED_EQUIPMENT_EMAIL || DEFAULT_EQUIPMENT_EMAIL;
  const password = process.env.SEED_EQUIPMENT_PASSWORD || DEFAULT_EQUIPMENT_PASSWORD;

  const existing = await User.findOne({ email });

  if (existing) {
    existing.name = 'Atlas Equipements Pro';
    existing.role = 'FOURNISSEUR';
    existing.status = 'ACTIVE';
    existing.companyName = 'Atlas Equipements Pro';
    existing.phone = '06 61 22 44 18';
    existing.address = 'Zone industrielle Sidi Bernoussi, Casablanca';
    existing.passwordHash = await User.hashPassword(password);
    await existing.save();
    return existing;
  }

  return User.create({
    name: 'Atlas Equipements Pro',
    email,
    passwordHash: await User.hashPassword(password),
    role: 'FOURNISSEUR',
    status: 'ACTIVE',
    companyName: 'Atlas Equipements Pro',
    phone: '06 61 22 44 18',
    address: 'Zone industrielle Sidi Bernoussi, Casablanca',
  });
}

async function seedEquipmentSupplier() {
  await connectDatabase();

  const equipmentFournisseur = await ensureEquipmentFournisseur();
  const catalogProducts = readFrontendCatalog().filter((item) =>
    isEquipmentItem(item, equipmentFournisseur.email),
  );

  let created = 0;
  let updated = 0;

  for (const item of catalogProducts) {
    const payload = {
      name: item.name,
      slug: item.slug,
      price: item.priceMad,
      image: item.imageUrl,
      fournisseurId: equipmentFournisseur._id,
      fournisseurName: equipmentFournisseur.companyName || equipmentFournisseur.name,
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
    `Equipment products linked to ${equipmentFournisseur.email}: ${created} created, ${updated} updated, ${catalogProducts.length} total.`,
  );
  console.log(
    `Equipment fournisseur password: ${process.env.SEED_EQUIPMENT_PASSWORD || DEFAULT_EQUIPMENT_PASSWORD}`,
  );
  process.exit(0);
}

seedEquipmentSupplier().catch((error) => {
  console.error('Failed to seed equipment supplier:', error);
  process.exit(1);
});
