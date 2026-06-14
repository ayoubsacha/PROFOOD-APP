import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getProductsByFamily, ProductCatalogItem } from '../../models/product-catalog.models';

interface MarketplaceMenuItem {
  label: string;
  icon?: string;
  dropdown?: boolean;
}

interface ProfoodChild {
  label: string;
  children: string[];
}

interface ProfoodCategory {
  label: string;
  children: ProfoodChild[];
}

interface ProductPreview {
  slug?: string;
  name: string;
  category: string;
  price: string;
  status: string;
  supplier: string;
  visual: 'leafy' | 'citrus' | 'fish' | 'dairy' | 'grain';
  imageUrl?: string;
  imageAlt?: string;
  characteristics?: string[];
}

interface ServicePreview {
  name: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
}

interface ServiceImageRule {
  terms: string[];
  file: string;
}

const SERVICE_IMAGE_BASE = '/assets/service-products/';

const INSTALLATION_SERVICE_IMAGE_RULES: ServiceImageRule[] = [
  { terms: ['four'], file: 'installation-fours-professionnels.png' },
  { terms: ['friteuse', 'grill'], file: 'installation-friteuses-grills.png' },
  { terms: ['cuisiniere'], file: 'installation-cuisinieres-professionnelles.png' },
  { terms: ['chambre', 'froide'], file: 'installation-chambres-froides.png' },
  { terms: ['vitrine', 'refrigeree'], file: 'installation-vitrines-refrigerees.png' },
  { terms: ['machine cafe'], file: 'installation-machines-cafe.png' },
  { terms: ['lave vaisselle'], file: 'installation-lave-vaisselle.png' },
  { terms: ['hotte', 'aspiration'], file: 'installation-hottes-aspiration.png' },
  { terms: ['conformite'], file: 'contrat-maintenance-annuel.png' },
  { terms: ['amenagement'], file: 'amenagement-cuisine-professionnelle.png' },
  { terms: ['standard'], file: 'amenagement-cuisine-professionnelle.png' },
  { terms: ['sur site'], file: 'amenagement-cuisine-professionnelle.png' },
  { terms: ['mise en service'], file: 'extension-garantie-service.png' },
  { terms: ['montage'], file: 'amenagement-cuisine-professionnelle.png' },
];

const MAINTENANCE_SERVICE_IMAGE_RULES: ServiceImageRule[] = [
  { terms: ['contrat'], file: 'contrat-maintenance-annuel.png' },
  { terms: ['periodique', 'four'], file: 'maintenance-preventive-fours.png' },
  { terms: ['machine cafe'], file: 'entretien-machines-cafe.png' },
  { terms: ['equipement', 'froid'], file: 'maintenance-froid-refrigeration.png' },
  { terms: ['depannage'], file: 'depannage-urgent-cuisine.png' },
  { terms: ['cuisson'], file: 'reparation-equipements-cuisson.png' },
  { terms: ['refrigeration'], file: 'maintenance-froid-refrigeration.png' },
  { terms: ['lave vaisselle'], file: 'reparation-lave-vaisselle.png' },
  { terms: ['apres vente'], file: 'service-apres-vente-equipements.png' },
  { terms: ['sav'], file: 'service-apres-vente-equipements.png' },
  { terms: ['extension'], file: 'extension-garantie-service.png' },
  { terms: ['generale'], file: 'depannage-urgent-cuisine.png' },
  { terms: ['preventive'], file: 'maintenance-preventive-fours.png' },
];

@Component({
  selector: 'app-marketplace-menu',
  imports: [RouterLink],
  templateUrl: './marketplace-menu.component.html',
  styleUrl: './marketplace-menu.component.scss',
})
export class MarketplaceMenuComponent {
  protected readonly profoodOpen = signal(false);
  protected readonly selectedProfoodIndex = signal<number | null>(null);
  protected readonly selectedProfoodChildIndex = signal<number | null>(null);
  protected readonly selectedProfoodLeafIndex = signal<number | null>(null);
  protected readonly productSlideStart = signal(0);
  protected readonly serviceSlideStart = signal(0);

