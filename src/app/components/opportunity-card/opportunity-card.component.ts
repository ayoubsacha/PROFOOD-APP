import { Component, Input } from '@angular/core';
import { Opportunity } from '../../models/marketplace.models';

@Component({
  selector: 'app-opportunity-card',
  templateUrl: './opportunity-card.component.html',
  styleUrl: './opportunity-card.component.scss',
})
export class OpportunityCardComponent {
  @Input({ required: true }) opportunity!: Opportunity;
}
