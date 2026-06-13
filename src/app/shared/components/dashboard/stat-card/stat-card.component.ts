import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = 0;
  @Input() helper = '';
  @Input() icon = '';
  @Input() tone: 'dark' | 'gold' | 'blue' | 'amber' | 'red' | 'gray' = 'gray';
}
