import { Component } from '@angular/core';
import { CategoryCard } from '../../models/marketplace.models';

@Component({
  selector: 'app-category-grid',
  templateUrl: './category-grid.component.html',
  styleUrl: './category-grid.component.scss',
})
export class CategoryGridComponent {
  protected readonly categories: CategoryCard[] = [
    {
      icon: '✣',
      title: 'Équipements de froid',
      description: 'Armoires froides, vitrines et solutions de conservation.',
      count: 'Équipements',
      tone: 'cold',
    },
    {
      icon: '♨',
      title: 'Équipements de cuisson',
      description: 'Fours, plaques, lignes de cuisson et cuisines professionnelles.',
      count: 'Équipements',
      tone: 'cooking',
    },
    {
      icon: '▤',
      title: 'Livraison',
      description: 'Transport, logistique froide et distribution alimentaire.',
      count: 'Service',
      tone: 'delivery',
    },
    {
      icon: '♙',
      title: 'Acteurs professionnels',
      description: 'Chefs, fournisseurs, conseillers et partenaires Profood.',
      count: 'Réseau',
      tone: 'professionals',
    },
    {
      icon: '▦',
      title: 'Événements Profood',
      description: 'Salons, rencontres, démonstrations et rendez-vous business.',
      count: 'Events',
      tone: 'events',
    },
    {
      icon: '☉',
      title: 'Fruits et légumes',
      description: 'Produits frais, primeurs, herbes et familles végétales.',
      count: 'Produits',
      tone: 'produce',
    },
    {
      icon: '≈',
      title: 'Poissons et fruits de mer',
      description: 'Poissons frais, crustacés, filets et produits de la mer.',
      count: 'Produits',
      tone: 'seafood',
    },
    {
      icon: '▱',
      title: 'Lait et produits dérivés',
      description: 'Lait, crèmes, fromages, desserts lactés et glacerie.',
      count: 'Produits',
      tone: 'dairy',
    },
    {
      icon: '⌁',
      title: 'Viandes et volailles',
      description: 'Bovine, ovine, volaille, charcuterie halal et préparés.',
      count: 'Produits',
      tone: 'meat',
    },
    {
      icon: '⚙',
      title: 'Maintenance',
      description: 'Installation, réparation et suivi des équipements professionnels.',
      count: 'Service',
      tone: 'maintenance',
    },
  ];
}
