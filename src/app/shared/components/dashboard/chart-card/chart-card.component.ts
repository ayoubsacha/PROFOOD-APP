import { Component, Input } from '@angular/core';
import { ChartDataPoint } from '../../../../core/dashboard.models';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrl: './chart-card.component.scss',
})
export class ChartCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() points: ChartDataPoint[] = [];
  @Input() valueSuffix = '';
  @Input() emptyText = 'Aucune donnee disponible.';

  protected normalizedPoints(): ChartDataPoint[] {
    const max = Math.max(...this.points.map((point) => point.value), 1);
    return this.points.map((point) => ({
      ...point,
      percent: point.percent ?? Math.max(4, Math.round((point.value / max) * 100)),
    }));
  }
}
