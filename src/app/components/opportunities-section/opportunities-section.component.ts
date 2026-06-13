import { Component } from '@angular/core';

interface ListingCard {
  badge: string;
  title: string;
  subtitle: string;
  price: string;
  priceNote?: string;
  author: string;
  visual: 'nike' | 'announcement' | 'apartment';
  meta?: string[];
}

@Component({
  selector: 'app-opportunities-section',
  templateUrl: './opportunities-section.component.html',
  styleUrl: './opportunities-section.component.scss',
})
export class OpportunitiesSectionComponent {
  protected readonly taxonomies = [
    "Taxonomie d'annonce",
    'Industriel',
    'Appartement',
    'Livraison',
    'Maintenance',
    'Startup & Affaires',
  ];

  protected readonly listings: ListingCard[] = [
    {
      badge: 'Industriel',
      title: 'ANNONCE PUBLIQUE',
      subtitle: '',
      price: 'Prix Non Spécifié',
      author: 'panier meida',
      visual: 'nike',
    },
    {
      badge: 'Industriel',
      title: 'Test non immobilier',
      subtitle: '',
      price: 'Prix Non Spécifié',
      priceNote: '(Négociable)',
      author: 'panier meida',
      visual: 'announcement',
    },
    {
      badge: 'Appartement',
      title: 'Appartement à vendre à Tanjah',
      subtitle: '',
      price: '1,196,410 MAD',
      priceNote: '(Négociable)',
      author: 'panier meida',
      visual: 'apartment',
      meta: ['8000 Taille', '5 Bathroom'],
    },
  ];
}
