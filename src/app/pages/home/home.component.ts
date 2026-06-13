import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { MarketplaceMenuComponent } from '../../components/marketplace-menu/marketplace-menu.component';
import { OpportunitiesSectionComponent } from '../../components/opportunities-section/opportunities-section.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    HeroSectionComponent,
    MarketplaceMenuComponent,
    OpportunitiesSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
