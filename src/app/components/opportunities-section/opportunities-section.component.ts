import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductApiService } from '../../core/product-api.service';
import {
  CATALOGUE_CATEGORIES,
  CatalogueCategory,
  CatalogueCategorySlug,
  categorySliderId,
  normalizeCatalogueValue,
  productBelongsToCategory,
} from '../../models/catalogue-category.models';
import { PRODUCT_CATALOG, ProductCatalogItem } from '../../models/product-catalog.models';

interface SliderFilter {
  search: string;
  family: string;
}

interface CategorySlider extends CatalogueCategory {
  products: ProductCatalogItem[];
  familyOptions: string[];
}

@Component({
  selector: 'app-opportunities-section',
  imports: [FormsModule, RouterLink],
  templateUrl: './opportunities-section.component.html',
  styleUrl: './opportunities-section.component.scss',
})
export class OpportunitiesSectionComponent {
  private readonly productApi = inject(ProductApiService);

  protected readonly products = signal<ProductCatalogItem[]>(PRODUCT_CATALOG);
  protected readonly filters = signal<Record<CatalogueCategorySlug, SliderFilter>>(
    this.createInitialFilters(),
  );

  protected readonly sliderConfigs = CATALOGUE_CATEGORIES;

  protected readonly sliders = computed<CategorySlider[]>(() =>
    this.sliderConfigs.map((config) => {
      const baseProducts = this.products().filter((product) =>
        productBelongsToCategory(product, config),
      );
      const filter = this.filters()[config.slug];
      const search = normalizeCatalogueValue(filter.search);
      const selectedFamily = normalizeCatalogueValue(filter.family);

      return {
        ...config,
        familyOptions: this.familyOptions(baseProducts),
        products: baseProducts
          .filter((product) => {
            const matchesSearch =
              !search ||
              normalizeCatalogueValue(
                `${product.name} ${product.supplier.name} ${product.cardCharacteristics.join(' ')}`,
              ).includes(search);
            const matchesFamily =
              !selectedFamily || normalizeCatalogueValue(product.family) === selectedFamily;

            return matchesSearch && matchesFamily;
          })
          .slice(0, 24),
      };
    }),
  );

  constructor() {
    this.productApi
      .getProducts()
      .pipe(takeUntilDestroyed())
      .subscribe((products) => this.products.set(this.mergeCatalogProducts(products)));
  }

  protected filterFor(sliderId: CatalogueCategorySlug): SliderFilter {
    return this.filters()[sliderId];
  }

  protected updateSearch(sliderId: CatalogueCategorySlug, search: string): void {
    this.filters.update((filters) => ({
      ...filters,
      [sliderId]: {
        ...filters[sliderId],
        search,
      },
    }));
  }

  protected updateFamily(sliderId: CatalogueCategorySlug, family: string): void {
    this.filters.update((filters) => ({
      ...filters,
      [sliderId]: {
        ...filters[sliderId],
        family,
      },
    }));
  }

  protected sliderElementId(sliderId: CatalogueCategorySlug): string {
    return categorySliderId(sliderId);
  }

  protected scrollSlider(track: HTMLElement, direction: -1 | 1): void {
    track.scrollBy({
      left: direction * Math.round(track.clientWidth * 0.85),
      behavior: 'smooth',
    });
  }

  protected priceText(product: ProductCatalogItem): string {
    const price = `${this.money(product.priceMad)} MAD`;
    return this.isService(product) ? `A partir de ${price} / ${product.unit}` : `${price} / ${product.unit}`;
  }

  protected productBadge(product: ProductCatalogItem): string {
    return this.isService(product) ? 'Service' : product.family;
  }

  protected productKicker(product: ProductCatalogItem): string {
    return product.cardCharacteristics[1] || product.cardCharacteristics[0] || product.family;
  }

  private createInitialFilters(): Record<CatalogueCategorySlug, SliderFilter> {
    return CATALOGUE_CATEGORIES.reduce(
      (filters, category) => ({
        ...filters,
        [category.slug]: { search: '', family: '' },
      }),
      {} as Record<CatalogueCategorySlug, SliderFilter>,
    );
  }

  private isService(product: ProductCatalogItem): boolean {
    const family = normalizeCatalogueValue(product.family);
    return family === 'maintenance' || family === 'installation';
  }

  private familyOptions(products: ProductCatalogItem[]): string[] {
    return [...new Set(products.map((product) => product.family))].sort((first, second) =>
      first.localeCompare(second, 'fr'),
    );
  }

  private mergeCatalogProducts(products: ProductCatalogItem[]): ProductCatalogItem[] {
    const productsBySlug = new Map<string, ProductCatalogItem>();

    PRODUCT_CATALOG.forEach((product) => productsBySlug.set(product.slug, product));
    products.forEach((product) => productsBySlug.set(product.slug, product));

    return [...productsBySlug.values()];
  }

  private money(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      maximumFractionDigits: 2,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
  }
}
