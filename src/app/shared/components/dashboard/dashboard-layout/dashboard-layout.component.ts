import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface DashboardNavItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() eyebrow = '';
  @Input() userName = '';
  @Input() userRole = '';
  @Input() userEmail = '';
  @Input() activeItem = '';
  @Input() navItems: DashboardNavItem[] = [];
  @Input() logoSrc = '/assets/profood-logo.png';
  @Output() itemSelected = new EventEmitter<string>();
  @Output() refreshRequested = new EventEmitter<void>();
  @Output() logoutRequested = new EventEmitter<void>();
}
