export interface ProductSupplier {
  name: string;
  location: string;
  phone: string;
  email: string;
}

export interface ProductCatalogItem {
  id?: string;
  slug: string;
  name: string;
  family: string;
  imageUrl: string;
  imageAlt: string;
  priceMad: number;
  unit: string;
  minimumQuantity: number;
  maximumQuantity: number;
  quantityStep: number;
  rating: number;
  ratingCount: number;
  supplier: ProductSupplier;
  characteristics: string[];
  cardCharacteristics: string[];
  description: string;
}

type ProductImageOverride = {
  imageUrl: string;
  imageAlt: string;
};

const ROOT_TUBER_PRODUCTS: ProductCatalogItem[] = [
  {
    slug: 'pomme-de-terre',
    name: 'Pomme de terre',
    family: 'Légumes racines & tubercules',
    imageUrl: '/assets/product-pomme-de-terre.png',
    imageAlt: 'Pommes de terre fraîches',
    priceMad: 4.8,
    unit: 'kg',
    minimumQuantity: 25,
    maximumQuantity: 500,
    quantityStep: 25,
    rating: 4.6,
    ratingCount: 42,
    supplier: {
      name: 'Profood Primeur',
      location: 'Ain Sebaa, Casablanca',
      phone: '(0522) 655 410',
      email: 'contact@profood-primeur.ma',
    },
    characteristics: [
      'Calibre moyen 45/65',
      'Conditionnement sac 25 kg',
      'Chair ferme pour cuisson professionnelle',
      'Origine Maroc',
      'Stock contrôlé pour restauration et collectivités',
    ],
    cardCharacteristics: ['Sac 25 kg', 'Calibre 45/65'],
    description:
      'Pomme de terre adaptée aux cuisines professionnelles, restaurants et commandes en gros.',
  },
  {
    slug: 'patate-douce',
    name: 'Patate douce',
    family: 'Légumes racines & tubercules',
    imageUrl: '/assets/product-patate-douce.png',
    imageAlt: 'Patate douce coupée montrant sa chair orange',
    priceMad: 9.5,
    unit: 'kg',
    minimumQuantity: 10,
    maximumQuantity: 300,
    quantityStep: 10,
    rating: 4.7,
    ratingCount: 31,
    supplier: {
      name: 'Atlas Primeur',
      location: 'Agdal, Rabat',
      phone: '(0537) 655 220',
      email: 'orders@atlas-primeur.ma',
    },
    characteristics: [
      'Chair orange sucrée',
      'Conditionnement caisse 10 kg',
      'Idéale pour rôtisserie et purée',
      'Origine Maroc',
      'Tri visuel avant expédition',
    ],
    cardCharacteristics: ['Caisse 10 kg', 'Chair orange'],
    description: 'Patate douce fraîche pour préparations chaudes, garnitures et menus premium.',
  },
  {
    slug: 'carotte',
    name: 'Carotte',
    family: 'Légumes racines & tubercules',
    imageUrl: '/assets/product-carotte.png',
    imageAlt: 'Carottes fraîches avec rondelles',
    priceMad: 5.2,
    unit: 'kg',
    minimumQuantity: 20,
    maximumQuantity: 500,
    quantityStep: 20,
    rating: 4.8,
    ratingCount: 56,
    supplier: {
      name: 'Ferme Centrale',
      location: 'Mediouna, Casablanca',
      phone: '(0522) 800 114',
      email: 'vente@ferme-centrale.ma',
    },
    characteristics: [
      'Carotte lavée',
      'Conditionnement sac 20 kg',
      'Calibre régulier',
      'Bonne tenue en cuisson',
      'Origine Maroc',
    ],
    cardCharacteristics: ['Sac 20 kg', 'Lavée'],
    description:
      'Carotte fraîche à calibre stable pour restaurants, traiteurs et cuisines centrales.',
  },
  {
    slug: 'betterave-rouge',
    name: 'Betterave rouge',
    family: 'Légumes racines & tubercules',
    imageUrl: '/assets/product-betterave-rouge.png',
    imageAlt: 'Betteraves rouges fraîches en botte',
    priceMad: 6.9,
    unit: 'kg',
    minimumQuantity: 15,
    maximumQuantity: 300,
    quantityStep: 15,
    rating: 4.4,
    ratingCount: 24,
    supplier: {
      name: 'Marché Agricole',
      location: 'Sidi Bouknadel, Salé',
      phone: '(0537) 900 754',
      email: 'commercial@marche-agricole.ma',
    },
    characteristics: [
      'Racines rouges entières',
      'Conditionnement filet 15 kg',
      'Couleur intense',
      'Convient aux salades et cuissons longues',
      'Produit de saison',
    ],
    cardCharacteristics: ['Filet 15 kg', 'Couleur intense'],
    description:
      'Betterave rouge fraîche pour préparations froides, buffets et restauration collective.',
  },
  {
    slug: 'navet',
    name: 'Navet',
    family: 'Légumes racines & tubercules',
    imageUrl: '/assets/product-navet.png',
    imageAlt: 'Navets blancs frais avec feuilles',
    priceMad: 5.9,
    unit: 'kg',
    minimumQuantity: 15,
    maximumQuantity: 250,
    quantityStep: 15,
    rating: 4.3,
    ratingCount: 18,
    supplier: {
      name: 'Primeur Nord',
      location: 'Tanger Med, Tanger',
      phone: '(0539) 331 708',
      email: 'stock@primeur-nord.ma',
    },
    characteristics: [
      'Navet blanc frais',
      'Conditionnement caisse 15 kg',
      'Texture ferme',
      'Pour tajines, soupes et garnitures',
      'Livraison région nord',
    ],
    cardCharacteristics: ['Caisse 15 kg', 'Texture ferme'],
    description: 'Navet frais sélectionné pour cuisines marocaines, bouillons et garnitures.',
  },
  {
    slug: 'radis-rouge',
    name: 'Radis rouge',
    family: 'Légumes racines & tubercules',
    imageUrl: '/assets/product-radis-rouge.png',
    imageAlt: 'Radis rouges frais avec feuilles vertes',
    priceMad: 7.4,
    unit: 'botte',
    minimumQuantity: 20,
    maximumQuantity: 200,
    quantityStep: 10,
    rating: 4.5,
    ratingCount: 36,
    supplier: {
      name: 'Jardin Pro',
      location: 'Soualem, Casablanca',
      phone: '(0522) 410 774',
      email: 'commande@jardin-pro.ma',
    },
    characteristics: [
      'Bottes fraîches',
      'Feuilles vertes contrôlées',
      'Goût piquant léger',
      'Idéal salade et dressage',
      'Livraison rapide',
    ],
    cardCharacteristics: ['Botte fraîche', 'Goût croquant'],
    description: 'Radis rouge frais pour salades, plateaux et dressage professionnel.',
  },
  {
    slug: 'radis-noir',
    name: 'Radis noir',
    family: 'Légumes racines & tubercules',
    imageUrl: '/assets/product-radis-noir.png',
    imageAlt: 'Radis noir frais',
    priceMad: 8.3,
    unit: 'kg',
    minimumQuantity: 10,
    maximumQuantity: 200,
    quantityStep: 10,
    rating: 4.2,
    ratingCount: 15,
    supplier: {
      name: 'Terroir Marketplace',
      location: 'Gueliz, Marrakech',
      phone: '(0524) 655 454',
      email: 'vente@terroir-marketplace.ma',
    },
    characteristics: [
      'Radis noir entier',
      'Conditionnement caisse 10 kg',
      'Goût prononcé',
      'Produit de saison',
      'Adapté aux bars à salade',
    ],
    cardCharacteristics: ['Caisse 10 kg', 'Goût prononcé'],
    description: 'Radis noir au goût marqué pour salades, garnitures et préparations fraîches.',
  },
  {
    slug: 'celeri-rave',
    name: 'Céleri-rave',
    family: 'Légumes racines & tubercules',
    imageUrl: '/assets/product-celeri-rave.png',
    imageAlt: 'Céleri-rave coupé sur planche',
    priceMad: 10.2,
    unit: 'kg',
    minimumQuantity: 10,
    maximumQuantity: 200,
    quantityStep: 10,
    rating: 4.4,
    ratingCount: 21,
    supplier: {
      name: 'Primeur Atlas',
      location: 'Inezgane, Agadir',
      phone: '(0528) 455 901',
      email: 'pro@primeur-atlas.ma',
    },
    characteristics: [
      'Racine entière',
      'Conditionnement caisse 10 kg',
      'Chair blanche parfumée',
      'Pour purées, salades et veloutés',
      'Calibre sélectionné',
    ],
    cardCharacteristics: ['Caisse 10 kg', 'Chair parfumée'],
    description: 'Céleri-rave frais pour menus bistronomiques, soupes, purées et salades.',
  },
  {
    slug: 'gingembre-frais',
    name: 'Gingembre frais',
    family: 'Légumes racines & tubercules',
    imageUrl: '/assets/product-gingembre-frais.png',
    imageAlt: 'Racine de gingembre frais coupée',
    priceMad: 24.5,
    unit: 'kg',
    minimumQuantity: 5,
    maximumQuantity: 100,
    quantityStep: 5,
    rating: 4.9,
    ratingCount: 63,
    supplier: {
      name: 'Spices Market',
      location: 'Derb Omar, Casablanca',
      phone: '(0522) 244 090',
      email: 'fresh@spices-market.ma',
    },
    characteristics: [
      'Racines fraîches',
      'Conditionnement carton 5 kg',
      'Arôme intense',
      'Pour cuisine asiatique, pâtisserie et boissons',
      'Produit contrôlé à réception',
    ],
    cardCharacteristics: ['Carton 5 kg', 'Arôme intense'],
    description: 'Gingembre frais hautement aromatique pour cuisines professionnelles et boissons.',
  },
  {
    slug: 'curcuma-frais',
    name: 'Curcuma frais',
    family: 'Légumes racines & tubercules',
    imageUrl: '/assets/product-curcuma-frais.png',
    imageAlt: 'Curcuma frais avec poudre et rondelles',
    priceMad: 28,
    unit: 'kg',
    minimumQuantity: 5,
    maximumQuantity: 80,
    quantityStep: 5,
    rating: 4.7,
    ratingCount: 47,
    supplier: {
      name: 'Spices Market',
      location: 'Derb Omar, Casablanca',
      phone: '(0522) 244 090',
      email: 'fresh@spices-market.ma',
    },
    characteristics: [
      'Rhizomes frais',
      'Conditionnement carton 5 kg',
      'Couleur orange intense',
      'Pour sauces, marinades et boissons',
      'Manipulation recommandée avec gants',
    ],
    cardCharacteristics: ['Carton 5 kg', 'Couleur intense'],
    description:
      'Curcuma frais pour cuisines créatives, boissons et préparations professionnelles.',
  },
];

type GeneratedThemeName =
  | 'vegetable'
  | 'herb'
  | 'fruit'
  | 'seafood'
  | 'dairy'
  | 'meat'
  | 'pantry'
  | 'drink'
  | 'oil';

interface GeneratedTheme {
  colors: readonly [string, string, string];
  unit: string;
  minimumQuantity: number;
  maximumQuantity: number;
  quantityStep: number;
  packaging: string;
  shortTrait: string;
  quality: string;
}

interface FoodFamilySeed {
  family: string;
  theme: GeneratedThemeName;
  items: readonly (readonly [name: string, priceMad: number, unit?: string])[];
}

interface EquipmentFamilySeed {
  section: string;
  family: string;
  items: readonly string[];
}

const GENERATED_SUPPLIERS: ProductSupplier[] = [
  {
    name: 'Profood Primeur',
    location: 'Ain Sebaa, Casablanca',
    phone: '(0522) 655 410',
    email: 'contact@profood-primeur.ma',
  },
  {
    name: 'Atlas Fresh Supply',
    location: 'Agdal, Rabat',
    phone: '(0537) 655 220',
    email: 'orders@atlas-fresh.ma',
  },
  {
    name: 'Marsa Seafood Pro',
    location: 'Port de pêche, Agadir',
    phone: '(0528) 455 901',
    email: 'vente@marsa-seafood.ma',
  },
  {
    name: 'Dairy Chef Maroc',
    location: 'Bouskoura, Casablanca',
    phone: '(0522) 410 774',
    email: 'pro@dairychef.ma',
  },
  {
    name: 'Boucherie Centrale Pro',
    location: 'Sidi Maarouf, Casablanca',
    phone: '(0522) 800 114',
    email: 'commande@boucherie-centrale.ma',
  },
  {
    name: 'Casa Epicerie Pro',
    location: 'Derb Omar, Casablanca',
    phone: '(0522) 244 090',
    email: 'stock@casa-epicerie.ma',
  },
  {
    name: 'Terroir Marketplace',
    location: 'Guéliz, Marrakech',
    phone: '(0524) 655 454',
    email: 'vente@terroir-marketplace.ma',
  },
  {
    name: 'Nord Food Logistics',
    location: 'Tanger Med, Tanger',
    phone: '(0539) 331 708',
    email: 'supply@nord-food.ma',
  },
];

const EQUIPMENT_SUPPLIER: ProductSupplier = {
  name: 'Atlas Équipements Pro',
  location: 'Zone industrielle Sidi Bernoussi, Casablanca',
  phone: '06 61 22 44 18',
  email: 'equipements@profood.com',
};

