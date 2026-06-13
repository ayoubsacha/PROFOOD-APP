import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
})
export class StatusBadgeComponent {
  @Input() status = '';
  @Input() label = '';

  protected readonly labels: Record<string, string> = {
    ACTIVE: 'Actif',
    SUSPENDED: 'Bloque',
    PENDING: 'En attente',
    ACCEPTED: 'Acceptee',
    REFUSED: 'Refusee',
    CONFIRMED: 'Approuvee',
    PROCESSING: 'Preparation',
    DELIVERED: 'Livree',
    CANCELLED: 'Annulee',
    PAID: 'Payee',
    FAILED: 'Echec',
    DISABLED: 'Desactive',
    OUT_OF_STOCK: 'Rupture',
    ADMIN: 'Admin',
    FOURNISSEUR: 'Fournisseur',
    CLIENT_PRO: 'Client pro',
  };

  protected displayLabel(): string {
    return this.label || this.labels[this.status] || this.status || 'Statut';
  }

  protected tone(): string {
    if (['ACTIVE', 'ACCEPTED', 'CONFIRMED', 'DELIVERED', 'PAID', 'CLIENT_PRO'].includes(this.status)) {
      return 'success';
    }

    if (['PENDING', 'PROCESSING', 'OUT_OF_STOCK', 'FOURNISSEUR'].includes(this.status)) {
      return 'warning';
    }

    if (['SUSPENDED', 'REFUSED', 'CANCELLED', 'FAILED', 'DISABLED'].includes(this.status)) {
      return 'danger';
    }

    return 'neutral';
  }
}
