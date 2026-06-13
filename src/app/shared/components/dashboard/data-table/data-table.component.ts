import { Component, Input } from '@angular/core';
import { DashboardTableColumn } from '../../../../core/dashboard.models';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-data-table',
  imports: [StatusBadgeComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() columns: DashboardTableColumn[] = [];
  @Input() rows: Record<string, unknown>[] = [];
  @Input() emptyText = 'Aucune donnee.';
  @Input() limit = 8;

  protected visibleRows(): Record<string, unknown>[] {
    return this.rows.slice(0, this.limit);
  }

  protected cell(row: Record<string, unknown>, column: DashboardTableColumn): string {
    const value = row[column.key];

    if (value === null || value === undefined || value === '') {
      return '-';
    }

    if (column.kind === 'date') {
      return new Intl.DateTimeFormat('fr-MA', { dateStyle: 'medium' }).format(new Date(String(value)));
    }

    if (column.kind === 'money') {
      return `${new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 2 }).format(Number(value))} MAD`;
    }

    return String(value);
  }
}
