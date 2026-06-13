import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductApiService } from '../../core/product-api.service';
import { PRODUCT_CATALOG, ProductCatalogItem } from '../../models/product-catalog.models';

type ProductSort = 'default' | 'price-asc' | 'price-desc' | 'characteristic-asc' | 'characteristic-desc';

@Component({
  selector: 'app-products-page',
  imports: [RouterLink],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
})
export class ProductsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productApi = inject(ProductApiService);

  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly selectedFamily = signal(this.route.snapshot.queryParamMap.get('family') ?? '');
  protected readonly allProducts = signal<ProductCatalogItem[]>(PRODUCT_CATALOG);
  protected readonly nameSearch = signal('');
  protected readonly brandSearch = signal('');
  protected readonly categoryFilter = signal('');
  protected readonly characteristicFilter = signal('');
  protected readonly sortOrder = signal<ProductSort>('default');

  protected readonly pageProducts = computed(() => {
    return this.selectedFamily()
      ? this.allProducts().filter((product) => product.family === this.selectedFamily())
      : this.allProducts();
  });

  protected readonly categoryOptions = computed(() => {
    return [...this.pageProducts()].sort((first, second) =>
      first.name.localeCompare(second.name, 'fr'),
    );
  });

  protected readonly selectedCategoryName = computed(() => {
    return (
      this.categoryOptions().find((product) => product.slug === this.categoryFilter())?.name ?? ''
    );
  });

  protected readonly characteristicOptions = computed(() => {
    const products = this.categoryFilter()
      ? this.pageProducts().filter((product) => product.slug === this.categoryFilter())
      : this.pageProducts();
    const characteristics = products.flatMap((product) => [
      ...product.cardCharacteristics,
      ...product.characteristics,
    ]);

    return [...new Set(characteristics)].sort((first, second) => first.localeCompare(second, 'fr'));
  });

  protected readonly products = computed(() => {
    const nameSearch = this.normalize(this.nameSearch());
    const brandSearch = this.normalize(this.brandSearch());
    const category = this.categoryFilter();
    const characteristic = this.characteristicFilter();

    const products = this.pageProducts().filter((product) => {
      const matchesName = !nameSearch || this.normalize(product.name).includes(nameSearch);
      const matchesBrand =
        !brandSearch ||
        this.normalize(product.supplier.name).includes(brandSearch) ||
        this.normalize(product.supplier.location).includes(brandSearch);
      const matchesCategory = !category || product.slug === category;
      const matchesCharacteristic =
        !characteristic ||
        [...product.cardCharacteristics, ...product.characteristics].some(
          (item) => item === characteristic,
        );

      return matchesName && matchesBrand && matchesCategory && matchesCharacteristic;
    });

    return this.sortProducts(products);
  });

  protected readonly hasActiveFilters = computed(() => {
    return (
      Boolean(this.nameSearch()) ||
      Boolean(this.brandSearch()) ||
      Boolean(this.categoryFilter()) ||
      Boolean(this.characteristicFilter()) ||
      this.sortOrder() !== 'default'
    );
  });

  constructor() {
    this.productApi
      .getProducts()
      .pipe(takeUntilDestroyed())
      .subscribe((products) => this.allProducts.set(products));

    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const family = params.get('family') ?? '';

      this.selectedFamily.set(family);
      this.categoryFilter.set('');
      this.characteristicFilter.set('');
    });
  }

  protected priceText(product: ProductCatalogItem): string {
    return `${this.formatMoney(product.priceMad)} MAD / ${product.unit}`;
  }

  protected roundedRating(product: ProductCatalogItem): number {
    return Math.round(product.rating);
  }

  protected updateNameSearch(event: Event): void {
    this.nameSearch.set(this.readFormValue(event));
  }

  protected updateBrandSearch(event: Event): void {
    this.brandSearch.set(this.readFormValue(event));
  }

  protected updateCategoryFilter(event: Event): void {
    this.categoryFilter.set(this.readFormValue(event));
    this.characteristicFilter.set('');
  }

  protected updateCharacteristicFilter(event: Event): void {
    this.characteristicFilter.set(this.readFormValue(event));
  }

  protected updateSortOrder(event: Event): void {
    this.sortOrder.set(this.readFormValue(event) as ProductSort);
  }

  protected resetFilters(): void {
    this.nameSearch.set('');
    this.brandSearch.set('');
    this.categoryFilter.set('');
    this.characteristicFilter.set('');
    this.sortOrder.set('default');
  }

  private formatMoney(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      maximumFractionDigits: 2,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
  }

  private sortProducts(products: ProductCatalogItem[]): ProductCatalogItem[] {
    return [...products].sort((first, second) => {
      switch (this.sortOrder()) {
        case 'price-asc':
          return first.priceMad - second.priceMad;
        case 'price-desc':
          return second.priceMad - first.priceMad;
        case 'characteristic-asc':
          return this.primaryCharacteristic(first).localeCompare(
            this.primaryCharacteristic(second),
            'fr',
          );
        case 'characteristic-desc':
          return this.primaryCharacteristic(second).localeCompare(
            this.primaryCharacteristic(first),
            'fr',
          );
        default:
          return this.allProducts().indexOf(first) - this.allProducts().indexOf(second);
      }
    });
  }

  private primaryCharacteristic(product: ProductCatalogItem): string {
    return product.cardCharacteristics[0] ?? product.characteristics[0] ?? '';
  }

  private readFormValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value.trim();
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
