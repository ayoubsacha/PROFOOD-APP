import { Component, signal } from '@angular/core';
import { CategoryGridComponent } from '../category-grid/category-grid.component';

@Component({
  selector: 'app-hero-section',
  imports: [CategoryGridComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent {
  protected readonly categories = [
    'Tous',
    'Équipements de froid',
    'Cuisson',
    'Fours',
    'Service & présentation',
    'Livraison',
    'Acteurs professionnels',
    'Événements Profood',
    'Fruits et légumes',
    'Poissons et fruits de mer',
    'Lait et produits dérivés',
    'Viandes et volailles',
  ];

  protected readonly searchSummary = signal('');

  protected handleSearch(event: Event): void {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const query = String(formData.get('query') ?? '').trim();
    const category = String(formData.get('category') ?? 'Tous');

    this.searchSummary.set(query ? `${category} - ${query}` : category);
  }
}