  protected readonly menuRows: MarketplaceMenuItem[][] = [
    [
      { label: 'PROFOOD MARKETPLACE', dropdown: true },
      { label: 'Espace communautaire', dropdown: true },
      { label: 'FAQ' },
      { label: 'Articles' },
      { label: 'Actualité' },
      { label: 'FORUM' },
      { label: 'Annonce' },
      { label: 'Annuaire' },
    ],
  ];

  protected readonly profoodCategories: ProfoodCategory[] = [
    {
      label: 'Produit alimentaire',
      children: [
        {
          label: 'Légumes',
          children: [
            'Légumes racines & tubercules',
            'Légumes bulbes',
            'Légumineuses fraîches',
            'Champignons',
            'Herbes aromatiques',
          ],
        },
        {
          label: 'Fruits',
          children: [
            'Agrumes',
            'Fruits à pépins',
            'Fruits à noyau',
            'Fruits tropicaux',
            'Fruits rouges',
            'Melons & pastèques',
            'Raisins',
            'Fruits méditerranéens',
            'Fruits secs & noix',
          ],
        },
        {
          label: 'Poissons & fruits de mer',
          children: [
            'Poissons frais',
            'Poissons nobles',
            'Filets & découpes',
            'Céphalopodes',
            'Crustacés',
            'Coquillages',
            'Produits surgelés',
          ],
        },
        {
          label: 'Lait & dérivés',
          children: [
            'Lait',
            'Crèmes',
            'Beurres & matières grasses',
            'Yaourts & fermentés',
            'Fromages frais',
            'Desserts lactés',
            'Glacerie',
          ],
        },
        {
          label: 'Viandes & volailles',
          children: [
            'Viande bovine',
            'Viande ovine',
            'Viande caprine',
            'Viande de veau',
            'Volaille',
            'Charcuterie halal',
            'Abats',
            'Produits préparés',
            'Surgelés viande',
          ],
        },
        {
          label: 'Produits secs & épicerie professionnelle',
          children: [
            'Farines & semoules',
            'Levures & agents de pousse',
            'Sucres & édulcorants',
            'Sels & assaisonnements de base',
            'Épices marocaines',
            'Céréales & féculents',
            'Légumineuses sèches',
            'Conserves & sauces sèches',
            'Fruits secs & graines',
            'Poudres & bases pâtisserie',
          ],
        },
        {
          label: 'Boissons chaudes',
          children: ['Café', 'Thé', 'Infusions', 'Chocolat chaud'],
        },
        {
          label: 'Huiles & matières grasses',
          children: [
            'Huiles alimentaires',
            'Matières grasses laitières',
            'Matières grasses traditionnelles',
            'Matières grasses culinaires',
          ],
        },
      ],
    },
    {
      label: 'Équipements',
      children: [
        {
          label: 'Équipements techniques de production',
          children: [
            'Cuisson',
            'Fours',
            'Froid & conservation',
            'Préparation alimentaire',
            'Boulangerie',
            'Pâtisserie',
            'Snack / fast-food',
          ],
        },
        {
          label: 'Mobilier & aménagement',
          children: ['Mobilier cuisine', 'Mobilier salle', 'Stockage'],
        },
        {
          label: 'Service & présentation',
          children: ['Vaisselle', 'Couverts', 'Verrerie', 'Présentation & service'],
        },
        {
          label: 'Emballage & vente à emporter',
          children: ['Emballage alimentaire', 'Packaging personnalisé', 'Livraison'],
        },
        {
          label: 'Hygiène & sécurité',
          children: ['Lavage', 'Sécurité', 'Normes haccp'],
        },
        {
          label: 'Tenue & ressources humaines',
          children: ['Tenue de travail', 'Protection'],
        },
        {
          label: 'Technologie & gestion',
          children: ['Systèmes de caisse', 'Commande & réservation'],
        },
        {
          label: 'Matériel traditionnel marocain',
          children: [
            'Ustensiles de cuisson',
            'Service & présentation traditionnel',
            'Préparation & transformation',
          ],
        },
      ],
    },
    {
      label: 'Services',
      children: [
        {
          label: 'Installation',
          children: [
            'Installation de fours professionnels',
            'Installation de friteuses et grills',
            'Installation de cuisinières professionnelles',
            'Installation de chambres froides',
            'Installation de vitrines réfrigérées',
            'Installation de machines à café professionnelles',
            "Installation de lave-vaisselle professionnels",
            "Installation d'hottes d'aspiration",
            'Aménagement cuisine professionnelle',
            'Installation standard',
            'Installation sur site',
            'Mise en conformité réglementaire',
            'Mise en service initiale',
            'Montage sur site',
          ],
        },
        {
          label: 'Maintenance',
          children: [
            'Contrat de maintenance annuel',
            'Entretien périodique des fours',
            'Entretien des machines à café',
            'Entretien des équipements de froid',
            'Dépannage urgent',
            "Réparation d'équipements de cuisson",
            'Réparation de systèmes de réfrigération',
            'Réparation de lave-vaisselle professionnels',
            'Service après-vente équipements',
            'Extension de garantie',
            'Maintenance générale',
            'Maintenance préventive',
            'Service après-vente SAV',
          ],
        },
        {
          label: 'Nettoyage Industriel',
          children: [
            'Nettoyage profond cuisine',
            'Nettoyage et désinfection des équipements',
            'Nettoyage chambres froides',
            'Nettoyage salle de restaurant',
            'Désinfection complète',
            'Collecte et traitement des déchets alimentaires',
            'Collecte des huiles usagées',
          ],
        },
        {
          label: 'Logistique',
          children: [
            'Audit et optimisation des stocks',
            'Gestion des commandes automatisée',
            'Entreposage et stockage temporaire',
            'Transport réfrigéré',
            'Transport surgelé',
            'Transport produits secs et emballages',
            'Emballage et conditionnement produits',
            'Préparation de kits / commandes personnalisées',
            'Fourniture de produits',
            'Fourniture en lots',
          ],
        },
        {
          label: 'Conseil & Devis',
          children: [
            "Conseil aménagement d'espace",
            'Conseil choix de gamme',
            'Conseil conformité et normes',
            'Conseil et aide au choix',
            'Conseil format et conditionnement',
          ],
        },
        {
          label: 'Formation',
          children: ['Formation sécurité', "Formation à l'utilisation"],
        },
        {
          label: 'Personnalisation & Impression',
          children: [
            'Broderie et marquage logo',
            'Design graphique',
            'Impression personnalisée',
            'Personnalisation produit',
            'Personnalisation sur demande',
            'Validation BAT',
          ],
        },
        {
          label: 'Remplacement & Renouvellement',
          children: [
            'Remplacement en cas de casse',
            'Renouvellement de stock',
            'Renouvellement standard',
          ],
        },
        {
          label: 'Services Spéciaux',
          children: ['Prise de mesures / tailles'],
        },
        {
          label: 'Approvisionnement B2B',
          children: [
            'Approvisionnement produits secs et épices',
            'Approvisionnement pâtisserie et boulangerie',
            'Approvisionnement café et boissons chaudes',
            'Approvisionnement huiles et matières grasses',
            'Approvisionnement emballages alimentaires B2B',
          ],
        },
        {
          label: 'Préparation & Découpe',
          children: [
            'Découpe professionnelle de viandes',
            'Filetage et nettoyage de poissons sur demande',
            'Mélange et conditionnement épices sur commande',
            'Préparation mélange thé marocain sur commande',
          ],
        },
        {
          label: 'Traçabilité & Conformité',
          children: [
            'Traçabilité lot et étiquetage HACCP',
            'Certificat sanitaire et contrôle qualité produits',
            'Gestion DLC et planification commandes récurrentes',
          ],
        },
      ],
    },
  ];

