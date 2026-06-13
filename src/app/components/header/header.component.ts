import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private readonly auth = inject(AuthService);

  protected readonly currentUser = computed(() => this.auth.currentUser());
  protected readonly darkMode = signal(false);

  ngOnInit(): void {
    const storedTheme = this.readStoredTheme();
    const prefersDark =
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.applyTheme(storedTheme ? storedTheme === 'dark' : prefersDark, false);
  }

  protected toggleTheme(): void {
    this.applyTheme(!this.darkMode());
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
