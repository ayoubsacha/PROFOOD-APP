import { Routes } from '@angular/router';
import { activeAuthGuard, loginRedirectGuard, roleAuthGuard } from './core/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { AccountRequestPageComponent } from './pages/account-request/account-request-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { ProductDetailPageComponent } from './pages/product-detail/product-detail-page.component';
import { ProductsPageComponent } from './pages/products/products-page.component';
import { RoleDashboardPageComponent } from './pages/role-dashboard/role-dashboard-page.component';
import { FournisseurDashboardPageComponent } from './pages/fournisseur-dashboard/fournisseur-dashboard-page.component';
import { ClientDashboardPageComponent } from './pages/client-dashboard/client-dashboard-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [roleAuthGuard],
    data: { roles: ['CLIENT_PRO'] },
    title: 'PlaceToInvest - Accueil',
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [loginRedirectGuard],
    title: 'PlaceToInvest - Connexion',
  },
  {
    path: 'client/dashboard',
    component: ClientDashboardPageComponent,
    canActivate: [roleAuthGuard],
    data: { roles: ['CLIENT_PRO'], dashboard: 'client' },
    title: 'PlaceToInvest - Client',
  },
  {
    path: 'admin/dashboard',
    component: RoleDashboardPageComponent,
    canActivate: [roleAuthGuard],
    data: { roles: ['ADMIN'], dashboard: 'admin' },
    title: 'PlaceToInvest - Admin',
  },
  {
    path: 'fournisseur/dashboard',
    component: FournisseurDashboardPageComponent,
    canActivate: [roleAuthGuard],
    data: { roles: ['FOURNISSEUR'], dashboard: 'fournisseur' },
    title: 'PlaceToInvest - Fournisseur',
  },
  {
    path: 'account-request',
    component: AccountRequestPageComponent,
    title: 'PlaceToInvest - Demande de compte',
  },
  {
    path: 'products/:slug',
    component: ProductDetailPageComponent,
    canActivate: [activeAuthGuard],
    title: 'PlaceToInvest - Product Detail',
  },
  {
    path: 'products',
    component: ProductsPageComponent,
    canActivate: [activeAuthGuard],
    title: 'PlaceToInvest - Products',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