const EQUIPMENT_IMAGE_OVERRIDES: Record<string, ProductImageOverride> = {
  'Bac de salage électrique': {
    imageUrl: '/assets/equipment-products/bac-de-salage-electrique.png',
    imageAlt: 'Bac de salage électrique professionnel en inox',
  },
  'Bain-marie électrique / gaz': {
    imageUrl: '/assets/equipment-products/bain-marie-electrique-gaz.png',
    imageAlt: 'Bain-marie professionnel inox électrique ou gaz',
  },
  'Barbecue & Grill portugais': {
    imageUrl: '/assets/equipment-products/barbecue-grill-portugais.png',
    imageAlt: 'Grill portugais professionnel en inox',
  },
  'Cuiseur à pâtes professionnel': {
    imageUrl: '/assets/equipment-products/cuiseur-pates-professionnel.png',
    imageAlt: 'Cuiseur à pâtes professionnel inox',
  },
  'Cuisinière professionnelle': {
    imageUrl: '/assets/equipment-products/cuisiniere-professionnelle.png',
    imageAlt: 'Cuisinière professionnelle inox pour cuisine CHR',
  },
  'Plancha professionnelle': {
    imageUrl: '/assets/equipment-products/plancha-professionnelle.png',
    imageAlt: 'Plancha professionnelle inox',
  },
  'Friteuse professionnelle': {
    imageUrl: '/assets/equipment-products/friteuse-professionnelle.png',
    imageAlt: 'Friteuse professionnelle inox double bac',
  },
  'Grill à pierre volcanique': {
    imageUrl: '/assets/equipment-products/grill-pierre-volcanique.png',
    imageAlt: 'Grill à pierre volcanique professionnel',
  },
  'Wok professionnel sur feu vif': {
    imageUrl: '/assets/equipment-products/wok-professionnel-feu-vif.png',
    imageAlt: 'Wok professionnel sur feu vif en inox',
  },
  'Chauffe-assiettes électrique': {
    imageUrl: '/assets/equipment-products/chauffe-assiettes-electrique.png',
    imageAlt: 'Chauffe-assiettes électrique professionnel',
  },
  'Four mixte': {
    imageUrl: '/assets/equipment-products/four-mixte.png',
    imageAlt: 'Four mixte professionnel inox',
  },
  'Four à convection': {
    imageUrl: '/assets/equipment-products/four-convection.png',
    imageAlt: 'Four à convection professionnel inox',
  },
  'Four à pizza professionnel': {
    imageUrl: '/assets/equipment-products/four-pizza-professionnel.png',
    imageAlt: 'Four à pizza professionnel double chambre',
  },
  'Four pâtisserie / boulangerie': {
    imageUrl: '/assets/equipment-products/four-patisserie-boulangerie.png',
    imageAlt: 'Four pâtisserie et boulangerie professionnel',
  },
  'Four convoyeur': {
    imageUrl: '/assets/equipment-products/four-convoyeur.png',
    imageAlt: 'Four convoyeur professionnel inox',
  },
  'Micro-ondes professionnel': {
    imageUrl: '/assets/equipment-products/micro-ondes-professionnel.png',
    imageAlt: 'Micro-ondes professionnel inox',
  },
  'Réfrigérateur armoire positive': {
    imageUrl: '/assets/equipment-products/refrigerateur-armoire-positive.png',
    imageAlt: 'Réfrigérateur armoire positive professionnel',
  },
  'Congélateur armoire négative': {
    imageUrl: '/assets/equipment-products/congelateur-armoire-negative.png',
    imageAlt: 'Congélateur armoire négative professionnel',
  },
  'Table réfrigérée': {
    imageUrl: '/assets/equipment-products/table-refrigeree.png',
    imageAlt: 'Table réfrigérée professionnelle inox',
  },
  'Chambre froide positive / négative': {
    imageUrl: '/assets/equipment-products/chambre-froide-positive-negative.png',
    imageAlt: 'Chambre froide professionnelle positive ou négative',
  },
  'Cellule de refroidissement rapide': {
    imageUrl: '/assets/equipment-products/cellule-refroidissement-rapide.png',
    imageAlt: 'Cellule de refroidissement rapide professionnelle',
  },
  'Vitrine réfrigérée de présentation': {
    imageUrl: '/assets/equipment-products/vitrine-refrigeree-presentation.png',
    imageAlt: 'Vitrine réfrigérée de présentation professionnelle',
  },
  'Kit réfrigérée': {
    imageUrl: '/assets/equipment-products/kit-refrigeree.png',
    imageAlt: 'Kit réfrigéré professionnel inox',
  },
  'Machine à glaçons': {
    imageUrl: '/assets/equipment-products/machine-glacons.png',
    imageAlt: 'Machine à glaçons professionnelle inox',
  },
  'Poche à douille + douilles inox': {
    imageUrl: '/assets/equipment-products/poche-douille-douilles-inox.png',
    imageAlt: 'Poche à douille avec douilles inox',
  },
  'Spatule coudée / palette pâtissière': {
    imageUrl: '/assets/equipment-products/spatule-coudee-palette-patissiere.png',
    imageAlt: 'Spatules coudées pâtissières inox',
  },
  'Râpe / zesteur pâtissier': {
    imageUrl: '/assets/equipment-products/rape-zesteur-patissier.png',
    imageAlt: 'Râpe zesteur pâtissier inox',
  },
  'Tamis / passoire fine pâtisserie': {
    imageUrl: '/assets/equipment-products/tamis-passoire-fine-patisserie.png',
    imageAlt: 'Tamis et passoire fine pâtisserie inox',
  },
  'Moules en silicone': {
    imageUrl: '/assets/equipment-products/moules-en-silicone.png',
    imageAlt: 'Moules en silicone pour pâtisserie',
  },
  'Plaque de cuisson perforée / pleine': {
    imageUrl: '/assets/equipment-products/plaque-cuisson-perforee-pleine.png',
    imageAlt: 'Plaques de cuisson perforée et pleine en inox',
  },
  'Rouleau à pâtisserie': {
    imageUrl: '/assets/equipment-products/rouleau-patisserie.png',
    imageAlt: 'Rouleau à pâtisserie en bois',
  },
  'Tapis de travail en silicone / marbre': {
    imageUrl: '/assets/equipment-products/tapis-travail-silicone-marbre.png',
    imageAlt: 'Tapis de travail silicone et plaque marbre pâtissière',
  },
  'Moules à bûche': {
    imageUrl: '/assets/equipment-products/moules-buche.png',
    imageAlt: 'Moules à bûche inox',
  },
  'Moules à entremets / cercles pâtissiers': {
    imageUrl: '/assets/equipment-products/moules-entremets-cercles-patissiers.png',
    imageAlt: 'Cercles pâtissiers inox pour entremets',
  },
  'Moules & cercles professionnels': {
    imageUrl: '/assets/equipment-products/moules-cercles-professionnels.png',
    imageAlt: 'Moules et cercles professionnels inox',
  },
  'Moules à gâteaux ronds / carrés': {
    imageUrl: '/assets/equipment-products/moules-gateaux-ronds-carres.png',
    imageAlt: 'Moules à gâteaux ronds et carrés',
  },
  'Moules à tarte / tartelettes': {
    imageUrl: '/assets/equipment-products/moules-tarte-tartelettes.png',
    imageAlt: 'Moules à tarte et tartelettes',
  },
  'Moules à muffins / cupcakes': {
    imageUrl: '/assets/equipment-products/moules-muffins-cupcakes.png',
    imageAlt: 'Moules à muffins et cupcakes',
  },
  'Batteur-mélangeur sur socle': {
    imageUrl: '/assets/equipment-products/batteur-melangeur-sur-socle.png',
    imageAlt: 'Batteur-mélangeur sur socle professionnel',
  },
  'Batteur sur socle planétaire': {
    imageUrl: '/assets/equipment-products/batteur-socle-planetaire.png',
    imageAlt: 'Batteur sur socle planétaire professionnel',
  },
  'Robot pâtissier multifonction': {
    imageUrl: '/assets/equipment-products/robot-patissier-multifonction.png',
    imageAlt: 'Robot pâtissier multifonction professionnel',
  },
  'Trempeuse à chocolat / tempéreuse': {
    imageUrl: '/assets/equipment-products/trempeuse-chocolat-tempereuse.png',
    imageAlt: 'Tempéreuse à chocolat professionnelle inox',
  },
  'Diviseuse-bouleuse': {
    imageUrl: '/assets/equipment-products/diviseuse-bouleuse.png',
    imageAlt: 'Diviseuse-bouleuse professionnelle',
  },
  'Chambre de pousse / fermentation': {
    imageUrl: '/assets/equipment-products/chambre-pousse-fermentation.png',
    imageAlt: 'Chambre de pousse et fermentation professionnelle',
  },
  'Coupe-légumes / robot-coupe': {
    imageUrl: '/assets/equipment-products/coupe-legumes-robot-coupe.png',
    imageAlt: 'Coupe-légumes robot-coupe professionnel',
  },
  'Hachoir à viande professionnel': {
    imageUrl: '/assets/equipment-products/hachoir-viande-professionnel.png',
    imageAlt: 'Hachoir à viande professionnel inox',
  },
  'Trancheuse professionnelle': {
    imageUrl: '/assets/equipment-products/trancheuse-professionnelle.png',
    imageAlt: 'Trancheuse professionnelle inox',
  },
  'Mixeur plongeant professionnel': {
    imageUrl: '/assets/equipment-products/mixeur-plongeant-professionnel.png',
    imageAlt: 'Mixeur plongeant professionnel',
  },
  'Batteur-mélangeur pâtisserie': {
    imageUrl: '/assets/equipment-products/batteur-melangeur-patisserie.png',
    imageAlt: 'Batteur-mélangeur pâtisserie professionnel',
  },
  'Trancheuse à pain': {
    imageUrl: '/assets/equipment-products/trancheuse-pain.png',
    imageAlt: 'Trancheuse à pain professionnelle',
  },
  'Scie à os électrique': {
    imageUrl: '/assets/equipment-products/scie-os-electrique.png',
    imageAlt: 'Scie à os électrique professionnelle',
  },
  'Épluche-légumes': {
    imageUrl: '/assets/equipment-products/epluche-legumes.png',
    imageAlt: 'Épluche-légumes professionnel inox',
  },
  'Pétrin spiral professionnel': {
    imageUrl: '/assets/equipment-products/petrin-spiral-professionnel.png',
    imageAlt: 'Pétrin spiral professionnel',
  },
  'Laminoir / façonneuse à baguettes': {
    imageUrl: '/assets/equipment-products/laminoir-faconneuse-baguettes.png',
    imageAlt: 'Laminoir façonneuse à baguettes professionnel',
  },
  'Balance de pr\u00e9cision p\u00e2tisserie': {
    imageUrl: '/assets/equipment-products/balance-de-precision-patisserie.png',
    imageAlt: 'Balance de precision patisserie en inox',
  },
  'Chalumeau de cuisine': {
    imageUrl: '/assets/equipment-products/chalumeau-de-cuisine.png',
    imageAlt: 'Chalumeau de cuisine professionnel',
  },
  'Laminoir / sheeter p\u00e2tissier': {
    imageUrl: '/assets/equipment-products/laminoir-sheeter-patissier.png',
    imageAlt: 'Laminoir sheeter patissier professionnel',
  },
  'Fonceuse \u00e0 tartes': {
    imageUrl: '/assets/equipment-products/fonceuse-a-tartes.png',
    imageAlt: 'Fonceuse a tartes professionnelle',
  },
  'D\u00e9poseuse / po\u00ealonneuse chocolat': {
    imageUrl: '/assets/equipment-products/deposeuse-poelonneuse-chocolat.png',
    imageAlt: 'Deposeuse poelonneuse chocolat professionnelle',
  },
  'Guitare p\u00e2tissi\u00e8re': {
    imageUrl: '/assets/equipment-products/guitare-patissiere.png',
    imageAlt: 'Guitare patissiere inox',
  },
  'Corne / raclette p\u00e2tissi\u00e8re': {
    imageUrl: '/assets/equipment-products/corne-raclette-patissiere.png',
    imageAlt: 'Cornes et raclettes patissieres inox',
  },
  'Emporte-pi\u00e8ces': {
    imageUrl: '/assets/equipment-products/emporte-pieces.png',
    imageAlt: 'Set emporte-pieces inox',
  },
  'Saupoudreur \u00e0 sucre glace / cacao': {
    imageUrl: '/assets/equipment-products/saupoudreur-a-sucre-glace-cacao.png',
    imageAlt: 'Saupoudreur a sucre glace et cacao inox',
  },
  'Cul-de-poule inox': {
    imageUrl: '/assets/equipment-products/cul-de-poule-inox.png',
    imageAlt: 'Cul-de-poule inox professionnel',
  },
  'Grille-panini / toaster professionnel': {
    imageUrl: '/assets/equipment-products/grille-panini-toaster-professionnel.png',
    imageAlt: 'Grille-panini toaster professionnel',
  },
  'Lampe chauffante infrarouge de maintien': {
    imageUrl: '/assets/equipment-products/lampe-chauffante-infrarouge-de-maintien.png',
    imageAlt: 'Lampe chauffante infrarouge de maintien',
  },
  'Distributeur de boissons chaudes': {
    imageUrl: '/assets/equipment-products/distributeur-de-boissons-chaudes.png',
    imageAlt: 'Distributeur de boissons chaudes professionnel',
  },
  'Table de travail inox': {
    imageUrl: '/assets/equipment-products/table-de-travail-inox.png',
    imageAlt: 'Table de travail inox professionnelle',
  },
  'Table de d\u00e9barrassage / plonge': {
    imageUrl: '/assets/equipment-products/table-de-debarrassage-plonge.png',
    imageAlt: 'Table de debarrassage plonge inox',
  },
  '\u00c9tag\u00e8re murale / \u00e9tag\u00e8re \u00e0 clayettes': {
    imageUrl: '/assets/equipment-products/etagere-murale-etagere-a-clayettes.png',
    imageAlt: 'Etagere murale a clayettes inox',
  },
  'Chariot GN / chariot p\u00e2tissier': {
    imageUrl: '/assets/equipment-products/chariot-gn-chariot-patissier.png',
    imageAlt: 'Chariot GN patissier inox',
  },
  'Placard bas / meuble bas cuisine': {
    imageUrl: '/assets/equipment-products/placard-bas-meuble-bas-cuisine.png',
    imageAlt: 'Placard bas cuisine inox',
  },
  "Hotte d'aspiration professionnelle": {
    imageUrl: '/assets/equipment-products/hotte-d-aspiration-professionnelle.png',
    imageAlt: "Hotte d'aspiration professionnelle inox",
  },
  'Table de restaurant': {
    imageUrl: '/assets/equipment-products/table-de-restaurant.png',
    imageAlt: 'Table de restaurant',
  },
  'Chaise et tabouret de restaurant': {
    imageUrl: '/assets/equipment-products/chaise-et-tabouret-de-restaurant.png',
    imageAlt: 'Chaise et tabouret de restaurant',
  },
  'Comptoir de bar / de service': {
    imageUrl: '/assets/equipment-products/comptoir-de-bar-de-service.png',
    imageAlt: 'Comptoir de bar et de service',
  },
  'Pr\u00e9sentoir vitrine de comptoir': {
    imageUrl: '/assets/equipment-products/presentoir-vitrine-de-comptoir.png',
    imageAlt: 'Presentoir vitrine de comptoir',
  },
  'Rayonnage de stockage': {
    imageUrl: '/assets/equipment-products/rayonnage-de-stockage.png',
    imageAlt: 'Rayonnage de stockage professionnel',
  },
  'Armoire de stockage ferm\u00e9e': {
    imageUrl: '/assets/equipment-products/armoire-de-stockage-fermee.png',
    imageAlt: 'Armoire de stockage fermee',
  },
  'Bac de stockage alimentaire': {
    imageUrl: '/assets/equipment-products/bac-de-stockage-alimentaire.png',
    imageAlt: 'Bac de stockage alimentaire',
  },
  'Assiettes': {
    imageUrl: '/assets/equipment-products/assiettes.png',
    imageAlt: 'Collection assiettes restaurant',
  },
  'Assiette plate ronde standard': {
    imageUrl: '/assets/equipment-products/assiette-plate-ronde-standard.png',
    imageAlt: 'Assiette plate ronde standard',
  },
  'Assiette creuse / soupe': {
    imageUrl: '/assets/equipment-products/assiette-creuse-soupe.png',
    imageAlt: 'Assiette creuse soupe',
  },
  'Assiette \u00e0 dessert': {
    imageUrl: '/assets/equipment-products/assiette-a-dessert.png',
    imageAlt: 'Assiette a dessert',
  },
  'Assiette \u00e0 pain / beurre': {
    imageUrl: '/assets/equipment-products/assiette-a-pain-beurre.png',
    imageAlt: 'Assiette a pain ou beurre',
  },
  'Assiette de pr\u00e9sentation': {
    imageUrl: '/assets/equipment-products/assiette-de-presentation.png',
    imageAlt: 'Assiette de presentation',
  },
  'Assiette \u00e0 pizza ronde': {
    imageUrl: '/assets/equipment-products/assiette-a-pizza-ronde.png',
    imageAlt: 'Assiette a pizza ronde',
  },
  'Assiette ardoise / en pierre': {
    imageUrl: '/assets/equipment-products/assiette-ardoise-en-pierre.png',
    imageAlt: 'Assiette ardoise en pierre',
  },
  'Assiette rectangulaire / ardoise allong\u00e9e': {
    imageUrl: '/assets/equipment-products/assiette-rectangulaire-ardoise-allongee.png',
    imageAlt: 'Assiette rectangulaire ardoise allongee',
  },
  'Assiette tapas / d\u00e9gustation': {
    imageUrl: '/assets/equipment-products/assiette-tapas-degustation.png',
    imageAlt: 'Assiette tapas degustation',
  },
  'Assiette ovale de service': {
    imageUrl: '/assets/equipment-products/assiette-ovale-de-service.png',
    imageAlt: 'Assiette ovale de service',
  },
  'Bols, ramequins, cocottes': {
    imageUrl: '/assets/equipment-products/bols-ramequins-cocottes.png',
    imageAlt: 'Bols ramequins et cocottes',
  },
  'Coupelle / bol \u00e0 sauce': {
    imageUrl: '/assets/equipment-products/coupelle-bol-a-sauce.png',
    imageAlt: 'Coupelle bol a sauce',
  },
  'Bol \u00e0 soupe / bouillon': {
    imageUrl: '/assets/equipment-products/bol-a-soupe-bouillon.png',
    imageAlt: 'Bol a soupe bouillon',
  },
  'Bol \u00e0 c\u00e9r\u00e9ales / bol cor\u00e9en': {
    imageUrl: '/assets/equipment-products/bol-a-cereales-bol-coreen.png',
    imageAlt: 'Bol a cereales bol coreen',
  },
  'Mug / tasse \u00e0 caf\u00e9 / th\u00e9': {
    imageUrl: '/assets/equipment-products/mug-tasse-a-cafe-the.png',
    imageAlt: 'Mug tasse a cafe ou the',
  },
  'Tasse \u00e0 espresso + soucoupe': {
    imageUrl: '/assets/equipment-products/tasse-a-espresso-soucoupe.png',
    imageAlt: 'Tasse a espresso avec soucoupe',
  },
  'Ramequin individuel': {
    imageUrl: '/assets/equipment-products/ramequin-individuel.png',
    imageAlt: 'Ramequin individuel',
  },
  'Terrine / cocotte mini en fonte': {
    imageUrl: '/assets/equipment-products/terrine-cocotte-mini-en-fonte.png',
    imageAlt: 'Terrine cocotte mini en fonte',
  },
  'Verrines / petits pots service': {
    imageUrl: '/assets/equipment-products/verrines-petits-pots-service.png',
    imageAlt: 'Verrines et petits pots de service',
  },
  'Planche \u00e0 d\u00e9couper de pr\u00e9sentation': {
    imageUrl: '/assets/equipment-products/planche-a-decouper-de-presentation.png',
    imageAlt: 'Planche a decouper de presentation',
  },
  'Saladiers & plats de service': {
    imageUrl: '/assets/equipment-products/saladiers-plats-de-service.png',
    imageAlt: 'Saladiers et plats de service',
  },
  'Fourchettes, couteaux, cuill\u00e8res': {
    imageUrl: '/assets/equipment-products/fourchettes-couteaux-cuilleres.png',
    imageAlt: 'Set fourchettes couteaux et cuilleres',
  },
  'Couteau de table standard': {
    imageUrl: '/assets/equipment-products/couteau-de-table-standard.png',
    imageAlt: 'Couteau de table standard',
  },
  'Fourchette de table': {
    imageUrl: '/assets/equipment-products/fourchette-de-table.png',
    imageAlt: 'Fourchette de table',
  },
  'Cuill\u00e8re \u00e0 soupe / dessert': {
    imageUrl: '/assets/equipment-products/cuillere-a-soupe-dessert.png',
    imageAlt: 'Cuillere a soupe ou dessert',
  },
  'Cuill\u00e8re \u00e0 caf\u00e9 / moka': {
    imageUrl: '/assets/equipment-products/cuillere-a-cafe-moka.png',
    imageAlt: 'Cuillere a cafe moka',
  },
  'Couteau \u00e0 beurre': {
    imageUrl: '/assets/equipment-products/couteau-a-beurre.png',
    imageAlt: 'Couteau a beurre',
  },
  'Fourchette \u00e0 poisson': {
    imageUrl: '/assets/equipment-products/fourchette-a-poisson.png',
    imageAlt: 'Fourchette a poisson',
  },
  'Couteau \u00e0 poisson': {
    imageUrl: '/assets/equipment-products/couteau-a-poisson.png',
    imageAlt: 'Couteau a poisson',
  },
  'Couteau \u00e0 steak': {
    imageUrl: '/assets/equipment-products/couteau-a-steak.png',
    imageAlt: 'Couteau a steak',
  },
  'Cuill\u00e8re de service': {
    imageUrl: '/assets/equipment-products/cuillere-de-service.png',
    imageAlt: 'Cuillere de service',
  },
  'Pince de service inox': {
    imageUrl: '/assets/equipment-products/pince-de-service-inox.png',
    imageAlt: 'Pince de service inox',
  },
  'Louche de service': {
    imageUrl: '/assets/equipment-products/louche-de-service.png',
    imageAlt: 'Louche de service',
  },
  'Spatule / truelle de service': {
    imageUrl: '/assets/equipment-products/spatule-truelle-de-service.png',
    imageAlt: 'Spatule truelle de service',
  },
  'Pelle \u00e0 tarte / g\u00e2teau': {
    imageUrl: '/assets/equipment-products/pelle-a-tarte-gateau.png',
    imageAlt: 'Pelle a tarte ou gateau',
  },
  'Couteaux de d\u00e9coupe / office': {
    imageUrl: '/assets/equipment-products/couteaux-de-decoupe-office.png',
    imageAlt: 'Couteaux de decoupe et office',
  },
  'Collection de verres': {
    imageUrl: '/assets/equipment-products/collection-de-verres.png',
    imageAlt: 'Collection de verres',
  },
  'Verre \u00e0 eau / highball': {
    imageUrl: '/assets/equipment-products/verre-a-eau-highball.png',
    imageAlt: 'Verre a eau highball',
  },
  'Verre ballon': {
    imageUrl: '/assets/equipment-products/verre-ballon.png',
    imageAlt: 'Verre ballon',
  },
  'Verre tulipe': {
    imageUrl: '/assets/equipment-products/verre-tulipe.png',
    imageAlt: 'Verre tulipe',
  },
  'Fl\u00fbte sur pied': {
    imageUrl: '/assets/equipment-products/flute-sur-pied.png',
    imageAlt: 'Flute sur pied',
  },
  'Verre \u00e0 dessert': {
    imageUrl: '/assets/equipment-products/verre-a-dessert.png',
    imageAlt: 'Verre a dessert',
  },
  'Verre \u00e0 cocktail / martini': {
    imageUrl: '/assets/equipment-products/verre-a-cocktail-martini.png',
    imageAlt: 'Verre a cocktail martini',
  },
  'Verre Old Fashioned': {
    imageUrl: '/assets/equipment-products/verre-old-fashioned.png',
    imageAlt: 'Verre Old Fashioned',
  },
  'Petit verre': {
    imageUrl: '/assets/equipment-products/petit-verre.png',
    imageAlt: 'Petit verre',
  },
  'Verre type pinte': {
    imageUrl: '/assets/equipment-products/verre-type-pinte.png',
    imageAlt: 'Verre type pinte',
  },
  "Verre \u00e0 jus d'orange / soft": {
    imageUrl: '/assets/equipment-products/verre-a-jus-d-orange-soft.png',
    imageAlt: "Verre a jus d'orange ou soft",
  },
  'Verre \u00e0 mojito / cocktail long': {
    imageUrl: '/assets/equipment-products/verre-a-mojito-cocktail-long.png',
    imageAlt: 'Verre a mojito cocktail long',
  },
  'Verre \u00e0 digestif / cognac': {
    imageUrl: '/assets/equipment-products/verre-a-digestif-cognac.png',
    imageAlt: 'Verre a digestif cognac',
  },
  'Carafes & d\u00e9canteurs': {
    imageUrl: '/assets/equipment-products/carafes-et-decanteurs.png',
    imageAlt: 'Carafes et decanteurs',
  },
  'Carafe \u00e0 eau': {
    imageUrl: '/assets/equipment-products/carafe-a-eau.png',
    imageAlt: 'Carafe a eau',
  },
  'Seau \u00e0 glace + pince': {
    imageUrl: '/assets/equipment-products/seau-a-glace-pince.png',
    imageAlt: 'Seau a glace avec pince',
  },
};

