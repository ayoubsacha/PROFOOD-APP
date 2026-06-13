import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BottomShowcasesComponent } from '../../components/bottom-showcases/bottom-showcases.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { MarketplaceMenuComponent } from '../../components/marketplace-menu/marketplace-menu.component';
import { OpportunitiesSectionComponent } from '../../components/opportunities-section/opportunities-section.component';
import { AuthService } from '../../core/auth.service';
import { CartApiService } from '../../core/cart-api.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    HeroSectionComponent,
    MarketplaceMenuComponent,
    OpportunitiesSectionComponent,
    BottomShowcasesComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly cartApi = inject(CartApiService);

  protected readonly user = computed(() => this.auth.currentUser());
  protected readonly cartCount = signal(0);

  ngOnInit(): void {
    this.cartApi.getCart().subscribe({
      next: (cart) =>
        this.cartCount.set(cart.items.reduce((sum, item) => sum + item.quantity, 0)),
      error: () => this.cartCount.set(0),
    });
  }

  protected logout(): void {
    this.auth.logout();
  }
}
