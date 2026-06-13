import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  @Input() title = 'Aucune donnee';
  @Input() message = 'Les informations apparaitront ici.';
  @Input() actionLabel = '';
}
