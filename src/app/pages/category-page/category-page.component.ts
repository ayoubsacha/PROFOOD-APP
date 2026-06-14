import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductApiService } from '../../core/product-api.service';
import {
  catalogueCategoryBySlug,
  normalizeCatalogueValue,
  productBelongsToCategory,
} from '../../models/catalogue-category.models';
import { PRODUCT_CATALOG, ProductCatalogItem } from '../../models/product-catalog.models';

@Component({
  selector: 'app-category-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
})
export class CategoryPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productApi = inject(ProductApiService);

  protected readonly allProducts = signal<ProductCatalogItem[]>(PRODUCT_CATALOG);
  protected readonly isLoading = signal(true);
  protected readonly search = signal('');
  protected readonly slug = signal('');

  protected readonly category = computed(() => catalogueCategoryBySlug(this.slug()));

  protected readonly categoryProducts = computed(() => {
    const category = this.category();

    if (!category) {
      return [];
    }

    const search = normalizeCatalogueValue(this.search());

    return this.productSource()
      .filter((product) => productBelongsToCategory(product, category))
      .filter((product) => !search || normalizeCatalogueValue(product.name).includes(search));
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.slug.set(params.get('categorySlug') || '');
      this.search.set('');
    });

    this.productApi
      .getProducts()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (products) => {
          this.allProducts.set(products);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }

  protected updateSearch(value: string): void {
    this.search.set(value);
  }

  protected priceText(product: ProductCatalogItem): string {
    const price = `${this.money(product.priceMad)} MAD`;
    return this.isService(product) ? `A partir de ${price} / ${product.unit}` : `${price} / ${product.unit}`;
  }

  protected statusLabel(product: ProductCatalogItem): string {
    if (this.isService(product)) {
      return 'Service disponible';
    }

    return product.cardCharacteristics[1] || product.cardCharacteristics[0] || 'Disponible';
  }

  protected actionLabel(product: ProductCatalogItem): string {
    return this.isService(product) ? 'Demander un devis' : 'Voir le produit';
  }

  protected productTags(product: ProductCatalogItem): string[] {
    return product.cardCharacteristics.slice(0, 3);
  }

  protected isService(product: ProductCatalogItem): boolean {
    const family = normalizeCatalogueValue(product.family);
    return family === 'maintenance' || family === 'installation';
  }

  private productSource(): ProductCatalogItem[] {
    const productsBySlug = new Map<string, ProductCatalogItem>();

    PRODUCT_CATALOG.forEach((product) => productsBySlug.set(product.slug, product));
    this.allProducts().forEach((product) => productsBySlug.set(product.slug, product));

    return [...productsBySlug.values()];
  }

  private money(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      maximumFractionDigits: 2,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
  }
}
