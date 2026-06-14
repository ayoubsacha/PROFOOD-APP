import { Component } from '@angular/core';
import {
  CATALOGUE_CATEGORIES,
  CatalogueCategory,
  categorySliderId,
} from '../../models/catalogue-category.models';

@Component({
  selector: 'app-category-grid',
  templateUrl: './category-grid.component.html',
  styleUrl: './category-grid.component.scss',
})
export class CategoryGridComponent {
  protected readonly categories = CATALOGUE_CATEGORIES;

  protected scrollToCategory(category: CatalogueCategory): void {
    document.getElementById(categorySliderId(category.slug))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