const PROTECH_MAINTENANCE_SUPPLIER: ProductSupplier = {
  name: 'ProTech Maintenance',
  location: 'Casablanca',
  phone: '06 55 44 33 22',
  email: 'maintenance@profood.ma',
};

const GENERATED_THEMES: Record<GeneratedThemeName, GeneratedTheme> = {
  vegetable: {
    colors: ['#edf3e5', '#6d8d45', '#243b28'],
    unit: 'kg',
    minimumQuantity: 10,
    maximumQuantity: 350,
    quantityStep: 10,
    packaging: 'Caisse pro',
    shortTrait: 'Fraîcheur contrôlée',
    quality: 'Tri fraîcheur avant expédition',
  },
  herb: {
    colors: ['#eaf6ec', '#3f8b55', '#193321'],
    unit: 'botte',
    minimumQuantity: 20,
    maximumQuantity: 220,
    quantityStep: 10,
    packaging: 'Botte pro',
    shortTrait: 'Arôme frais',
    quality: 'Feuilles contrôlées et humidité maîtrisée',
  },
  fruit: {
    colors: ['#fff3df', '#df8a35', '#4a2a16'],
    unit: 'kg',
    minimumQuantity: 10,
    maximumQuantity: 500,
    quantityStep: 10,
    packaging: 'Caisse fruit',
    shortTrait: 'Calibre homogène',
    quality: 'Maturité suivie pour service professionnel',
  },
  seafood: {
    colors: ['#e8f4f7', '#4b91aa', '#15313d'],
    unit: 'kg',
    minimumQuantity: 5,
    maximumQuantity: 120,
    quantityStep: 5,
    packaging: 'Bac isotherme',
    shortTrait: 'Chaîne froide',
    quality: 'Traçabilité pêche et contrôle température',
  },
  dairy: {
    colors: ['#f6f8fb', '#9fb4ca', '#263746'],
    unit: 'carton',
    minimumQuantity: 6,
    maximumQuantity: 180,
    quantityStep: 6,
    packaging: 'Carton pro',
    shortTrait: 'Froid positif',
    quality: 'Stock réfrigéré pour restauration',
  },
  meat: {
    colors: ['#f7ece8', '#b85d51', '#42211d'],
    unit: 'kg',
    minimumQuantity: 5,
    maximumQuantity: 100,
    quantityStep: 5,
    packaging: 'Sous-vide pro',
    shortTrait: 'Découpe maîtrisée',
    quality: 'Préparation contrôlée en atelier professionnel',
  },
  pantry: {
    colors: ['#f5eddc', '#b39156', '#3f321e'],
    unit: 'kg',
    minimumQuantity: 10,
    maximumQuantity: 500,
    quantityStep: 10,
    packaging: 'Sac pro',
    shortTrait: 'Stock longue durée',
    quality: 'Conditionnement stable pour cuisine centrale',
  },
  drink: {
    colors: ['#efe8dc', '#8a6944', '#2d2115'],
    unit: 'carton',
    minimumQuantity: 6,
    maximumQuantity: 240,
    quantityStep: 6,
    packaging: 'Carton service',
    shortTrait: 'Format CHR',
    quality: 'Lot adapté cafés, hôtels et restaurants',
  },
  oil: {
    colors: ['#f6f0d8', '#b6a042', '#3f3513'],
    unit: 'L',
    minimumQuantity: 4,
    maximumQuantity: 160,
    quantityStep: 4,
    packaging: 'Bidon pro',
    shortTrait: 'Usage cuisine',
    quality: 'Conditionnement professionnel et stockage stable',
  },
};

