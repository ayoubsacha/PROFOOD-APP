import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductApiService } from '../../core/product-api.service';
import {
  EQUIPMENT_MENU_FAMILY_NAMES,
  PRODUCT_CATALOG,
  ProductCatalogItem,
} from '../../models/product-catalog.models';

type ProductGroupId =
  | 'fruits-legumes'
  | 'poissons'
  | 'lait'
  | 'viandes'
  | 'fruits-secs'
  | 'equipements'
  | 'maintenance'
  | 'installation'
  | 'autres';

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
  protected readonly selectedFamily = signal<string | null>(null);
  protected readonly focusedBrandSearch = signal('');
  protected readonly focusedCharacteristic = signal('');
  protected readonly focusedSort = signal('');
  protected readonly searchTerms = signal<Record<ProductGroupId, string>>({
    'fruits-legumes': '',
    poissons: '',
    lait: '',
    viandes: '',
    'fruits-secs': '',
    equipements: '',
    maintenance: '',
    installation: '',
    autres: '',
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
      families: ['Equipements professionnels', ...EQUIPMENT_MENU_FAMILY_NAMES],
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      description: 'Interventions, diagnostic, reparation et contrats de maintenance cuisine.',
      image: '/assets/group-maintenance-service.png',
      families: ['Maintenance'],
    },
    {
      id: 'installation',
      label: 'Installation',
      description: 'Pose, raccordement, mise en service et installation sur site pour cuisines CHR.',
      image: '/assets/group-installation-service.png',
      families: ['Installation'],
    },
  ];

  protected readonly pageTitle = computed(() => this.selectedFamily() ?? 'Catalogue PROFOOD');

  protected readonly pageDescription = computed(() => {
    const family = this.selectedFamily();

    return family
      ? `Tous les produits disponibles dans la catégorie ${family}.`
      : 'Produits alimentaires, équipements professionnels et services de maintenance pour les clients B2B.';
  });

  protected readonly groups = computed<ProductGroupView[]>(() => {
    const selectedFamily = this.selectedFamily();

    if (selectedFamily) {
      const focusedGroup = this.focusedGroupForQuery(selectedFamily);

      if (!focusedGroup) {
        return [];
      }

      const query = this.normalize(selectedFamily);
      const isGroupLabel = this.normalize(focusedGroup.label) === query;
      const baseProducts = this.productsForSelectedFamily();
      const search = this.normalize(this.searchTerms()[focusedGroup.id]);
      const brandSearch = this.normalize(this.focusedBrandSearch());
      const characteristic = this.normalize(this.focusedCharacteristic());
      const sortedProducts = baseProducts
        .filter((product) => {
          const matchesName = !search || this.normalize(product.name).includes(search);
          const matchesBrand =
            !brandSearch || this.normalize(product.supplier.name).includes(brandSearch);
          const matchesCharacteristic =
            !characteristic ||
            product.cardCharacteristics.some((tag) => this.normalize(tag) === characteristic) ||
            product.characteristics.some((tag) => this.normalize(tag) === characteristic);

          return matchesName && matchesBrand && matchesCharacteristic;
        })
        .sort((first, second) => this.compareFocusedProducts(first, second));

      return [{
        ...focusedGroup,
        label: isGroupLabel ? focusedGroup.label : selectedFamily,
        description: isGroupLabel
          ? focusedGroup.description
          : `Produits associés à la catégorie ${selectedFamily}.`,
        totalProducts: baseProducts.length,
        products: sortedProducts,
      }];
    }

    return this.groupConfigs.map((group) => {
      const baseProducts = this.productSource().filter((product) => this.belongsToGroup(product, group));
      const search = this.normalize(this.searchTerms()[group.id]);

      return {
        ...group,
        totalProducts: baseProducts.length,
        products: baseProducts.filter((product) => {
          return !search || this.normalize(product.name).includes(search);
        }),
      };
    });
  });

  protected readonly focusedGroup = computed(() => (this.selectedFamily() ? this.groups()[0] : null));

  protected readonly focusedCharacteristicOptions = computed(() => {
    const values = this.productsForSelectedFamily().flatMap((product) => product.cardCharacteristics);
    return [...new Set(values)].sort((first, second) => first.localeCompare(second, 'fr'));
  });

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
      const selectedFamily = family?.trim() || null;

      this.selectedFamily.set(selectedFamily);
      this.focusedBrandSearch.set('');
      this.focusedCharacteristic.set('');
      this.focusedSort.set('');

      if (!selectedFamily && family) {
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

  protected updateFocusedBrandSearch(event: Event): void {
    this.focusedBrandSearch.set((event.target as HTMLInputElement).value);
  }

  protected updateFocusedCharacteristic(event: Event): void {
    this.focusedCharacteristic.set((event.target as HTMLSelectElement).value);
  }

  protected updateFocusedSort(event: Event): void {
    this.focusedSort.set((event.target as HTMLSelectElement).value);
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

  protected ratingText(product: ProductCatalogItem): string {
    return `${product.rating.toFixed(1)}/5 - ${product.ratingCount} avis`;
  }

  protected isService(product: ProductCatalogItem): boolean {
    const family = this.normalize(product.family);
    return family === this.normalize('Maintenance') || family === this.normalize('Installation');
  }

  private queueScrollToQuery(value: string): void {
    const groupId = this.groupIdForQuery(value);

    if (!groupId) {
      return;
    }

    window.setTimeout(() => this.scrollToSection(this.sectionId(groupId)), 80);
  }

  private groupIdForQuery(value: string): ProductGroupId | null {
    return this.focusedGroupForQuery(value)?.id ?? null;
  }

  private groupForQuery(value: string): ProductGroupConfig | null {
    const query = this.normalize(value);
    const group = this.groupConfigs.find((item) => {
      return (
        this.normalize(item.label) === query ||
        item.families.some((family) => this.normalize(family) === query)
      );
    });

    return group ?? null;
  }

  private focusedGroupForQuery(value: string): ProductGroupConfig | null {
    const configuredGroup = this.groupForQuery(value);

    if (configuredGroup) {
      return configuredGroup;
    }

    const matchingProduct = this.productSource().find(
      (product) => this.normalize(product.family) === this.normalize(value),
    );

    return matchingProduct
      ? {
          id: 'autres',
          label: value,
          description: `Catalogue complet pour ${value}.`,
          image: matchingProduct.imageUrl,
          families: [matchingProduct.family],
        }
      : null;
  }

  private belongsToGroup(product: ProductCatalogItem, group: ProductGroupConfig): boolean {
    const productFamily = this.normalize(product.family);
    return group.families.some((family) => this.normalize(family) === productFamily);
  }

  private productsForSelectedFamily(): ProductCatalogItem[] {
    const selectedFamily = this.selectedFamily();
    const focusedGroup = selectedFamily ? this.focusedGroupForQuery(selectedFamily) : null;

    if (!selectedFamily || !focusedGroup) {
      return [];
    }

    const query = this.normalize(selectedFamily);
    const isGroupLabel = this.normalize(focusedGroup.label) === query;

    return this.productSource().filter((product) => {
      return isGroupLabel
        ? this.belongsToGroup(product, focusedGroup)
        : this.normalize(product.family) === query;
    });
  }

  private productSource(): ProductCatalogItem[] {
    const productsBySlug = new Map<string, ProductCatalogItem>();

    PRODUCT_CATALOG.forEach((product) => productsBySlug.set(product.slug, product));
    this.allProducts().forEach((product) => productsBySlug.set(product.slug, product));

    return [...productsBySlug.values()];
  }

  private compareFocusedProducts(first: ProductCatalogItem, second: ProductCatalogItem): number {
    switch (this.focusedSort()) {
      case 'price-asc':
        return first.priceMad - second.priceMad;
      case 'price-desc':
        return second.priceMad - first.priceMad;
      case 'rating-desc':
        return second.rating - first.rating;
      case 'name-asc':
        return first.name.localeCompare(second.name, 'fr');
      default:
        return 0;
    }
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
