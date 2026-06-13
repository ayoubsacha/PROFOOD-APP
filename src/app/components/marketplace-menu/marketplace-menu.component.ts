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
      label: 'Equipment',
      children: [
        { label: 'Matériel industriel', children: [] },
        { label: 'Équipements cuisine', children: [] },
        { label: 'Solutions logistiques', children: [] },
      ],
    },
    {
      label: 'Services',
      children: [
        { label: 'Services professionnels', children: [] },
        { label: 'Conseil & accompagnement', children: [] },
        { label: 'Maintenance', children: [] },
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
  }

  protected selectProfood(index: number): void {
    this.selectedProfoodIndex.set(index);
    this.selectedProfoodChildIndex.set(null);
    this.selectedProfoodLeafIndex.set(null);
    this.productSlideStart.set(0);
  }

  protected selectProfoodChild(index: number): void {
    this.selectedProfoodChildIndex.set(index);
    this.selectedProfoodLeafIndex.set(null);
    this.productSlideStart.set(0);
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

  protected closeHierarchy(): void {
    this.profoodOpen.set(false);
    this.selectedProfoodIndex.set(null);
    this.selectedProfoodChildIndex.set(null);
    this.selectedProfoodLeafIndex.set(null);
    this.productSlideStart.set(0);
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