const FOOD_FAMILY_SEEDS: FoodFamilySeed[] = [
  {
    family: 'Légumes bulbes',
    theme: 'vegetable',
    items: [
      ['Oignon jaune', 6.2],
      ['Oignon rouge', 7.1],
      ['Ail blanc', 18.4],
    ],
  },
  {
    family: 'Légumineuses fraîches',
    theme: 'vegetable',
    items: [
      ['Petits pois frais', 13.5],
      ['Fèves fraîches', 11.8],
      ['Haricots verts', 14.2],
    ],
  },
  {
    family: 'Champignons',
    theme: 'vegetable',
    items: [
      ['Champignon de Paris', 19.9],
      ['Pleurote', 28.5],
      ['Champignon brun', 24.3],
    ],
  },
  {
    family: 'Herbes aromatiques',
    theme: 'herb',
    items: [
      ['Persil plat', 2.8],
      ['Coriandre fraîche', 2.6],
      ['Menthe fraîche', 3.1],
    ],
  },
  {
    family: 'Agrumes',
    theme: 'fruit',
    items: [
      ['Orange Maroc', 6.5],
      ['Citron jaune', 9.4],
      ['Clémentine', 8.2],
    ],
  },
  {
    family: 'Fruits à pépins',
    theme: 'fruit',
    items: [
      ['Pomme Golden', 9.8],
      ['Poire Williams', 13.6],
      ['Coing', 10.5],
    ],
  },
  {
    family: 'Fruits à noyau',
    theme: 'fruit',
    items: [
      ['Pêche jaune', 15.2],
      ['Abricot', 18.7],
      ['Prune rouge', 12.9],
    ],
  },
  {
    family: 'Fruits tropicaux',
    theme: 'fruit',
    items: [
      ['Banane', 8.9],
      ['Mangue', 24.5],
      ['Ananas', 18.2, 'pièce'],
    ],
  },
  {
    family: 'Fruits rouges',
    theme: 'fruit',
    items: [
      ['Fraise', 22.5],
      ['Framboise', 38.4],
      ['Myrtille', 44.8],
    ],
  },
  {
    family: 'Melons & pastèques',
    theme: 'fruit',
    items: [
      ['Pastèque', 4.7],
      ['Melon jaune', 8.6, 'pièce'],
      ['Melon vert', 8.1, 'pièce'],
    ],
  },
  {
    family: 'Raisins',
    theme: 'fruit',
    items: [
      ['Raisin blanc', 15.4],
      ['Raisin noir', 16.8],
      ['Raisin rouge', 15.9],
    ],
  },
  {
    family: 'Fruits méditerranéens',
    theme: 'fruit',
    items: [
      ['Figue fraîche', 24.2],
      ['Grenade', 11.5],
      ['Kaki', 14.6],
    ],
  },
  {
    family: 'Fruits secs & noix',
    theme: 'pantry',
    items: [
      ['Amande décortiquée', 72.5],
      ['Noix', 64.8],
      ['Noisette', 78.2],
    ],
  },
  {
    family: 'Poissons frais',
    theme: 'seafood',
    items: [
      ['Sardine fraîche', 17.5],
      ['Dorade royale', 58.4],
      ['Merlan', 42.6],
    ],
  },
  {
    family: 'Poissons nobles',
    theme: 'seafood',
    items: [
      ['Saint-pierre', 96.5],
      ['Loup de mer', 82.4],
      ['Espadon', 78.9],
    ],
  },
  {
    family: 'Filets & découpes',
    theme: 'seafood',
    items: [
      ['Filet de saumon', 112],
      ['Filet de merlu', 54.5],
      ['Pavé de thon', 95.8],
    ],
  },
  {
    family: 'Céphalopodes',
    theme: 'seafood',
    items: [
      ['Poulpe', 78.4],
      ['Calamar', 64.2],
      ['Seiche', 58.7],
    ],
  },
  {
    family: 'Crustacés',
    theme: 'seafood',
    items: [
      ['Crevette royale', 118],
      ['Langoustine', 146],
      ['Crabe', 88.5],
    ],
  },
  {
    family: 'Coquillages',
    theme: 'seafood',
    items: [
      ['Moules', 24.6],
      ['Palourdes', 64.8],
      ['Huîtres', 96, 'douzaine'],
    ],
  },
  {
    family: 'Produits surgelés',
    theme: 'seafood',
    items: [
      ['Crevettes surgelées', 82.5],
      ['Filets de colin surgelés', 46.8],
      ['Calamars surgelés', 59.7],
    ],
  },
  {
    family: 'Lait',
    theme: 'dairy',
    items: [
      ['Lait entier', 7.5, 'L'],
      ['Lait demi-écrémé', 7.1, 'L'],
      ['Lait UHT pro', 7.8, 'L'],
    ],
  },
  {
    family: 'Crèmes',
    theme: 'dairy',
    items: [
      ['Crème fraîche épaisse', 28.5],
      ['Crème liquide 35%', 31.2],
      ['Crème cuisson', 24.8],
    ],
  },
  {
    family: 'Beurres & matières grasses',
    theme: 'dairy',
    items: [
      ['Beurre doux', 68.5],
      ['Beurre salé', 71.4],
      ['Beurre pâtissier', 64.9],
    ],
  },
  {
    family: 'Yaourts & fermentés',
    theme: 'dairy',
    items: [
      ['Yaourt nature', 3.6, 'unité'],
      ['Lben', 9.2, 'L'],
      ['Raib', 4.2, 'unité'],
    ],
  },
  {
    family: 'Fromages frais',
    theme: 'dairy',
    items: [
      ['Fromage blanc', 24.5],
      ['Ricotta fraîche', 42.8],
      ['Jben', 36.4],
    ],
  },
  {
    family: 'Desserts lactés',
    theme: 'dairy',
    items: [
      ['Crème dessert vanille', 4.5, 'unité'],
      ['Flan caramel', 4.2, 'unité'],
      ['Riz au lait', 4.9, 'unité'],
    ],
  },
  {
    family: 'Glacerie',
    theme: 'dairy',
    items: [
      ['Glace vanille', 58, 'bac'],
      ['Sorbet citron', 62, 'bac'],
      ['Bac chocolat', 64, 'bac'],
    ],
  },
  {
    family: 'Viande bovine',
    theme: 'meat',
    items: [
      ['Entrecôte bovine', 118],
      ['Paleron de boeuf', 82],
      ['Viande hachée bovine', 76],
    ],
  },
  {
    family: 'Viande ovine',
    theme: 'meat',
    items: [
      ["Gigot d'agneau", 112],
      ["Épaule d'agneau", 96],
      ["Côtelettes d'agneau", 128],
    ],
  },
  {
    family: 'Viande caprine',
    theme: 'meat',
    items: [
      ['Chevreau découpé', 104],
      ['Épaule caprine', 88],
      ['Côtelettes caprines', 116],
    ],
  },
  {
    family: 'Viande de veau',
    theme: 'meat',
    items: [
      ['Escalope de veau', 126],
      ['Jarret de veau', 82],
      ['Blanquette de veau', 94],
    ],
  },
  {
    family: 'Volaille',
    theme: 'meat',
    items: [
      ['Poulet entier', 31.5],
      ['Filet de poulet', 64.8],
      ['Cuisse de dinde', 48.6],
    ],
  },
  {
    family: 'Charcuterie halal',
    theme: 'meat',
    items: [
      ['Jambon de dinde halal', 54.8],
      ['Saucisson halal', 62.5],
      ['Mortadelle halal', 39.4],
    ],
  },
  {
    family: 'Abats',
    theme: 'meat',
    items: [
      ['Foie de boeuf', 68.5],
      ["Coeur d'agneau", 44.2],
      ['Rognons', 52.8],
    ],
  },
  {
    family: 'Produits préparés',
    theme: 'meat',
    items: [
      ['Brochettes marinées', 76],
      ['Kefta assaisonnée', 72.4],
      ['Escalopes panées', 58.7],
    ],
  },
  {
    family: 'Surgelés viande',
    theme: 'meat',
    items: [
      ['Steak haché surgelé', 61.5],
      ['Nuggets de poulet', 42.8],
      ['Émincé de dinde surgelé', 55.6],
    ],
  },
  {
    family: 'Farines & semoules',
    theme: 'pantry',
    items: [
      ['Farine boulangère', 7.8],
      ['Semoule fine', 8.2],
      ['Semoule grosse', 8.4],
    ],
  },
  {
    family: 'Levures & agents de pousse',
    theme: 'pantry',
    items: [
      ['Levure sèche', 46],
      ['Levure fraîche', 18.5],
      ['Poudre à lever', 39.8],
    ],
  },
  {
    family: 'Sucres & édulcorants',
    theme: 'pantry',
    items: [
      ['Sucre semoule', 9.6],
      ['Sucre glace', 12.8],
      ['Miel industriel', 42.5],
    ],
  },
  {
    family: 'Sels & assaisonnements de base',
    theme: 'pantry',
    items: [
      ['Sel fin', 3.2],
      ['Sel gros', 2.9],
      ['Poivre noir moulu', 74],
    ],
  },
  {
    family: 'Épices marocaines',
    theme: 'pantry',
    items: [
      ['Cumin moulu', 58],
      ['Paprika doux', 44.5],
      ['Ras el hanout', 72.4],
    ],
  },
  {
    family: 'Céréales & féculents',
    theme: 'pantry',
    items: [
      ['Riz long grain', 13.2],
      ['Couscous moyen', 10.8],
      ['Pâtes penne', 11.5],
    ],
  },
  {
    family: 'Légumineuses sèches',
    theme: 'pantry',
    items: [
      ['Lentilles vertes', 16.8],
      ['Pois chiches', 15.2],
      ['Haricots blancs', 18.4],
    ],
  },
  {
    family: 'Conserves & sauces sèches',
    theme: 'pantry',
    items: [
      ['Tomate concentrée', 18.5],
      ['Sauce harissa', 24.6],
      ['Bouillon sec', 38.8],
    ],
  },
  {
    family: 'Fruits secs & graines',
    theme: 'pantry',
    items: [
      ['Raisins secs', 32.5],
      ['Graines de sésame', 36.8],
      ['Graines de courge', 54.2],
    ],
  },
  {
    family: 'Poudres & bases pâtisserie',
    theme: 'pantry',
    items: [
      ['Cacao poudre', 48.5],
      ['Crème pâtissière poudre', 36.4],
      ['Base génoise', 42.8],
    ],
  },
  {
    family: 'Café',
    theme: 'drink',
    items: [
      ['Café grain arabica', 94],
      ['Café moulu expresso', 88.5],
      ['Capsules café pro', 2.8, 'unité'],
    ],
  },
  {
    family: 'Thé',
    theme: 'drink',
    items: [
      ['Thé vert', 62],
      ['Thé noir', 58.5],
      ['Thé à la menthe', 64.8],
    ],
  },
  {
    family: 'Infusions',
    theme: 'drink',
    items: [
      ['Verveine séchée', 72.5],
      ['Camomille', 68.4],
      ['Tisane anis', 54.2],
    ],
  },
  {
    family: 'Chocolat chaud',
    theme: 'drink',
    items: [
      ['Poudre chocolat', 38.8],
      ['Chocolat instantané', 42.6],
      ['Cacao boisson', 46.4],
    ],
  },
  {
    family: 'Huiles alimentaires',
    theme: 'oil',
    items: [
      ["Huile d'olive vierge", 68],
      ['Huile de tournesol', 18.5],
      ['Huile de colza', 21.4],
    ],
  },
  {
    family: 'Matières grasses laitières',
    theme: 'oil',
    items: [
      ['Ghee', 86],
      ['Crème de beurre', 72.5],
      ['Beurre clarifié', 91.4],
    ],
  },
  {
    family: 'Matières grasses traditionnelles',
    theme: 'oil',
    items: [
      ['Smen beldi', 118],
      ["Huile d'argan culinaire", 196],
      ['Amlou pro', 82.5],
    ],
  },
  {
    family: 'Matières grasses culinaires',
    theme: 'oil',
    items: [
      ['Margarine cuisine', 28.5],
      ['Graisse végétale', 24.8],
      ['Huile de friture', 17.6],
    ],
  },
];

