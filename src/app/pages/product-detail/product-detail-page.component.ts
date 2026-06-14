import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CartApiService } from '../../core/cart-api.service';
import { MessagingService } from '../../core/messaging.service';
import { ProductApiService } from '../../core/product-api.service';
import { PRODUCT_CATALOG, findProductBySlug } from '../../models/product-catalog.models';

@Component({
  selector: 'app-product-detail-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly productApi = inject(ProductApiService);
  private readonly cartApi = inject(CartApiService);
  private readonly messaging = inject(MessagingService);
  private readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';

  protected readonly user = computed(() => this.auth.currentUser());
  protected readonly product = signal(findProductBySlug(this.slug));
  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly quantity = signal(this.product()?.minimumQuantity ?? 1);
  protected readonly clientRating = signal<number | null>(null);
  protected readonly cartMessage = signal('');
  protected readonly contactModalOpen = signal(false);
  protected readonly contactSending = signal(false);
  protected readonly contactMessage = signal('');
  protected readonly contactError = signal('');
  protected readonly contactForm = {
    subject: '',
    body: '',
  };

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

  protected readonly canContactSupplier = computed(() => this.user()?.role === 'CLIENT_PRO');

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

  protected openContactModal(): void {
    const product = this.product();

    if (!this.user()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.canContactSupplier()) {
      this.contactError.set('Seuls les clients professionnels peuvent contacter un fournisseur.');
      return;
    }

    if (!product?.id) {
      this.contactError.set('Ce produit doit etre disponible dans le backend avant contact fournisseur.');
      return;
    }

    this.contactForm.subject = `Demande concernant ${product.name}`;
    this.contactForm.body = '';
    this.contactMessage.set('');
    this.contactError.set('');
    this.contactModalOpen.set(true);
  }

  protected closeContactModal(): void {
    if (this.contactSending()) {
      return;
    }

    this.contactModalOpen.set(false);
  }

  protected sendContactMessage(): void {
    const product = this.product();

    if (!product?.id) {
      this.contactError.set('Produit backend introuvable.');
      return;
    }

    if (!this.contactForm.subject.trim() || !this.contactForm.body.trim()) {
      this.contactError.set('Ajoutez un sujet et un message.');
      return;
    }

    this.contactSending.set(true);
    this.contactError.set('');
    this.contactMessage.set('');

    this.messaging
      .contactFournisseur(product.id, this.contactForm.subject.trim(), this.contactForm.body.trim())
      .subscribe({
        next: () => {
          this.contactSending.set(false);
          this.contactModalOpen.set(false);
          this.contactMessage.set('Message envoye au fournisseur.');
          this.contactForm.body = '';
        },
        error: () => {
          this.contactSending.set(false);
          this.contactError.set("Le message n'a pas pu etre envoye.");
        },
      });
  }

  private formatMoney(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      maximumFractionDigits: 2,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
  }
}
