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

const PRODUCT_IMAGE_OVERRIDES: Record<string, { imageUrl: string; imageAlt: string }> = {
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

export const PRODUCT_CATALOG: ProductCatalogItem[] = [
  ...ROOT_TUBER_PRODUCTS,
  ...GENERATED_FOOD_PRODUCTS,
];

export function findProductBySlug(slug: string | null): ProductCatalogItem | undefined {
  return PRODUCT_CATALOG.find((product) => product.slug === slug);
}

export function getProductsByFamily(family: string | null): ProductCatalogItem[] {
  return family ? PRODUCT_CATALOG.filter((product) => product.family === family) : PRODUCT_CATALOG;
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