function catalogProductPhoto(
  fileName: string,
  imageAlt: string,
): { imageUrl: string; imageAlt: string } {
  return {
    imageUrl: `/assets/catalog-products/${fileName}.png`,
    imageAlt,
  };
}

const PRODUCT_IMAGE_OVERRIDES: Record<string, ProductImageOverride> = {
  'Oignon jaune': {
    imageUrl: '/assets/product-oignon-jaune.png',
    imageAlt: 'Oignons jaunes frais',
  },
  'Oignon rouge': {
    imageUrl: '/assets/product-oignon-rouge.png',
    imageAlt: 'Oignons rouges frais',
  },
  'Ail blanc': {
    imageUrl: '/assets/product-ail-blanc.png',
    imageAlt: 'Ail blanc frais',
  },
  'Petits pois frais': {
    imageUrl: '/assets/product-petits-pois-frais.png',
    imageAlt: 'Petits pois frais en cosses',
  },
  'Fèves fraîches': {
    imageUrl: '/assets/product-feves-fraiches.png',
    imageAlt: 'Fèves fraîches en cosses',
  },
  'Haricots verts': {
    imageUrl: '/assets/product-haricots-verts.png',
    imageAlt: 'Haricots verts frais',
  },
  'Champignon de Paris': {
    imageUrl: '/assets/product-champignon-de-paris.png',
    imageAlt: 'Champignons de Paris frais',
  },
  Pleurote: {
    imageUrl: '/assets/product-pleurote.png',
    imageAlt: 'Pleurotes fraîches',
  },
  'Champignon brun': {
    imageUrl: '/assets/product-champignon-brun.png',
    imageAlt: 'Champignons bruns frais',
  },
  'Persil plat': {
    imageUrl: '/assets/product-persil-plat.png',
    imageAlt: 'Persil plat frais',
  },
  'Orange Maroc': {
    imageUrl: '/assets/product-orange-maroc.png',
    imageAlt: 'Oranges fraîches du Maroc',
  },
  'Citron jaune': {
    imageUrl: '/assets/product-citron-jaune.png',
    imageAlt: 'Citrons jaunes frais',
  },
  Clémentine: {
    imageUrl: '/assets/product-clementine.png',
    imageAlt: 'Clémentines fraîches',
  },
  'Pomme Golden': {
    imageUrl: '/assets/product-pomme-golden.png',
    imageAlt: 'Pomme Golden fraîche',
  },
  'Poire Williams': {
    imageUrl: '/assets/product-poire-williams.png',
    imageAlt: 'Poire Williams fraîche',
  },
  Coing: {
    imageUrl: '/assets/product-coing.png',
    imageAlt: 'Coing frais',
  },
  'Pêche jaune': {
    imageUrl: '/assets/product-peche-jaune.png',
    imageAlt: 'Pêche jaune fraîche',
  },
  Abricot: {
    imageUrl: '/assets/product-abricot.png',
    imageAlt: 'Abricots frais',
  },
  'Prune rouge': {
    imageUrl: '/assets/product-prune-rouge.png',
    imageAlt: 'Prune rouge fraîche',
  },
  Banane: {
    imageUrl: '/assets/product-banane.png',
    imageAlt: 'Bananes fraîches',
  },
  Mangue: {
    imageUrl: '/assets/product-mangue.png',
    imageAlt: 'Mangue fraîche',
  },
  Ananas: {
    imageUrl: '/assets/product-ananas.png',
    imageAlt: 'Ananas frais',
  },
  Fraise: {
    imageUrl: '/assets/product-fraise.png',
    imageAlt: 'Fraises fraîches',
  },
  Framboise: {
    imageUrl: '/assets/product-framboise.png',
    imageAlt: 'Framboises fraîches',
  },
  Myrtille: {
    imageUrl: '/assets/product-myrtille.png',
    imageAlt: 'Myrtilles fraîches',
  },
  Pastèque: {
    imageUrl: '/assets/product-pasteque.png',
    imageAlt: 'Pastèque fraîche',
  },
  'Melon jaune': {
    imageUrl: '/assets/product-melon-jaune.png',
    imageAlt: 'Melon jaune frais',
  },
  'Melon vert': {
    imageUrl: '/assets/product-melon-vert.png',
    imageAlt: 'Melon vert frais',
  },
  'Sardine fraîche': catalogProductPhoto('sardine-fraiche', 'Sardines fraîches'),
  'Dorade royale': catalogProductPhoto('dorade-royale', 'Dorade royale fraîche'),
  Merlan: catalogProductPhoto('merlan', 'Merlan entier frais'),
  'Saint-pierre': catalogProductPhoto('saint-pierre', 'Saint-pierre frais'),
  'Loup de mer': catalogProductPhoto('loup-de-mer', 'Loup de mer frais'),
  Espadon: catalogProductPhoto('espadon', 'Espadon frais'),
  'Filet de saumon': catalogProductPhoto('filet-de-saumon', 'Filet de saumon frais'),
  'Filet de merlu': catalogProductPhoto('filet-de-merlu', 'Filet de merlu frais'),
  'Pavé de thon': catalogProductPhoto('pave-de-thon', 'Pavé de thon frais'),
  Poulpe: catalogProductPhoto('poulpe', 'Poulpe frais'),
  Calamar: catalogProductPhoto('calamar', 'Calamar frais'),
  Seiche: catalogProductPhoto('seiche', 'Seiche fraîche'),
  'Crevette royale': catalogProductPhoto('crevette-royale', 'Crevettes royales fraîches'),
  Langoustine: catalogProductPhoto('langoustine', 'Langoustines fraîches'),
  Crabe: catalogProductPhoto('crabe', 'Crabe frais'),
  Moules: catalogProductPhoto('moules', 'Moules fraîches'),
  Palourdes: catalogProductPhoto('palourdes', 'Palourdes fraîches'),
  Huîtres: catalogProductPhoto('huitres', 'Huîtres fraîches'),
  'Crevettes surgelées': catalogProductPhoto('crevettes-surgelees', 'Crevettes surgelées'),
  'Filets de colin surgelés': catalogProductPhoto(
    'filets-de-colin-surgeles',
    'Filets de colin surgelés',
  ),
  'Calamars surgelés': catalogProductPhoto('calamars-surgeles', 'Calamars surgelés'),
  'Lait entier': catalogProductPhoto('lait-entier', 'Lait entier en bouteille'),
  'Lait demi-écrémé': catalogProductPhoto('lait-demi-ecreme', 'Lait demi-écrémé en bouteille'),
  'Lait UHT pro': catalogProductPhoto('lait-uht-pro', 'Lait UHT pro en brique'),
  'Crème fraîche épaisse': catalogProductPhoto('creme-fraiche-epaisse', 'Crème fraîche épaisse'),
  'Crème liquide 35%': catalogProductPhoto('creme-liquide-35', 'Crème liquide 35%'),
  'Crème cuisson': catalogProductPhoto('creme-cuisson', 'Crème cuisson'),
  'Beurre doux': catalogProductPhoto('beurre-doux', 'Beurre doux'),
  'Beurre salé': catalogProductPhoto('beurre-sale', 'Beurre salé'),
  'Beurre pâtissier': catalogProductPhoto('beurre-patissier', 'Beurre pâtissier'),
  'Yaourt nature': catalogProductPhoto('yaourt-nature', 'Yaourt nature'),
  Lben: catalogProductPhoto('lben', 'Lben'),
  Raib: catalogProductPhoto('raib', 'Raib'),
  'Fromage blanc': catalogProductPhoto('fromage-blanc', 'Fromage blanc'),
  'Ricotta fraîche': catalogProductPhoto('ricotta-fraiche', 'Ricotta fraîche'),
  Jben: catalogProductPhoto('jben', 'Jben'),
  'Crème dessert vanille': catalogProductPhoto('creme-dessert-vanille', 'Crème dessert vanille'),
  'Flan caramel': catalogProductPhoto('flan-caramel', 'Flan caramel'),
  'Riz au lait': catalogProductPhoto('riz-au-lait', 'Riz au lait'),
  'Glace vanille': catalogProductPhoto('glace-vanille', 'Glace vanille'),
  'Sorbet citron': catalogProductPhoto('sorbet-citron', 'Sorbet citron'),
  'Bac chocolat': catalogProductPhoto('bac-chocolat', 'Bac chocolat'),
  'Entrecôte bovine': catalogProductPhoto('entrecote-bovine', 'Entrecôte bovine'),
  'Paleron de boeuf': catalogProductPhoto('paleron-de-boeuf', 'Paleron de boeuf'),
  'Viande hachée bovine': catalogProductPhoto('viande-hachee-bovine', 'Viande hachée bovine'),
  "Gigot d'agneau": catalogProductPhoto('gigot-d-agneau', "Gigot d'agneau"),
  "Épaule d'agneau": catalogProductPhoto('epaule-d-agneau', "Épaule d'agneau"),
  "Côtelettes d'agneau": catalogProductPhoto('cotelettes-d-agneau', "Côtelettes d'agneau"),
  'Chevreau découpé': catalogProductPhoto('chevreau-decoupe', 'Chevreau découpé'),
  'Épaule caprine': catalogProductPhoto('epaule-caprine', 'Épaule caprine'),
  'Côtelettes caprines': catalogProductPhoto('cotelettes-caprines', 'Côtelettes caprines'),
  'Brochettes marinées': catalogProductPhoto('brochettes-marinees', 'Brochettes marinées'),
  'Kefta assaisonnée': catalogProductPhoto('kefta-assaisonnee', 'Kefta assaisonnée'),
  'Escalopes panées': catalogProductPhoto('escalopes-panees', 'Escalopes panées'),
  'Steak haché surgelé': catalogProductPhoto('steak-hache-surgele', 'Steak haché surgelé'),
  'Nuggets de poulet': catalogProductPhoto('nuggets-de-poulet', 'Nuggets de poulet'),
  'Émincé de dinde surgelé': catalogProductPhoto(
    'emince-de-dinde-surgele',
    'Émincé de dinde surgelé',
  ),
  'Farine boulangère': catalogProductPhoto('farine-boulangere', 'Farine boulangère'),
  'Semoule fine': catalogProductPhoto('semoule-fine', 'Semoule fine'),
  'Semoule grosse': catalogProductPhoto('semoule-grosse', 'Semoule grosse'),
  'Levure sèche': catalogProductPhoto('levure-seche', 'Levure sèche'),
  'Levure fraîche': catalogProductPhoto('levure-fraiche', 'Levure fraîche'),
  'Poudre à lever': catalogProductPhoto('poudre-a-lever', 'Poudre à lever'),
  'Sucre semoule': catalogProductPhoto('sucre-semoule', 'Sucre semoule'),
  'Sucre glace': catalogProductPhoto('sucre-glace', 'Sucre glace'),
  'Miel industriel': catalogProductPhoto('miel-industriel', 'Miel industriel'),
  'Sel fin': catalogProductPhoto('sel-fin', 'Sel fin'),
  'Sel gros': catalogProductPhoto('sel-gros', 'Sel gros'),
  'Poivre noir moulu': catalogProductPhoto('poivre-noir-moulu', 'Poivre noir moulu'),
  'Cumin moulu': catalogProductPhoto('cumin-moulu', 'Cumin moulu'),
  'Paprika doux': catalogProductPhoto('paprika-doux', 'Paprika doux'),
  'Ras el hanout': catalogProductPhoto('ras-el-hanout', 'Ras el hanout'),
  'Riz long grain': catalogProductPhoto('riz-long-grain', 'Riz long grain'),
  'Couscous moyen': catalogProductPhoto('couscous-moyen', 'Couscous moyen'),
  'Pâtes penne': catalogProductPhoto('pates-penne', 'Pâtes penne'),
  'Lentilles vertes': catalogProductPhoto('lentilles-vertes', 'Lentilles vertes'),
  'Pois chiches': catalogProductPhoto('pois-chiches', 'Pois chiches'),
  'Haricots blancs': catalogProductPhoto('haricots-blancs', 'Haricots blancs'),
  'Tomate concentrée': catalogProductPhoto('tomate-concentree', 'Tomate concentrée'),
  'Sauce harissa': catalogProductPhoto('sauce-harissa', 'Sauce harissa'),
  'Bouillon sec': catalogProductPhoto('bouillon-sec', 'Bouillon sec'),
  'Raisins secs': catalogProductPhoto('raisins-secs', 'Raisins secs'),
  'Graines de sésame': catalogProductPhoto('graines-de-sesame', 'Graines de sésame'),
  'Graines de courge': catalogProductPhoto('graines-de-courge', 'Graines de courge'),
  'Cacao poudre': catalogProductPhoto('cacao-poudre', 'Cacao poudre'),
  'Crème pâtissière poudre': catalogProductPhoto(
    'creme-patissiere-poudre',
    'Crème pâtissière poudre',
  ),
  'Base génoise': catalogProductPhoto('base-genoise', 'Base génoise'),
  'Café grain arabica': catalogProductPhoto('cafe-grain-arabica', 'Café grain arabica'),
  'Café moulu expresso': catalogProductPhoto('cafe-moulu-expresso', 'Café moulu expresso'),
  'Capsules café pro': catalogProductPhoto('capsules-cafe-pro', 'Capsules café pro'),
  'Thé vert': catalogProductPhoto('the-vert', 'Thé vert'),
  'Thé noir': catalogProductPhoto('the-noir', 'Thé noir'),
  'Thé à la menthe': catalogProductPhoto('the-a-la-menthe', 'Thé à la menthe'),
  'Verveine séchée': catalogProductPhoto('verveine-sechee', 'Verveine séchée'),
  Camomille: catalogProductPhoto('camomille', 'Camomille'),
  'Tisane anis': catalogProductPhoto('tisane-anis', 'Tisane anis'),
  'Poudre chocolat': catalogProductPhoto('poudre-chocolat', 'Poudre chocolat'),
  'Chocolat instantané': catalogProductPhoto('chocolat-instantane', 'Chocolat instantané'),
  'Cacao boisson': catalogProductPhoto('cacao-boisson', 'Cacao boisson'),
  "Huile d'olive vierge": catalogProductPhoto('huile-d-olive-vierge', "Huile d'olive vierge"),
  'Huile de tournesol': catalogProductPhoto('huile-de-tournesol', 'Huile de tournesol'),
  'Huile de colza': catalogProductPhoto('huile-de-colza', 'Huile de colza'),
  Ghee: {
    imageUrl: '/assets/product-ghee.png',
    imageAlt: 'Ghee en bocal',
  },
  'Crème de beurre': {
    imageUrl: '/assets/product-creme-de-beurre.png',
    imageAlt: 'Crème de beurre en pot',
  },
  'Beurre clarifié': {
    imageUrl: '/assets/product-beurre-clarifie.png',
    imageAlt: 'Beurre clarifié en bocal',
  },
  'Amlou pro': {
    imageUrl: '/assets/product-amlou-pro.png',
    imageAlt: 'Amlou pro en pot',
  },
  'Margarine cuisine': {
    imageUrl: '/assets/product-margarine-cuisine.png',
    imageAlt: 'Margarine cuisine en bac',
  },
  'Graisse végétale': {
    imageUrl: '/assets/product-graisse-vegetale.png',
    imageAlt: 'Graisse végétale en pot',
  },
  'Huile de friture': {
    imageUrl: '/assets/product-huile-de-friture.png',
    imageAlt: 'Huile de friture en bidon',
  },
  'Escalope de veau': {
    imageUrl: '/assets/product-escalope-de-veau.png',
    imageAlt: 'Escalopes de veau fraîches',
  },
  'Jarret de veau': {
    imageUrl: '/assets/product-jarret-de-veau.png',
    imageAlt: 'Jarret de veau frais',
  },
};

