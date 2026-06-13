import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartApiService } from '../../core/cart-api.service';
import { ProductApiService } from '../../core/product-api.service';
import { PRODUCT_CATALOG, findProductBySlug } from '../../models/product-catalog.models';

@Component({
  selector: 'app-product-detail-page',
  imports: [RouterLink],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productApi = inject(ProductApiService);
  private readonly cartApi = inject(CartApiService);
  private readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';

  protected readonly product = signal(findProductBySlug(this.slug));
  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly quantity = signal(this.product()?.minimumQuantity ?? 1);
  protected readonly clientRating = signal<number | null>(null);
  protected readonly cartMessage = signal('');

  constructor() {
    this.productApi
      .getProduct(this.slug)
      .pipe(takeUntilDestroyed())
      .subscribe((product) => {
        if (!product) {
          return;
        }

        this.product.set(product);
        this.quantity.set(product.minimumQuantity);
      });
  }

  protected readonly displayedRating = computed(() => {
    const product = this.product();

    if (!product) {
      return 0;
    }

    const clientRating = this.clientRating();

    if (!clientRating) {
      return product.rating;
    }

    return (product.rating * product.ratingCount + clientRating) / (product.ratingCount + 1);
  });

  protected readonly displayedRatingCount = computed(() => {
    const product = this.product();

    if (!product) {
      return 0;
    }

    return product.ratingCount + (this.clientRating() ? 1 : 0);
  });

  protected readonly roundedRating = computed(() => Math.round(this.displayedRating()));

  protected readonly relatedProduct = computed(() => {
    const product = this.product();

    if (!product) {
      return PRODUCT_CATALOG[0];
    }

    return (
      PRODUCT_CATALOG.find((item) => item.family === product.family && item.slug !== product.slug) ??
      PRODUCT_CATALOG.find((item) => item.slug !== product.slug)
    );
  });

  protected readonly totalPriceText = computed(() => {
    const product = this.product();

    if (!product) {
      return '0 MAD';
    }

    return `${this.formatMoney(product.priceMad * this.quantity())} MAD`;
  });

  protected unitPriceText(): string {
    const product = this.product();

    if (!product) {
      return '0 MAD';
    }

    return `${this.formatMoney(product.priceMad)} MAD / ${product.unit}`;
  }

  protected displayedRatingText(): string {
    return this.displayedRating().toFixed(1);
  }

  protected deliveryText(): string {
    const product = this.product();

    if (!product) {
      return '';
    }

    return product.supplier.location
      ? `Livraison fournisseur depuis ${product.supplier.location}`
      : 'Livraison fournisseur coordonnee apres validation';
  }

  protected updateQuantity(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.quantity.set(Number(input.value));
  }

  protected rateProduct(rating: number): void {
    this.clientRating.set(rating);
  }

  protected addToCart(): void {
    const product = this.product();

    if (!product?.id) {
      this.cartMessage.set('Ce produit doit etre cree dans le backend avant ajout au panier.');
      return;
    }

    this.cartApi.addItem(product.id, this.quantity()).subscribe({
      next: () => this.cartMessage.set('Produit ajoute au panier.'),
      error: () => this.cartMessage.set("L'ajout au panier a echoue."),
    });
  }

  private formatMoney(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      maximumFractionDigits: 2,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
  }
}
