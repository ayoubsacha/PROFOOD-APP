import { ProductCatalogItem } from './product-catalog.models';

export type CatalogueCategorySlug =
  | 'fruits-legumes'
  | 'poissons-fruits-de-mer'
  | 'lait-produits-derives'
  | 'viandes-volailles'
  | 'fruits-secs-graines-noix'
  | 'cuisson'
  | 'fours'
  | 'maintenance'
  | 'installation'
  | 'service-presentation';

export interface CatalogueCategory {
  slug: CatalogueCategorySlug;
  title: string;
  shortTitle: string;
  description: string;
  countLabel: string;
  tone: string;
  image: string;
  families: string[];
}

export const CATALOGUE_CATEGORIES: CatalogueCategory[] = [
  {
    slug: 'fruits-legumes',
    title: 'Fruits et légumes',
    shortTitle: 'Fruits et légumes',
    description: 'Fruits frais, légumes, herbes et produits de saison pour achats B2B.',
    countLabel: 'Produits',
    tone: 'produce',
    image: '/assets/group-produce.png',
    families: [
      'Legumes racines & tubercules',
      'Legumes bulbes',
      'Legumineuses fraiches',
      'Champignons',
      'Herbes aromatiques',
      'Agrumes',
      'Fruits a pepins',
      'Fruits a noyau',
      'Fruits mediterraneens',
      'Fruits rouges',
      'Fruits tropicaux',
      'Melons & pasteques',
    ],
  },
  {
    slug: 'poissons-fruits-de-mer',
    title: 'Poissons et fruits de mer',
    shortTitle: 'Poissons et fruits de mer',
    description: 'Poissons, fruits de mer, crustacés, calamars et produits sous chaîne froide.',
    countLabel: 'Produits',
    tone: 'seafood',
    image: '/assets/group-seafood.png',
    families: [
      'Cephalopodes',
      'Coquillages',
      'Crustaces',
      'Filets & decoupes',
      'Poissons frais',
      'Poissons nobles',
      'Produits surgeles',
    ],
  },
  {
    slug: 'lait-produits-derives',
    title: 'Lait et produits dérivés',
    shortTitle: 'Lait et dérivés',
    description: 'Lait, crème, beurre, fromages, yaourts, desserts lactés et glacerie.',
    countLabel: 'Produits',
    tone: 'dairy',
    image: '/assets/group-dairy.png',
    families: [
      'Beurres & matieres grasses',
      'Cremes',
      'Desserts lactes',
      'Fromages frais',
      'Glacerie',
      'Lait',
      'Matieres grasses laitieres',
      'Yaourts & fermentes',
    ],
  },
  {
    slug: 'viandes-volailles',
    title: 'Viandes et volailles',
    shortTitle: 'Viandes et volailles',
    description: 'Boeuf, agneau, veau, volaille, dinde, découpes et produits préparés.',
    countLabel: 'Produits',
    tone: 'meat',
    image: '/assets/group-meat.png',
    families: [
      'Abats',
      'Charcuterie halal',
      'Produits prepares',
      'Surgeles viande',
      'Viande bovine',
      'Viande caprine',
      'Viande de veau',
      'Viande ovine',
      'Volaille',
    ],
  },
  {
    slug: 'fruits-secs-graines-noix',
    title: 'Fruits secs, graines et noix',
    shortTitle: 'Fruits secs et noix',
    description: 'Raisins secs, sésame, graines, amandes, noix et fruits secs professionnels.',
    countLabel: 'Produits',
    tone: 'dry',
    image: '/assets/group-events.png',
    families: ['Fruits secs & graines', 'Fruits secs & noix', 'Raisins'],
  },
  {
    slug: 'cuisson',
    title: 'Cuisson',
    shortTitle: 'Cuisson',
    description: 'Bain-marie, plancha, friteuse, wok et equipements chauds pour cuisine CHR.',
    countLabel: 'Equipements',
    tone: 'cooking',
    image: '/assets/group-cooking.png',
    families: ['Cuisson'],
  },
  {
    slug: 'fours',
    title: 'Fours',
    shortTitle: 'Fours',
    description: 'Fours mixtes, convection, pizza, patisserie, convoyeur et micro-ondes professionnels.',
    countLabel: 'Equipements',
    tone: 'fours',
    image: '/assets/group-fours.png',
    families: ['Fours'],
  },
  {
    slug: 'maintenance',
    title: 'Maintenance',
    shortTitle: 'Maintenance',
    description: 'Entretien, diagnostic, reparation et SAV pour equipements de cuisine professionnelle.',
    countLabel: 'Services',
    tone: 'maintenance',
    image: '/assets/group-maintenance-service.png',
    families: ['Maintenance'],
  },
  {
    slug: 'installation',
    title: 'Installation',
    shortTitle: 'Installation',
    description: 'Pose, raccordement, mise en service et installation sur site pour cuisines CHR.',
    countLabel: 'Services',
    tone: 'installation',
    image: '/assets/group-installation-service.png',
    families: ['Installation'],
  },
  {
    slug: 'service-presentation',
    title: 'Service & présentation',
    shortTitle: 'Service & présentation',
    description: 'Vaisselle, couverts, verrerie, plateaux et supports buffet pour le service CHR.',
    countLabel: 'Equipements',
    tone: 'service-presentation',
    image: '/assets/group-service-presentation.png',
    families: ['Vaisselle', 'Couverts', 'Verrerie', 'Présentation & service'],
  },
];

export function catalogueCategoryBySlug(slug: string | null): CatalogueCategory | undefined {
  return CATALOGUE_CATEGORIES.find((category) => category.slug === slug);
}

export function categorySliderId(slug: CatalogueCategorySlug): string {
  return `category-slider-${slug}`;
}

export function productBelongsToCategory(
  product: ProductCatalogItem,
  category: CatalogueCategory,
): boolean {
  const productFamily = normalizeCatalogueValue(product.family);
  return category.families.some((family) => normalizeCatalogueValue(family) === productFamily);
}

export function normalizeCatalogueValue(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