const GENERATED_FOOD_PRODUCTS: ProductCatalogItem[] = FOOD_FAMILY_SEEDS.flatMap(
  (familySeed, familyIndex) =>
    familySeed.items.map((item, itemIndex) =>
      createGeneratedProduct(familySeed, item, familyIndex, itemIndex),
    ),
);

const PROFESSIONAL_EQUIPMENT_PRODUCTS: ProductCatalogItem[] = [
  {
    slug: 'four-mixte-professionnel',
    name: 'Four mixte professionnel',
    family: 'Équipements professionnels',
    imageUrl: '/assets/equipment-products/four-mixte.png',
    imageAlt: 'Four mixte professionnel pour cuisine CHR',
    priceMad: 24500,
    unit: 'unite',
    minimumQuantity: 1,
    maximumQuantity: 8,
    quantityStep: 1,
    rating: 4.7,
    ratingCount: 29,
    supplier: EQUIPMENT_SUPPLIER,
    characteristics: [
      'Cuisson vapeur et convection',
      'Format restaurant et hotel',
      'Installation sur devis',
      'Garantie fournisseur',
    ],
    cardCharacteristics: ['Équipement', 'Cuisson', 'Disponible'],
    description: 'Four mixte professionnel pour restaurants, hotels, traiteurs et cuisines B2B.',
  },
  {
    slug: 'chambre-froide-positive',
    name: 'Chambre froide positive',
    family: 'Équipements professionnels',
    imageUrl: '/assets/equipment-products/chambre-froide-positive-negative.png',
    imageAlt: 'Chambre froide positive professionnelle',
    priceMad: 38500,
    unit: 'unite',
    minimumQuantity: 1,
    maximumQuantity: 5,
    quantityStep: 1,
    rating: 4.8,
    ratingCount: 21,
    supplier: EQUIPMENT_SUPPLIER,
    characteristics: [
      'Stockage froid positif',
      'Panneaux isothermes',
      'Groupe froid inclus',
      'Installation technique disponible',
    ],
    cardCharacteristics: ['Équipement', 'Froid', 'Disponible'],
    description: 'Chambre froide positive pour stockage alimentaire professionnel.',
  },
  {
    slug: 'lave-vaisselle-professionnel',
    name: 'Lave-vaisselle professionnel',
    family: 'Équipements professionnels',
    imageUrl: '/assets/group-professionals.png',
    imageAlt: 'Lave-vaisselle professionnel inox',
    priceMad: 16800,
    unit: 'unite',
    minimumQuantity: 1,
    maximumQuantity: 10,
    quantityStep: 1,
    rating: 4.5,
    ratingCount: 34,
    supplier: EQUIPMENT_SUPPLIER,
    characteristics: [
      'Cycle rapide CHR',
      'Structure inox',
      'Pompe de rincage',
      'Maintenance disponible',
    ],
    cardCharacteristics: ['Équipement', 'Lavage', 'Disponible'],
    description: 'Lave-vaisselle professionnel pour restaurants, cafes et collectivites.',
  },
  {
    slug: 'batteur-melangeur-20-l',
    name: 'Batteur melangeur 20 L',
    family: 'Équipements professionnels',
    imageUrl: '/assets/equipment-products/batteur-melangeur-sur-socle.png',
    imageAlt: 'Batteur melangeur professionnel 20 litres',
    priceMad: 9200,
    unit: 'unite',
    minimumQuantity: 1,
    maximumQuantity: 12,
    quantityStep: 1,
    rating: 4.4,
    ratingCount: 18,
    supplier: EQUIPMENT_SUPPLIER,
    characteristics: [
      'Cuve 20 L',
      'Accessoires patisserie',
      'Usage boulangerie et cuisine',
      'Pieces disponibles',
    ],
    cardCharacteristics: ['Équipement', 'Preparation', 'Disponible'],
    description: 'Batteur melangeur professionnel pour preparation culinaire et patisserie.',
  },
  {
    slug: 'vitrine-refrigeree-service',
    name: 'Vitrine refrigeree service',
    family: 'Équipements professionnels',
    imageUrl: '/assets/equipment-products/vitrine-refrigeree-presentation.png',
    imageAlt: 'Vitrine refrigeree professionnelle',
    priceMad: 13200,
    unit: 'unite',
    minimumQuantity: 1,
    maximumQuantity: 8,
    quantityStep: 1,
    rating: 4.6,
    ratingCount: 24,
    supplier: EQUIPMENT_SUPPLIER,
    characteristics: [
      'Presentation froide',
      'Eclairage integre',
      'Format restauration',
      'Livraison fournisseur',
    ],
    cardCharacteristics: ['Équipement', 'Froid', 'Disponible'],
    description: 'Vitrine refrigeree pour points de vente, hotels et espaces traiteur.',
  },
];

const EQUIPMENT_MENU_THEME: GeneratedTheme = {
  colors: ['#f4f5f7', '#9aa1ad', '#1f2937'],
  unit: 'unite',
  minimumQuantity: 1,
  maximumQuantity: 20,
  quantityStep: 1,
  packaging: 'Equipement pro',
  shortTrait: 'Sur devis',
  quality: 'Selection CHR avec installation et suivi fournisseur',
};

