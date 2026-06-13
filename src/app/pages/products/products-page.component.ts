import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductApiService } from '../../core/product-api.service';
import { PRODUCT_CATALOG, ProductCatalogItem } from '../../models/product-catalog.models';

type ProductGroupId =
  | 'fruits-legumes'
  | 'poissons'
  | 'lait'
  | 'viandes'
  | 'fruits-secs'
  | 'equipements'
  | 'maintenance';

interface ProductGroupConfig {
  id: ProductGroupId;
  label: string;
  description: string;
  image: string;
  families: string[];
}

interface ProductGroupView extends ProductGroupConfig {
  products: ProductCatalogItem[];
  totalProducts: number;
}

@Component({
  selector: 'app-products-page',
  imports: [RouterLink],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
})
export class ProductsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productApi = inject(ProductApiService);

  protected readonly allProducts = signal<ProductCatalogItem[]>(PRODUCT_CATALOG);
  protected readonly isLoading = signal(true);
  protected readonly searchTerms = signal<Record<ProductGroupId, string>>({
    'fruits-legumes': '',
    poissons: '',
    lait: '',
    viandes: '',
    'fruits-secs': '',
    equipements: '',
    maintenance: '',
  });

  protected readonly groupConfigs: ProductGroupConfig[] = [
    {
      id: 'fruits-legumes',
      label: 'Fruits et légumes',
      description: 'Fruits frais, légumes, herbes et produits de saison pour achats B2B.',
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
      id: 'poissons',
      label: 'Poissons et fruits de mer',
      description: 'Poissons, crustaces, coquillages et produits sous chaine froide.',
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
      id: 'lait',
      label: 'Lait et produits dérivés',
      description: 'Lait, crème, beurre, fromages, yaourts et desserts lactés.',
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
      id: 'viandes',
      label: 'Viandes et volailles',
      description: 'Viandes bovines, ovines, caprines, veau, volailles et découpes.',
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
      id: 'fruits-secs',
      label: 'Fruits secs, graines et noix',
      description: 'Noix, raisins secs, graines et fruits secs séparés des produits frais.',
      image: '/assets/group-events.png',
      families: ['Fruits secs & graines', 'Fruits secs & noix', 'Raisins'],
    },
    {
      id: 'equipements',
      label: 'Équipements professionnels',
      description: 'Matériel de cuisine professionnelle, froid, cuisson et préparation.',
      image: '/assets/group-professionals.png',
      families: ['Equipements professionnels'],
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      description: 'Interventions, installation, diagnostic et contrats de maintenance cuisine.',
      image: '/assets/group-maintenance.png',
      families: ['Maintenance'],
    },
  ];

  protected readonly groups = computed<ProductGroupView[]>(() =>
    this.groupConfigs.map((group) => {
      const baseProducts = this.allProducts().filter((product) => this.belongsToGroup(product, group));
      const search = this.normalize(this.searchTerms()[group.id]);

      return {
        ...group,
        totalProducts: baseProducts.length,
        products: baseProducts.filter((product) => {
          return !search || this.normalize(product.name).includes(search);
        }),
      };
    }),
  );

  constructor() {
    this.productApi
      .getProducts()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (products) => {
          this.allProducts.set(products);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });

    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const family = params.get('family');

      if (family) {
        this.queueScrollToQuery(family);
      }
    });
  }

  protected scrollToGroup(groupId: ProductGroupId, event?: Event): void {
    event?.preventDefault();
    this.scrollToSection(this.sectionId(groupId));
  }

  protected scrollSlider(track: HTMLElement, direction: -1 | 1): void {
    track.scrollBy({
      left: direction * Math.max(280, Math.round(track.clientWidth * 0.86)),
      behavior: 'smooth',
    });
  }

  protected searchTerm(groupId: ProductGroupId): string {
    return this.searchTerms()[groupId];
  }

  protected updateGroupSearch(groupId: ProductGroupId, event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchTerms.update((terms) => ({
      ...terms,
      [groupId]: value,
    }));
  }

  protected sectionId(groupId: ProductGroupId): string {
    return `catalogue-${groupId}`;
  }

  protected priceText(product: ProductCatalogItem): string {
    const price = `${this.formatMoney(product.priceMad)} MAD`;
    return this.isService(product) ? `A partir de ${price} / ${product.unit}` : `${price} / ${product.unit}`;
  }

  protected actionLabel(product: ProductCatalogItem): string {
    return this.isService(product) ? 'Demander un devis' : 'Voir le produit';
  }

  protected statusLabel(product: ProductCatalogItem): string {
    if (this.isService(product)) {
      return 'Disponible';
    }

    return product.cardCharacteristics[1] || product.cardCharacteristics[0] || 'Disponible';
  }

  protected productTags(product: ProductCatalogItem): string[] {
    return product.cardCharacteristics.slice(0, 3);
  }

  protected isService(product: ProductCatalogItem): boolean {
    return (
      this.normalize(product.family) === this.normalize('Maintenance') ||
      product.cardCharacteristics.some((tag) => this.normalize(tag).includes('service'))
    );
  }

  private queueScrollToQuery(value: string): void {
    const groupId = this.groupIdForQuery(value);

    if (!groupId) {
      return;
    }

    window.setTimeout(() => this.scrollToSection(this.sectionId(groupId)), 80);
  }

  private groupIdForQuery(value: string): ProductGroupId | null {
    const query = this.normalize(value);
    const group = this.groupConfigs.find((item) => {
      return (
        this.normalize(item.label) === query ||
        item.families.some((family) => this.normalize(family) === query)
      );
    });

    return group?.id ?? null;
  }

  private belongsToGroup(product: ProductCatalogItem, group: ProductGroupConfig): boolean {
    const productFamily = this.normalize(product.family);
    return group.families.some((family) => this.normalize(family) === productFamily);
  }

  private scrollToSection(sectionId: string, attempt = 0): void {
    const target = document.getElementById(sectionId);

    if (!target) {
      if (attempt < 4) {
        window.setTimeout(() => this.scrollToSection(sectionId, attempt + 1), 60);
      }

      return;
    }

    window.history.replaceState(null, '', `${window.location.pathname}#${sectionId}`);
    const top = target.getBoundingClientRect().top + window.scrollY - 18;

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: 'smooth',
    });
  }

  private formatMoney(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      maximumFractionDigits: 2,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
