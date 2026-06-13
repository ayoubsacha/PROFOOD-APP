import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-role-dashboard-page',
  imports: [RouterLink],
  templateUrl: './role-dashboard-page.component.html',
  styleUrl: './role-dashboard-page.component.scss',
})
export class RoleDashboardPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);

  protected readonly user = computed(() => this.auth.currentUser());
  protected readonly dashboardType = computed(() => this.route.snapshot.data['dashboard']);

  protected readonly title = computed(() =>
    this.dashboardType() === 'admin' ? 'Espace admin' : 'Espace fournisseur',
  );

  protected readonly subtitle = computed(() =>
    this.dashboardType() === 'admin'
      ? 'Gestion des demandes, comptes, produits, commandes et statistiques.'
      : 'Gestion du compte, catalogue, stock, commandes et messages clients.',
  );

  protected logout(): void {
    this.auth.logout();
  }
}
