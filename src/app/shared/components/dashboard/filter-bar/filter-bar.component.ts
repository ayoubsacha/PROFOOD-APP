import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterState } from '../../../../core/dashboard.models';

@Component({
  selector: 'app-filter-bar',
  imports: [FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class FilterBarComponent {
  @Input() searchPlaceholder = 'Rechercher';
  @Input() statusOptions: string[] = [];
  @Input() showDate = false;
  @Output() filtersChange = new EventEmitter<FilterState>();

  protected filters: FilterState = {
    search: '',
    status: '',
    date: '',
  };

  protected emitFilters(): void {
    this.filtersChange.emit({ ...this.filters });
  }
}
