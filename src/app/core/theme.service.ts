import { Injectable, signal } from '@angular/core';

type ThemeName = 'dark' | 'light';

const THEME_STORAGE_KEY = 'place-to-invest-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly darkMode = signal(true);

  init(): void {
    const storedTheme = this.readStoredTheme();
    this.applyTheme(storedTheme === 'light' ? 'light' : 'dark', false);
  }

  toggle(): void {
    this.applyTheme(this.darkMode() ? 'light' : 'dark');
  }

  private applyTheme(theme: ThemeName, persist = true): void {
    const isDark = theme === 'dark';
    this.darkMode.set(isDark);

    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark-mode', isDark);
      document.body.classList.toggle('light-mode', !isDark);
      document.documentElement.dataset['theme'] = theme;
    }

    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }

  private readStoredTheme(): ThemeName | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null;
  }
}
