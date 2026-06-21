import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly theme = inject(ThemeService);

  protected readonly currentUser = computed(() => this.auth.currentUser());
  protected readonly darkMode = this.theme.darkMode;
  protected readonly themeToggleLabel = computed(() =>
    this.darkMode() ? 'Activer le mode clair' : 'Activer le mode sombre',
  );

  protected toggleTheme(): void {
    this.theme.toggle();
  }

  protected logout(): void {
    this.auth.logout();
  }
}