const EQUIPMENT_MENU_FAMILY_SEEDS: EquipmentFamilySeed[] = [
  {
    section: 'Équipements techniques de production',
    family: 'Cuisson',
    items: [
      'Bac de salage électrique',
      'Bain-marie électrique / gaz',
      'Barbecue & Grill portugais',
      'Cuiseur à pâtes professionnel',
      'Cuisinière professionnelle',
      'Plancha professionnelle',
      'Friteuse professionnelle',
      'Grill à pierre volcanique',
      'Wok professionnel sur feu vif',
      'Chauffe-assiettes électrique',
      'Buffet chauffant',
      'Salamandre / grill de finition',
    ],
  },
  {
    section: 'Équipements techniques de production',
    family: 'Fours',
    items: [
      'Four mixte',
      'Four à convection',
      'Four à pizza professionnel',
      'Four pâtisserie / boulangerie',
      'Four convoyeur',
      'Micro-ondes professionnel',
    ],
  },
  {
    section: 'Équipements techniques de production',
    family: 'Froid & conservation',
    items: [
      'Réfrigérateur armoire positive',
      'Congélateur armoire négative',
      'Table réfrigérée',
      'Chambre froide positive / négative',
      'Cellule de refroidissement rapide',
      'Vitrine réfrigérée de présentation',
      'Kit réfrigérée',
      'Machine à glaçons',
    ],
  },
  {
    section: 'Équipements techniques de production',
    family: 'Préparation alimentaire',
    items: [
      'Coupe-légumes / robot-coupe',
      'Hachoir à viande professionnel',
      'Trancheuse professionnelle',
      'Mixeur plongeant professionnel',
      'Batteur-mélangeur sur socle',
      'Trancheuse à pain',
      'Scie à os électrique',
      'Épluche-légumes',
    ],
  },
  {
    section: 'Équipements techniques de production',
    family: 'Boulangerie',
    items: [
      'Pétrin spiral professionnel',
      'Laminoir / façonneuse à baguettes',
      'Diviseuse-bouleuse',
      'Chambre de pousse / fermentation',
    ],
  },
  {
    section: 'Équipements techniques de production',
    family: 'Pâtisserie',
    items: [
      'Batteur-mélangeur pâtisserie',
      'Batteur sur socle planétaire',
      'Robot pâtissier multifonction',
      'Trempeuse à chocolat / tempéreuse',
      'Moules & cercles professionnels',
      'Moules à gâteaux ronds / carrés',
      'Moules à tarte / tartelettes',
      'Moules à muffins / cupcakes',
      'Moules à bûche',
      'Moules à entremets / cercles pâtissiers',
      'Moules en silicone',
      'Plaque de cuisson perforée / pleine',
      'Rouleau à pâtisserie',
      'Tapis de travail en silicone / marbre',
      'Poche à douille + douilles inox',
      'Spatule coudée / palette pâtissière',
      'Râpe / zesteur pâtissier',
      'Tamis / passoire fine pâtisserie',
      'Balance de précision pâtisserie',
      'Thermomètre de cuisson sucre / chocolat',
      'Chalumeau de cuisine',
      'Laminoir / sheeter pâtissier',
      'Fonceuse à tartes',
      'Déposeuse / poêlonneuse chocolat',
      'Guitare pâtissière',
      'Corne / raclette pâtissière',
      'Emporte-pièces',
      'Saupoudreur à sucre glace / cacao',
      'Cul-de-poule inox',
    ],
  },
  {
    section: 'Équipements techniques de production',
    family: 'Snack / fast-food',
    items: [
      'Grille-panini / toaster professionnel',
      'Lampe chauffante infrarouge de maintien',
      'Distributeur de boissons chaudes',
    ],
  },
  {
    section: 'Mobilier & aménagement',
    family: 'Mobilier cuisine',
    items: [
      'Table de travail inox',
      'Table de débarrassage / plonge',
      'Étagère murale / étagère à clayettes',
      'Chariot GN / chariot pâtissier',
      'Placard bas / meuble bas cuisine',
      "Hotte d'aspiration professionnelle",
    ],
  },
  {
    section: 'Mobilier & aménagement',
    family: 'Mobilier salle',
    items: [
      'Table de restaurant',
      'Chaise et tabouret de restaurant',
      'Comptoir de bar / de service',
      'Présentoir vitrine de comptoir',
    ],
  },
  {
    section: 'Mobilier & aménagement',
    family: 'Stockage',
    items: ['Rayonnage de stockage', 'Armoire de stockage fermée', 'Bac de stockage alimentaire'],
  },
  {
    section: 'Service & présentation',
    family: 'Vaisselle',
    items: [
      'Assiettes',
      'Assiette plate ronde standard',
      'Assiette creuse / soupe',
      'Assiette à dessert',
      'Assiette à pain / beurre',
      'Assiette de présentation',
      'Assiette à pizza ronde',
      'Assiette ardoise / en pierre',
      'Assiette rectangulaire / ardoise allongée',
      'Assiette tapas / dégustation',
      'Assiette ovale de service',
      'Bols, ramequins, cocottes',
      'Coupelle / bol à sauce',
      'Bol à soupe / bouillon',
      'Bol à céréales / bol coréen',
      'Mug / tasse à café / thé',
      'Tasse à espresso + soucoupe',
      'Ramequin individuel',
      'Terrine / cocotte mini en fonte',
      'Verrines / petits pots service',
      'Planche à découper de présentation',
      'Saladiers & plats de service',
    ],
  },
  {
    section: 'Service & présentation',
    family: 'Couverts',
    items: [
      'Fourchettes, couteaux, cuillères',
      'Couteau de table standard',
      'Fourchette de table',
      'Cuillère à soupe / dessert',
      'Cuillère à café / moka',
      'Couteau à beurre',
      'Fourchette à poisson',
      'Couteau à poisson',
      'Couteau à steak',
      'Cuillère de service',
      'Pince de service inox',
      'Louche de service',
      'Spatule / truelle de service',
      'Pelle à tarte / gâteau',
      'Couteaux de découpe / office',
    ],
  },
  {
    section: 'Service & présentation',
    family: 'Verrerie',
    items: [
      'Collection de verres',
      'Verre à eau / highball',
      'Verre ballon',
      'Verre tulipe',
      'Flûte sur pied',
      'Verre à dessert',
      'Verre à cocktail / martini',
      'Verre Old Fashioned',
      'Petit verre',
      'Verre type pinte',
      "Verre à jus d'orange / soft",
      'Verre à mojito / cocktail long',
      'Verre à digestif / cognac',
      'Carafes & décanteurs',
      'Carafe à eau',
      'Seau à glace + pince',
    ],
  },
  {
    section: 'Service & présentation',
    family: 'Présentation & service',
    items: [
      'Plateau de service',
      'Cloche chauffante de service',
      'Support buffet',
      'Poubelle / seau de table / déchet',
    ],
  },
  {
    section: 'Emballage & vente à emporter',
    family: 'Emballage alimentaire',
    items: [
      'Boîtes à emporter',
      'Barquettes alimentaires',
      'Sacs kraft et sacs en papier',
      'Film étirable / papier sulfurisé',
    ],
  },
  {
    section: 'Emballage & vente à emporter',
    family: 'Packaging personnalisé',
    items: ['Boîtes avec logo', 'Stickers & étiquettes de marque'],
  },
  {
    section: 'Emballage & vente à emporter',
    family: 'Livraison',
    items: ['Sacs isothermes de livraison', 'Boîtes thermiques'],
  },
  {
    section: 'Hygiène & sécurité',
    family: 'Lavage',
    items: [
      'Lave-vaisselle à capot professionnel',
      'Lave-vaisselle à tunnel',
      'Plonge simple / double bac',
      'Distributeur savon / désinfectant mural',
    ],
  },
  {
    section: 'Hygiène & sécurité',
    family: 'Sécurité',
    items: [
      'Extincteur cuisine',
      'Système de ventilation / extraction',
      'Tapis antidérapants de cuisine',
      'Boîte de premiers secours',
    ],
  },
  {
    section: 'Hygiène & sécurité',
    family: 'Normes haccp',
    items: [
      'Thermomètre sonde HACCP',
      'Étiquettes HACCP & fiches de traçabilité',
      'Planches à découper codées',
    ],
  },
  {
    section: 'Tenue & ressources humaines',
    family: 'Tenue de travail',
    items: [
      'Veste de chef professionnelle',
      'Tablier de cuisine / tablier boucher',
      'Toque et calot de cuisine',
      'Pantalon de cuisine',
    ],
  },
  {
    section: 'Tenue & ressources humaines',
    family: 'Protection',
    items: [
      'Chaussures de sécurité cuisine',
      'Gants résistants chaleur / coupure',
      'Gants jetables alimentaires',
    ],
  },
  {
    section: 'Technologie & gestion',
    family: 'Systèmes de caisse',
    items: [
      'Terminal POS tactile',
      'Imprimante de tickets / tickets cuisine',
      'Terminal de paiement',
      'Tiroir-caisse électronique',
    ],
  },
  {
    section: 'Technologie & gestion',
    family: 'Commande & réservation',
    items: ['Borne de commande tactile', 'QR code menu numérique'],
  },
  {
    section: 'Matériel traditionnel marocain',
    family: 'Ustensiles de cuisson',
    items: [
      'Tajine grand format',
      'Tajine moyen format',
      'Mini tajine individuel',
      'Tajine en fonte émaillée',
      'Couscoussier traditionnel',
      'Couscoussier inox professionnel',
      'Marmite tangia',
      'Qidra / marmite haute en cuivre',
      'Kskas en terre cuite',
      'Poêle plate marocaine',
      'Plat creux cuivre',
    ],
  },
  {
    section: 'Matériel traditionnel marocain',
    family: 'Service & présentation traditionnel',
    items: [
      'Plateau de service en cuivre martelé',
      'Plateau en bois sculpté',
      'Théière marocaine',
      'Verre à thé marocain',
      'Plateau en laiton gravé',
      'Bol à harira',
      'Tajine de présentation',
      'Assiette en zellige / céramique de Fès',
      'Couffin tressé de service',
      'Grand plat en bois',
      "Coupelle à amlou / miel / huile d'argan",
    ],
  },
  {
    section: 'Matériel traditionnel marocain',
    family: 'Préparation & transformation',
    items: [
      'Mortier en pierre',
      'Mortier en laiton',
      'Meule à argane',
      'Tamis à semoule',
      'Chalumeau à charbon',
      'Grill à charbon traditionnel',
      'Moule à chebakia',
      'Moule à kaab el ghazal',
      'Passoire à épices en cuivre',
    ],
  },
];

export const EQUIPMENT_MENU_FAMILY_NAMES: string[] = EQUIPMENT_MENU_FAMILY_SEEDS.map(
  (familySeed) => familySeed.family,
);

const GENERATED_EQUIPMENT_MENU_PRODUCTS: ProductCatalogItem[] = EQUIPMENT_MENU_FAMILY_SEEDS.flatMap(
  (familySeed, familyIndex) =>
    familySeed.items.map((name, itemIndex) =>
      createEquipmentMenuProduct(familySeed, name, familyIndex, itemIndex),
    ),
);

// TODO: Split maintenance into a dedicated Service model when the backend supports service entities.
const MAINTENANCE_SERVICE_PRODUCTS: ProductCatalogItem[] = [
  {
    slug: 'maintenance-four-professionnel',
    name: 'Maintenance four professionnel',
    family: 'Maintenance',
    imageUrl: '/assets/service-products/maintenance-four-professionnel.png',
    imageAlt: 'Technicien intervenant sur un four professionnel',
    priceMad: 300,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 20,
    quantityStep: 1,
    rating: 4.8,
    ratingCount: 42,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Diagnostic, controle securite et remise en service',
      'Intervention cuisine professionnelle',
      'Technicien ProTech Maintenance',
      'Disponible sur rendez-vous',
    ],
    cardCharacteristics: ['Service', 'Intervention', 'Disponible'],
    description: 'Maintenance preventive ou corrective de fours professionnels.',
  },
  {
    slug: 'reparation-chambre-froide',
    name: 'Reparation chambre froide',
    family: 'Maintenance',
    imageUrl: '/assets/service-products/maintenance-froid-refrigeration.png',
    imageAlt: 'Intervention technique sur chambre froide',
    priceMad: 450,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 20,
    quantityStep: 1,
    rating: 4.7,
    ratingCount: 33,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Controle groupe froid',
      'Recherche panne temperature',
      'Verification etancheite',
      'Pieces sur devis',
    ],
    cardCharacteristics: ['Service', 'Froid', 'Disponible'],
    description: 'Reparation et diagnostic de chambres froides professionnelles.',
  },
  {
    slug: 'installation-lave-vaisselle-professionnel',
    name: 'Installation lave-vaisselle professionnel',
    family: 'Installation',
    imageUrl: '/assets/service-products/installation-lave-vaisselle.png',
    imageAlt: 'Installation lave-vaisselle professionnel',
    priceMad: 350,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 20,
    quantityStep: 1,
    rating: 4.6,
    ratingCount: 27,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Pose et raccordement',
      'Controle evacuation et arrivee eau',
      'Mise en service',
      'Conseils exploitation',
    ],
    cardCharacteristics: ['Service', 'Installation', 'Disponible'],
    description: 'Installation de lave-vaisselle professionnel pour cuisines CHR.',
  },
  {
    slug: 'entretien-hotte-aspirante',
    name: 'Entretien hotte aspirante',
    family: 'Maintenance',
    imageUrl: '/assets/service-products/installation-hottes-aspiration.png',
    imageAlt: 'Entretien hotte aspirante professionnelle',
    priceMad: 280,
    unit: 'service',
    minimumQuantity: 1,
    maximumQuantity: 30,
    quantityStep: 1,
    rating: 4.5,
    ratingCount: 39,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Nettoyage filtres et conduits accessibles',
      'Controle aspiration',
      'Rapport intervention',
      'Planning recurrent possible',
    ],
    cardCharacteristics: ['Service', 'Entretien', 'Disponible'],
    description: 'Entretien de hottes aspirantes pour cuisines professionnelles.',
  },
  {
    slug: 'diagnostic-equipement-cuisine',
    name: 'Diagnostic equipement cuisine',
    family: 'Maintenance',
    imageUrl: '/assets/service-products/depannage-urgent-cuisine.png',
    imageAlt: 'Diagnostic equipement cuisine professionnelle',
    priceMad: 250,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 30,
    quantityStep: 1,
    rating: 4.6,
    ratingCount: 31,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Inspection technique multi-equipements',
      'Priorisation des reparations',
      'Estimation pieces et main d oeuvre',
      'Rapport de diagnostic',
    ],
    cardCharacteristics: ['Service', 'Diagnostic', 'Disponible'],
    description: 'Diagnostic technique pour equipements de cuisine professionnelle.',
  },
  {
    slug: 'reparation-machine-cafe-professionnelle',
    name: 'Reparation machine a cafe professionnelle',
    family: 'Maintenance',
    imageUrl: '/assets/service-products/entretien-machines-cafe.png',
    imageAlt: 'Reparation machine a cafe professionnelle',
    priceMad: 320,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 20,
    quantityStep: 1,
    rating: 4.7,
    ratingCount: 26,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Controle pression et extraction',
      'Detartrage technique',
      'Recherche fuite',
      'Pieces sur devis',
    ],
    cardCharacteristics: ['Service', 'Cafe', 'Disponible'],
    description:
      'Reparation de machines a cafe professionnelles pour cafes, hotels et restaurants.',
  },
  {
    slug: 'maintenance-friteuse-professionnelle',
    name: 'Maintenance friteuse professionnelle',
    family: 'Maintenance',
    imageUrl: '/assets/service-products/reparation-equipements-cuisson.png',
    imageAlt: 'Maintenance friteuse professionnelle',
    priceMad: 300,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 20,
    quantityStep: 1,
    rating: 4.5,
    ratingCount: 22,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Controle resistance et thermostat',
      'Verification securite',
      'Nettoyage technique',
      'Remise en service',
    ],
    cardCharacteristics: ['Service', 'Cuisson', 'Disponible'],
    description: 'Maintenance de friteuses professionnelles pour restauration.',
  },
  {
    slug: 'contrat-maintenance-mensuel-cuisine-professionnelle',
    name: 'Contrat maintenance mensuel cuisine professionnelle',
    family: 'Maintenance',
    imageUrl: '/assets/service-products/contrat-maintenance-annuel.png',
    imageAlt: 'Contrat maintenance cuisine professionnelle',
    priceMad: 1200,
    unit: 'contrat',
    minimumQuantity: 1,
    maximumQuantity: 12,
    quantityStep: 1,
    rating: 4.9,
    ratingCount: 19,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Visite mensuelle preventive',
      'Priorite intervention',
      'Suivi equipements critiques',
      'Rapport maintenance',
    ],
    cardCharacteristics: ['Service', 'Contrat', 'Disponible'],
    description: 'Contrat de maintenance mensuel pour cuisine professionnelle complete.',
  },
];