  protected readonly productPreviewCards: ProductPreview[] = [
    {
      name: 'Lot professionnel',
      category: 'Industriel',
      price: 'Prix Non Spécifié',
      status: 'Stock disponible',
      supplier: 'panier meida',
      visual: 'leafy',
    },
    {
      name: 'Offre fournisseur',
      category: 'Marketplace',
      price: 'Prix négociable',
      status: 'Commande groupée',
      supplier: 'profood supply',
      visual: 'citrus',
    },
    {
      name: 'Produit premium',
      category: 'Restaurant',
      price: 'Sur demande',
      status: 'Fournisseur vérifié',
      supplier: 'atlas food',
      visual: 'fish',
    },
    {
      name: 'Pack cuisine pro',
      category: 'Grossiste',
      price: 'Prix Non Spécifié',
      status: 'Livraison possible',
      supplier: 'market chef',
      visual: 'dairy',
    },
    {
      name: 'Lot sec certifié',
      category: 'Epicerie',
      price: 'Sur devis',
      status: 'Conditionnement pro',
      supplier: 'casa profood',
      visual: 'grain',
    },
  ];

  protected readonly selectedProfood = computed<ProfoodCategory | null>(() => {
    const index = this.selectedProfoodIndex();
    return index === null ? null : this.profoodCategories[index];
  });

