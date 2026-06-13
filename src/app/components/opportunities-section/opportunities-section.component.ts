import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductApiService } from '../../core/product-api.service';
import { PRODUCT_CATALOG, ProductCatalogItem } from '../../models/product-catalog.models';

type FoodSliderId = 'fruits-legumes' | 'poissons' | 'lait' | 'viandes';

interface FoodSliderConfig {
  id: FoodSliderId;
  title: string;
  subtitle: string;
  families: string[];
}

interface SliderFilter {
  search: string;
  family: string;
}

interface FoodSlider extends FoodSliderConfig {
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
  protected readonly filters = signal<Record<FoodSliderId, SliderFilter>>({
    'fruits-legumes': { search: '', family: '' },
    poissons: { search: '', family: '' },
    lait: { search: '', family: '' },
    viandes: { search: '', family: '' },
  });

  protected readonly sliderConfigs: FoodSliderConfig[] = [
    {
      id: 'fruits-legumes',
      title: 'Fruits et légumes',
      subtitle: 'Primeur, herbes, légumes, fruits frais et produits de saison.',
      families: [
        'Agrumes',
        'Champignons',
        'Fruits à noyau',
        'Fruits à pépins',
        'Fruits méditerranéens',
        'Fruits rouges',
        'Fruits secs & noix',
        'Fruits tropicaux',
        'Herbes aromatiques',
        'Légumes bulbes',
        'Légumes racines & tubercules',
        'Légumineuses fraîches',
        'Melons & pastèques',
        'Raisins',
      ],
    },
    {
      id: 'poissons',
      title: 'Poissons et fruits de mer',
      subtitle: 'Poissons frais, crustacés, coquillages et découpes sous chaîne froide.',
      families: [
        'Céphalopodes',
        'Coquillages',
        'Crustacés',
        'Filets & découpes',
        'Poissons frais',
        'Poissons nobles',
        'Produits surgelés',
      ],
    },
    {
      id: 'lait',
      title: 'Lait et produits dérivés',
      subtitle: 'Lait, crème, beurre, fromages, desserts lactés et glacerie.',
      families: [
        'Beurres & matières grasses',
        'Crèmes',
        'Desserts lactés',
        'Fromages frais',
        'Glacerie',
        'Lait',
        'Matières grasses laitières',
        'Yaourts & fermentés',
      ],
    },
    {
      id: 'viandes',
      title: 'Viandes et volailles',
      subtitle: 'Bovine, ovine, caprine, volaille, découpes et produits préparés.',
      families: [
        'Abats',
        'Charcuterie halal',
        'Produits préparés',
        'Surgelés viande',
        'Viande bovine',
        'Viande caprine',
        'Viande de veau',
        'Viande ovine',
        'Volaille',
      ],
    },
  ];

  protected readonly sliders = computed<FoodSlider[]>(() =>
    this.sliderConfigs.map((config) => {
      const baseProducts = this.products().filter((product) => this.belongsToSlider(product, config));
      const filter = this.filters()[config.id];
      const search = this.normalize(filter.search);
      const selectedFamily = this.normalize(filter.family);

      return {
        ...config,
        familyOptions: this.familyOptions(baseProducts),
        products: baseProducts
          .filter((product) => {
            const matchesSearch =
              !search ||
              this.normalize(
                `${product.name} ${product.supplier.name} ${product.cardCharacteristics.join(' ')}`,
              ).includes(search);
            const matchesFamily =
              !selectedFamily || this.normalize(product.family) === selectedFamily;

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
      .subscribe((products) => this.products.set(products));
  }

  protected filterFor(sliderId: FoodSliderId): SliderFilter {
    return this.filters()[sliderId];
  }

  protected updateSearch(sliderId: FoodSliderId, search: string): void {
    this.filters.update((filters) => ({
      ...filters,
      [sliderId]: {
        ...filters[sliderId],
        search,
      },
    }));
  }

  protected updateFamily(sliderId: FoodSliderId, family: string): void {
    this.filters.update((filters) => ({
      ...filters,
      [sliderId]: {
        ...filters[sliderId],
        family,
      },
    }));
  }

  protected scrollSlider(track: HTMLElement, direction: -1 | 1): void {
    track.scrollBy({
      left: direction * Math.round(track.clientWidth * 0.85),
      behavior: 'smooth',
    });
  }

  protected priceText(product: ProductCatalogItem): string {
    return `${this.money(product.priceMad)} MAD / ${product.unit}`;
  }

  private belongsToSlider(product: ProductCatalogItem, slider: FoodSliderConfig): boolean {
    const productFamily = this.normalize(product.family);
    return slider.families.some((family) => this.normalize(family) === productFamily);
  }

  private familyOptions(products: ProductCatalogItem[]): string[] {
    return [...new Set(products.map((product) => product.family))].sort((first, second) =>
      first.localeCompare(second, 'fr'),
    );
  }

  private money(value: number): string {
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