const INSTALLATION_SERVICE_PRODUCTS: ProductCatalogItem[] = [
  {
    slug: 'installation-fours-professionnels',
    name: 'Installation de fours professionnels',
    family: 'Installation',
    imageUrl: '/assets/service-products/installation-fours-professionnels.png',
    imageAlt: 'Installation de four professionnel',
    priceMad: 550,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 20,
    quantityStep: 1,
    rating: 4.8,
    ratingCount: 34,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Pose et raccordement du four',
      'Controle electricite ou gaz',
      'Mise en service initiale',
      'Essai de fonctionnement sur site',
    ],
    cardCharacteristics: ['Installation', 'Four pro', 'Sur site'],
    description: 'Installation complete de fours professionnels pour cuisines CHR.',
  },
  {
    slug: 'installation-friteuses-et-grills',
    name: 'Installation de friteuses et grills',
    family: 'Installation',
    imageUrl: '/assets/service-products/installation-friteuses-grills.png',
    imageAlt: 'Installation de friteuses et grills professionnels',
    priceMad: 420,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 20,
    quantityStep: 1,
    rating: 4.7,
    ratingCount: 28,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Positionnement et stabilisation',
      'Raccordement energie',
      'Verification securite',
      'Demarrage avec technicien',
    ],
    cardCharacteristics: ['Installation', 'Cuisson', 'Sur devis'],
    description: 'Installation de friteuses, grills et postes de cuisson snack.',
  },
  {
    slug: 'installation-cuisinieres-professionnelles',
    name: 'Installation de cuisinieres professionnelles',
    family: 'Installation',
    imageUrl: '/assets/service-products/installation-cuisinieres-professionnelles.png',
    imageAlt: 'Installation de cuisiniere professionnelle',
    priceMad: 520,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 20,
    quantityStep: 1,
    rating: 4.7,
    ratingCount: 31,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Pose du bloc cuisson',
      'Raccordement gaz ou electricite',
      'Controle des bruleurs',
      'Mise en service securisee',
    ],
    cardCharacteristics: ['Installation', 'Cuisiniere', 'Controle'],
    description: 'Pose et raccordement de cuisinieres professionnelles pour restaurants.',
  },
  {
    slug: 'installation-chambres-froides',
    name: 'Installation de chambres froides',
    family: 'Installation',
    imageUrl: '/assets/service-products/installation-chambres-froides.png',
    imageAlt: 'Installation de chambre froide professionnelle',
    priceMad: 1250,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 10,
    quantityStep: 1,
    rating: 4.9,
    ratingCount: 24,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Montage panneaux et porte',
      'Controle groupe froid',
      'Reglage temperature',
      'Validation de mise en service',
    ],
    cardCharacteristics: ['Installation', 'Froid', 'Reglage'],
    description: 'Installation de chambres froides positives ou negatives pour stockage CHR.',
  },
  {
    slug: 'installation-vitrines-refrigerees',
    name: 'Installation de vitrines refrigerees',
    family: 'Installation',
    imageUrl: '/assets/service-products/installation-vitrines-refrigerees.png',
    imageAlt: 'Installation de vitrine refrigeree professionnelle',
    priceMad: 480,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 20,
    quantityStep: 1,
    rating: 4.6,
    ratingCount: 21,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Positionnement de la vitrine',
      'Controle alimentation',
      'Reglage temperature',
      'Conseils d utilisation',
    ],
    cardCharacteristics: ['Installation', 'Vitrine', 'Froid'],
    description: 'Installation et mise en route de vitrines refrigerees de presentation.',
  },
  {
    slug: 'installation-machines-cafe-professionnelles',
    name: 'Installation de machines a cafe professionnelles',
    family: 'Installation',
    imageUrl: '/assets/service-products/installation-machines-cafe.png',
    imageAlt: 'Installation de machine a cafe professionnelle',
    priceMad: 380,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 20,
    quantityStep: 1,
    rating: 4.8,
    ratingCount: 29,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Raccordement eau et electricite',
      'Reglage pression',
      'Essai extraction cafe',
      'Formation rapide equipe',
    ],
    cardCharacteristics: ['Installation', 'Cafe', 'Reglage'],
    description: 'Installation de machines a cafe professionnelles pour cafes, hotels et restaurants.',
  },
  {
    slug: 'installation-hottes-aspiration',
    name: "Installation d'hottes d'aspiration",
    family: 'Installation',
    imageUrl: '/assets/service-products/installation-hottes-aspiration.png',
    imageAlt: "Installation d'une hotte d aspiration professionnelle",
    priceMad: 900,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 10,
    quantityStep: 1,
    rating: 4.7,
    ratingCount: 22,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Pose de hotte inox',
      'Controle extraction',
      'Alignement sur ligne de cuisson',
      'Verification de securite',
    ],
    cardCharacteristics: ['Installation', 'Hotte', 'Extraction'],
    description: "Installation de hottes d aspiration pour cuisines professionnelles.",
  },
  {
    slug: 'amenagement-cuisine-professionnelle',
    name: 'Amenagement cuisine professionnelle',
    family: 'Installation',
    imageUrl: '/assets/service-products/amenagement-cuisine-professionnelle.png',
    imageAlt: 'Amenagement de cuisine professionnelle',
    priceMad: 1800,
    unit: 'projet',
    minimumQuantity: 1,
    maximumQuantity: 5,
    quantityStep: 1,
    rating: 4.9,
    ratingCount: 18,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Implantation des postes',
      'Organisation flux cuisine',
      'Coordination installation',
      'Planification sur site',
    ],
    cardCharacteristics: ['Installation', 'Amenagement', 'Projet'],
    description: 'Amenagement technique de cuisine professionnelle avec coordination sur site.',
  },
  {
    slug: 'installation-standard',
    name: 'Installation standard',
    family: 'Installation',
    imageUrl: '/assets/service-products/amenagement-cuisine-professionnelle.png',
    imageAlt: 'Installation standard en cuisine professionnelle',
    priceMad: 300,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 30,
    quantityStep: 1,
    rating: 4.6,
    ratingCount: 26,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Installation simple equipement',
      'Controle niveau et branchements',
      'Essai rapide',
      'Compte rendu intervention',
    ],
    cardCharacteristics: ['Installation', 'Standard', 'Rapide'],
    description: 'Installation standard pour equipements CHR courants.',
  },
  {
    slug: 'installation-sur-site',
    name: 'Installation sur site',
    family: 'Installation',
    imageUrl: '/assets/service-products/amenagement-cuisine-professionnelle.png',
    imageAlt: 'Installation sur site en cuisine professionnelle',
    priceMad: 450,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 20,
    quantityStep: 1,
    rating: 4.7,
    ratingCount: 25,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Deplacement technicien',
      'Pose selon contraintes du local',
      'Verification installation',
      'Conseil exploitation',
    ],
    cardCharacteristics: ['Installation', 'Sur site', 'Technicien'],
    description: 'Service d installation sur site pour cuisines professionnelles.',
  },
  {
    slug: 'mise-conformite-reglementaire',
    name: 'Mise en conformite reglementaire',
    family: 'Installation',
    imageUrl: '/assets/service-products/contrat-maintenance-annuel.png',
    imageAlt: 'Mise en conformite reglementaire cuisine professionnelle',
    priceMad: 700,
    unit: 'audit',
    minimumQuantity: 1,
    maximumQuantity: 10,
    quantityStep: 1,
    rating: 4.8,
    ratingCount: 17,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Controle securite installation',
      'Verification raccordements',
      'Points de conformite',
      'Rapport technique',
    ],
    cardCharacteristics: ['Installation', 'Conformite', 'Rapport'],
    description: 'Mise en conformite technique des installations de cuisine professionnelle.',
  },
  {
    slug: 'mise-service-initiale',
    name: 'Mise en service initiale',
    family: 'Installation',
    imageUrl: '/assets/service-products/extension-garantie-service.png',
    imageAlt: 'Mise en service initiale equipement professionnel',
    priceMad: 260,
    unit: 'equipement',
    minimumQuantity: 1,
    maximumQuantity: 30,
    quantityStep: 1,
    rating: 4.6,
    ratingCount: 19,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Premier demarrage',
      'Controle parametres',
      'Test fonctionnel',
      'Conseils utilisateur',
    ],
    cardCharacteristics: ['Installation', 'Mise en route', 'Test'],
    description: 'Mise en service initiale apres pose ou livraison d equipement CHR.',
  },
  {
    slug: 'montage-sur-site',
    name: 'Montage sur site',
    family: 'Installation',
    imageUrl: '/assets/service-products/amenagement-cuisine-professionnelle.png',
    imageAlt: 'Montage sur site equipement professionnel',
    priceMad: 360,
    unit: 'intervention',
    minimumQuantity: 1,
    maximumQuantity: 30,
    quantityStep: 1,
    rating: 4.7,
    ratingCount: 20,
    supplier: PROTECH_MAINTENANCE_SUPPLIER,
    characteristics: [
      'Montage des elements',
      'Fixation et stabilisation',
      'Controle final',
      'Nettoyage zone intervention',
    ],
    cardCharacteristics: ['Installation', 'Montage', 'Sur site'],
    description: 'Montage sur site pour equipements professionnels de cuisine.',
  },
];

export const PRODUCT_CATALOG: ProductCatalogItem[] = [
  ...ROOT_TUBER_PRODUCTS,
  ...GENERATED_FOOD_PRODUCTS,
  ...PROFESSIONAL_EQUIPMENT_PRODUCTS,
  ...GENERATED_EQUIPMENT_MENU_PRODUCTS,
  ...INSTALLATION_SERVICE_PRODUCTS,
  ...MAINTENANCE_SERVICE_PRODUCTS,
];

export function findProductBySlug(slug: string | null): ProductCatalogItem | undefined {
  return PRODUCT_CATALOG.find((product) => product.slug === slug);
}

export function getProductsByFamily(family: string | null): ProductCatalogItem[] {
  const normalizedFamily = family ? normalizeProductFamily(family) : null;

  return normalizedFamily
    ? PRODUCT_CATALOG.filter(
        (product) => normalizeProductFamily(product.family) === normalizedFamily,
      )
    : PRODUCT_CATALOG;
}

function normalizeProductFamily(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function createGeneratedProduct(
  familySeed: FoodFamilySeed,
  item: readonly [name: string, priceMad: number, unit?: string],
  familyIndex: number,
  itemIndex: number,
): ProductCatalogItem {
  const theme = GENERATED_THEMES[familySeed.theme];
  const [name, priceMad, unitOverride] = item;
  const imageOverride = PRODUCT_IMAGE_OVERRIDES[name];
  const supplier = GENERATED_SUPPLIERS[(familyIndex + itemIndex) % GENERATED_SUPPLIERS.length];
  const rating = Number((4.2 + ((familyIndex + itemIndex) % 7) * 0.1).toFixed(1));

  return {
    slug: slugify(name),
    name,
    family: familySeed.family,
    imageUrl: imageOverride?.imageUrl ?? createGeneratedImage(name, familySeed.family, theme),
    imageAlt: imageOverride?.imageAlt ?? `${name} - ${familySeed.family}`,
    priceMad,
    unit: unitOverride ?? theme.unit,
    minimumQuantity: theme.minimumQuantity,
    maximumQuantity: theme.maximumQuantity,
    quantityStep: theme.quantityStep,
    rating,
    ratingCount: 18 + (((familyIndex + 1) * (itemIndex + 5)) % 74),
    supplier,
    characteristics: [
      `${name} sélectionné pour commandes professionnelles`,
      theme.packaging,
      theme.quality,
      `Famille ${familySeed.family}`,
      'Traçabilité fournisseur et disponibilité suivie',
    ],
    cardCharacteristics: [theme.packaging, theme.shortTrait],
    description: `${name} disponible pour restaurants, traiteurs, commerces alimentaires et achats en gros dans la catégorie ${familySeed.family}.`,
  };
}

function createEquipmentMenuProduct(
  familySeed: EquipmentFamilySeed,
  name: string,
  familyIndex: number,
  itemIndex: number,
): ProductCatalogItem {
  const imageOverride = EQUIPMENT_IMAGE_OVERRIDES[name];
  const priceMad = 650 + familyIndex * 370 + itemIndex * 290;
  const rating = Number((4.3 + ((familyIndex + itemIndex) % 6) * 0.1).toFixed(1));

  return {
    slug: slugify(`${familySeed.family}-${name}`),
    name,
    family: familySeed.family,
    imageUrl:
      imageOverride?.imageUrl ??
      createGeneratedImage(name, familySeed.family, EQUIPMENT_MENU_THEME),
    imageAlt: imageOverride?.imageAlt ?? `${name} - ${familySeed.family}`,
    priceMad,
    unit: 'unite',
    minimumQuantity: 1,
    maximumQuantity: 20,
    quantityStep: 1,
    rating,
    ratingCount: 12 + (((familyIndex + 3) * (itemIndex + 7)) % 68),
    supplier: EQUIPMENT_SUPPLIER,
    characteristics: [
      familySeed.section,
      `Famille ${familySeed.family}`,
      'Selection CHR pour restaurants, hotels et traiteurs',
      'Disponibilite et installation sur devis fournisseur',
    ],
    cardCharacteristics: ['Equipement', familySeed.family, 'Sur devis'],
    description: `${name} disponible pour professionnels CHR dans la famille ${familySeed.family}.`,
  };
}

function createGeneratedImage(name: string, family: string, theme: GeneratedTheme): string {
  const [surface, accent, ink] = theme.colors;
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700" role="img" aria-label="${escapeSvg(
    name,
  )}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${surface}"/>
      <stop offset="1" stop-color="${accent}"/>
    </linearGradient>
  </defs>
  <rect width="900" height="700" fill="url(#bg)"/>
  <path d="M0 500 900 330v370H0z" fill="${ink}" opacity=".16"/>
  <path d="M90 0h92l-92 700H0z" fill="#ffffff" opacity=".23"/>
  <path d="M760 0h140v700H610z" fill="${ink}" opacity=".14"/>
  <rect x="70" y="76" width="760" height="548" rx="28" fill="#ffffff" opacity=".76"/>
  <rect x="108" y="114" width="684" height="470" rx="22" fill="${surface}" opacity=".72"/>
  <text x="132" y="194" fill="${ink}" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="800">${escapeSvg(
    family,
  )}</text>
  <text x="132" y="358" fill="${ink}" font-family="Inter, Arial, sans-serif" font-size="76" font-weight="900">${escapeSvg(
    initials,
  )}</text>
  <text x="132" y="434" fill="${ink}" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="900">${escapeSvg(
    name,
  )}</text>
  <text x="132" y="512" fill="${accent}" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800">PROFOOD MARKETPLACE</text>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' et ')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function escapeSvg(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return char;
    }
  });
}