  protected readonly selectedProfoodChild = computed<ProfoodChild | null>(() => {
    const category = this.selectedProfood();
    const index = this.selectedProfoodChildIndex();
    return category && index !== null ? category.children[index] : null;
  });

  protected readonly selectedProfoodLeaf = computed<string | null>(() => {
    const child = this.selectedProfoodChild();
    const index = this.selectedProfoodLeafIndex();
    return child && index !== null ? child.children[index] : null;
  });

  protected readonly selectedIsServiceCategory = computed(
    () => this.selectedProfood()?.label === 'Services',
  );

  protected readonly visibleServiceItems = computed<ServicePreview[]>(() => {
    const child = this.selectedProfoodChild();

    if (!child?.children.length) {
      return [];
    }

    const start = this.serviceSlideStart();
    return Array.from({ length: Math.min(3, child.children.length) }, (_, offset) => {
      const index = (start + offset) % child.children.length;
      return this.toServicePreview(child.children[index], child.label);
    });
  });

  protected readonly selectedProductPreviewCards = computed<ProductPreview[]>(() => {
    const productFamily = this.selectedProfoodLeaf();
    const familyProducts = getProductsByFamily(productFamily).map((product) =>
      this.toProductPreview(product),
    );

    return productFamily && familyProducts.length ? familyProducts : this.productPreviewCards;
  });

  protected readonly visibleProductPreviewCards = computed<ProductPreview[]>(() => {
    const start = this.productSlideStart();
    const products = this.selectedProductPreviewCards();
    return Array.from({ length: 3 }, (_, offset) => {
      const index = (start + offset) % products.length;
      return products[index];
    });
  });

  protected toggleProfood(event: MouseEvent): void {
    event.preventDefault();
    const shouldOpen = !this.profoodOpen();
    this.profoodOpen.set(shouldOpen);
    this.selectedProfoodIndex.set(null);
    this.selectedProfoodChildIndex.set(null);
    this.selectedProfoodLeafIndex.set(null);
    this.productSlideStart.set(0);
    this.serviceSlideStart.set(0);
  }

  protected selectProfood(index: number): void {
    this.selectedProfoodIndex.set(index);
    this.selectedProfoodChildIndex.set(null);
    this.selectedProfoodLeafIndex.set(null);
    this.productSlideStart.set(0);
    this.serviceSlideStart.set(0);
  }

  protected selectProfoodChild(index: number): void {
    this.selectedProfoodChildIndex.set(index);
    this.selectedProfoodLeafIndex.set(null);
    this.productSlideStart.set(0);
    this.serviceSlideStart.set(0);
  }

  protected selectProfoodLeaf(index: number): void {
    this.selectedProfoodLeafIndex.set(index);
    this.productSlideStart.set(0);
  }

  protected previousProductSlide(): void {
    const productCount = this.selectedProductPreviewCards().length;
    if (!productCount) {
      return;
    }
    this.productSlideStart.update((index) => (index - 1 + productCount) % productCount);
  }

  protected nextProductSlide(): void {
    const productCount = this.selectedProductPreviewCards().length;
    if (!productCount) {
      return;
    }
    this.productSlideStart.update((index) => (index + 1) % productCount);
  }

  protected previousServiceSlide(): void {
    const serviceCount = this.selectedProfoodChild()?.children.length || 0;
    if (!serviceCount) {
      return;
    }
    this.serviceSlideStart.update((index) => (index - 1 + serviceCount) % serviceCount);
  }

