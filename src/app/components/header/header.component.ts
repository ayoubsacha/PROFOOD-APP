import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { MegaMenuGroup, NavItem } from '../../models/marketplace.models';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private readonly auth = inject(AuthService);

  protected readonly navItems: NavItem[] = [
    { label: 'Accueil', href: '#top' },
    { label: 'Produits', href: '#opportunities' },
    { label: 'Events', href: '#categories' },
    { label: 'Mariages', href: '#categories' },
    { label: 'Offres promotionnelles', href: '#categories' },
    { label: 'Acteurs professionnels', href: '#categories' },
    { label: 'Biens', href: '#opportunities' },
    { label: 'Produits et services', href: '#categories', megaKey: 'products' },
    { label: 'Investissements collectifs', href: '#opportunities' },
    { label: 'E-guichet', href: '#categories' },
    { label: 'Communauté', href: '#categories', megaKey: 'community' },
    { label: 'Annuaires', href: '#categories' },
  ];

  protected readonly megaMenus: Record<string, MegaMenuGroup[]> = {
    products: [
      {
        title: 'Produits',
        links: [
          'Produits alimentaires',
          'Équipements',
          'Produits tendance',
          'Catalogue marketplace',
        ],
      },
      {
        title: 'Services',
        links: [
          'Services professionnels',
          'Conseil et stratégie',
          'Offres promotionnelles',
          'Accompagnement',
          'Maintenance',
        ],
      },
      {
        title: 'Marchés',
        links: [
          'Startup & Affaires',
          'Livraison',
          'Investissements collectifs',
          'Biens disponibles',
        ],
      },
    ],
    community: [
      {
        title: 'Réseau',
        links: ['Forum', 'Annuaire', 'Acteurs professionnels', 'Porteurs de projets'],
      },
      {
        title: 'Contenus',
        links: ['Articles', 'Événements', 'Guides pratiques', 'Actualités'],
      },
    ],
  };

  protected readonly darkMode = signal(false);
  protected readonly mobileMenuOpen = signal(false);
  protected readonly activeMegaKey = signal<string | null>(null);
  protected readonly currentUser = computed(() => this.auth.currentUser());

  protected readonly activeMegaGroups = computed(() => {
    const key = this.activeMegaKey();
    return key ? this.megaMenus[key] : null;
  });

  protected readonly activeMegaLabel = computed(() => {
    const key = this.activeMegaKey();
    return this.navItems.find((item) => item.megaKey === key)?.label ?? '';
  });

  ngOnInit(): void {
    const storedTheme = this.readStoredTheme();
    const prefersDark =
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.applyTheme(storedTheme ? storedTheme === 'dark' : prefersDark, false);
  }

  protected toggleTheme(): void {
    this.applyTheme(!this.darkMode());
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((isOpen) => !isOpen);
    this.activeMegaKey.set(null);
  }

  protected openMega(item: NavItem): void {
    if (item.megaKey) {
      this.activeMegaKey.set(item.megaKey);
    }
  }

  protected clearMega(): void {
    this.activeMegaKey.set(null);
  }

  protected handleNavClick(event: MouseEvent, item: NavItem): void {
    if (!item.megaKey) {
      this.mobileMenuOpen.set(false);
      return;
    }

    event.preventDefault();
    this.activeMegaKey.update((current) =>
      current === item.megaKey ? null : (item.megaKey ?? null),
    );
  }

  protected logout(): void {
    this.auth.logout();
  }

  private applyTheme(isDark: boolean, persist = true): void {
    this.darkMode.set(isDark);

    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark-mode', isDark);
      document.documentElement.dataset['theme'] = isDark ? 'dark' : 'light';
    }

    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem('place-to-invest-theme', isDark ? 'dark' : 'light');
    }
  }

  private readStoredTheme(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem('place-to-invest-theme');
  }
}
