const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');
const connectDatabase = require('../config/database');
const Product = require('../services/catalog-service/models/product.model');
const User = require('../services/auth-service/models/user.model');

const DEFAULT_FOURNISSEUR_EMAIL = 'fournisseur@profood.com';

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

  const catalogProducts = readFrontendCatalog();
  let created = 0;
  let updated = 0;

  for (const item of catalogProducts) {
    const payload = {
      name: item.name,
      slug: item.slug,
      price: item.priceMad,
      image: item.imageUrl,
      fournisseurId: fournisseur._id,
      fournisseurName: fournisseur.companyName || fournisseur.name,
      category: item.family,
      type: item.cardCharacteristics?.[0] || item.unit || 'Catalogue',
      characteristics: toCharacteristics(item),
      stockQuantity: Math.max(item.maximumQuantity || item.minimumQuantity || 1, 1),
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
  process.exit(0);
}

seedCatalogProducts().catch((error) => {
  console.error('Failed to seed catalog products:', error);
  process.exit(1);
});