  protected nextServiceSlide(): void {
    const serviceCount = this.selectedProfoodChild()?.children.length || 0;
    if (!serviceCount) {
      return;
    }
    this.serviceSlideStart.update((index) => (index + 1) % serviceCount);
  }

  protected closeHierarchy(): void {
    this.profoodOpen.set(false);
    this.selectedProfoodIndex.set(null);
    this.selectedProfoodChildIndex.set(null);
    this.selectedProfoodLeafIndex.set(null);
    this.productSlideStart.set(0);
    this.serviceSlideStart.set(0);
  }

  private toServicePreview(name: string, category: string): ServicePreview {
    const file = this.serviceImageFileFor(name, category);

    return {
      name,
      category,
      imageUrl: `${SERVICE_IMAGE_BASE}${file}`,
      imageAlt: `${name} - ${category}`,
    };
  }

  private serviceImageFileFor(name: string, category: string): string {
    const normalizedName = this.normalizeServiceText(name);
    const normalizedCategory = this.normalizeServiceText(category);
    const rules = normalizedCategory.includes('installation')
      ? INSTALLATION_SERVICE_IMAGE_RULES
      : normalizedCategory.includes('maintenance')
        ? MAINTENANCE_SERVICE_IMAGE_RULES
        : [];

    const match = rules.find((rule) => rule.terms.every((term) => normalizedName.includes(term)));

    if (match) {
      return match.file;
    }

    return normalizedCategory.includes('maintenance')
      ? 'maintenance-four-professionnel.png'
      : 'amenagement-cuisine-professionnelle.png';
  }

  private normalizeServiceText(value: string): string {
    return value
      .replace(/\u00c3\u00a9|\u00c3\u00a8|\u00c3\u00aa|\u00c3\u00ab/g, 'e')
      .replace(/\u00c3\u00a0|\u00c3\u00a2/g, 'a')
      .replace(/\u00c3\u00b4/g, 'o')
      .replace(/\u00c3\u00b9|\u00c3\u00bb/g, 'u')
      .replace(/\u00c3\u00ae|\u00c3\u00af/g, 'i')
      .replace(/\u00c3\u00a7/g, 'c')
      .replace(/\u00c3\u0089/g, 'e')
      .replace(/\u00e2\u20ac\u2122|\u00e2\u20ac\u02dc/g, "'")
      .replace(/\u00e2\u20ac\u201c|\u00e2\u20ac\u201d/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  private formatMoney(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      maximumFractionDigits: 2,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
  }

  private toProductPreview(product: ProductCatalogItem): ProductPreview {
    return {
      slug: product.slug,
      name: product.name,
      category: product.family,
      price: `${this.formatMoney(product.priceMad)} MAD / ${product.unit}`,
      status: product.cardCharacteristics[0],
      supplier: product.supplier.name,
      visual: this.visualForFamily(product.family),
      imageUrl: product.imageUrl,
      imageAlt: product.imageAlt,
      characteristics: product.cardCharacteristics,
    };
  }

  private visualForFamily(family: string): ProductPreview['visual'] {
    if (
      family.includes('Poissons') ||
      family.includes('Filets') ||
      family.includes('Céphalopodes') ||
      family.includes('Crustacés') ||
      family.includes('Coquillages')
    ) {
      return 'fish';
    }

    if (
      family.includes('Lait') ||
      family.includes('Crèmes') ||
      family.includes('Beurres') ||
      family.includes('Yaourts') ||
      family.includes('Fromages') ||
      family.includes('Desserts') ||
      family.includes('Glacerie')
    ) {
      return 'dairy';
    }

    if (
      family.includes('Farines') ||
      family.includes('Levures') ||
      family.includes('Sucres') ||
      family.includes('Sels') ||
      family.includes('Épices') ||
      family.includes('Céréales') ||
      family.includes('Légumineuses sèches') ||
      family.includes('Conserves') ||
      family.includes('Poudres') ||
      family.includes('Café') ||
      family.includes('Thé') ||
      family.includes('Infusions') ||
      family.includes('Chocolat') ||
      family.includes('Huiles') ||
      family.includes('Matières')
    ) {
      return 'grain';
    }

    return family.includes('Fruits') || family.includes('Agrumes') || family.includes('Raisins')
      ? 'citrus'
      : 'leafy';
  }
}
