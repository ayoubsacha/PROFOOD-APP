import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackendProduct, OrderStatus, SupplierOrder, UserRole, UserStatus } from '../../core/api.models';
import { AccountRequestsService } from '../../core/account-requests.service';
import { AdminDashboardService } from '../../core/admin-dashboard.service';
import { AuthService } from '../../core/auth.service';
import {
  AccountRequest,
  AdminAnalytics,
  ChartDataPoint,
  DashboardStat,
  DashboardTableColumn,
  FilterState,
  UserSummary,
} from '../../core/dashboard.models';
import { OrdersService } from '../../core/orders.service';
import { ProductsService } from '../../core/products.service';
import { UsersService } from '../../core/users.service';
import { ChartCardComponent } from '../../shared/components/dashboard/chart-card/chart-card.component';
import { DataTableComponent } from '../../shared/components/dashboard/data-table/data-table.component';
import {
  DashboardLayoutComponent,
  DashboardNavItem,
} from '../../shared/components/dashboard/dashboard-layout/dashboard-layout.component';
import { EmptyStateComponent } from '../../shared/components/dashboard/empty-state/empty-state.component';
import { FilterBarComponent } from '../../shared/components/dashboard/filter-bar/filter-bar.component';
import { LoadingSpinnerComponent } from '../../shared/components/dashboard/loading-spinner/loading-spinner.component';
import { StatCardComponent } from '../../shared/components/dashboard/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../shared/components/dashboard/status-badge/status-badge.component';

type AdminTab = 'overview' | 'requests' | 'users' | 'products' | 'orders';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [
    FormsModule,
    DashboardLayoutComponent,
    StatCardComponent,
    ChartCardComponent,
    DataTableComponent,
    StatusBadgeComponent,
    FilterBarComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './admin-dashboard-page.component.html',
  styleUrl: './admin-dashboard-page.component.scss',
})
export class AdminDashboardPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly dashboard = inject(AdminDashboardService);
  private readonly requestsApi = inject(AccountRequestsService);
  private readonly usersApi = inject(UsersService);
  private readonly productsApi = inject(ProductsService);
  private readonly ordersApi = inject(OrdersService);

  protected readonly user = computed(() => this.auth.currentUser());
  protected readonly activeTab = signal<AdminTab>('overview');
  protected readonly analytics = signal<AdminAnalytics | null>(null);
  protected readonly users = signal<UserSummary[]>([]);
  protected readonly requests = signal<AccountRequest[]>([]);
  protected readonly products = signal<BackendProduct[]>([]);
  protected readonly orders = signal<SupplierOrder[]>([]);
  protected readonly selectedOrder = signal<SupplierOrder | null>(null);
  protected readonly loading = signal(false);
  protected readonly notice = signal('');
  protected readonly error = signal('');
  protected readonly requestFilters = signal<FilterState>({ search: '', status: '', date: '' });
  protected readonly userFilters = signal<FilterState>({ search: '', status: '', date: '' });
  protected readonly productFilters = signal<FilterState>({ search: '', status: '', date: '' });
  protected readonly orderFilters = signal<FilterState>({ search: '', status: '', date: '' });

  protected readonly navItems: DashboardNavItem[] = [
    { id: 'overview', label: "Vue d'ensemble" },
    { id: 'requests', label: 'Demandes' },
    { id: 'users', label: 'Utilisateurs' },
    { id: 'products', label: 'Produits' },
    { id: 'orders', label: 'Commandes' },
  ];
  protected readonly requestStatusOptions = ['PENDING', 'ACCEPTED', 'REFUSED'];
  protected readonly userStatusOptions = ['PENDING', 'ACTIVE', 'SUSPENDED', 'REFUSED'];
  protected readonly productStatusOptions = ['ACTIVE', 'OUT_OF_STOCK', 'DISABLED'];
  protected readonly orderStatusOptions: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'DELIVERED',
    'CANCELLED',
  ];
  protected readonly roles: UserRole[] = ['ADMIN', 'FOURNISSEUR', 'CLIENT_PRO'];

  protected readonly recentOrderColumns: DashboardTableColumn[] = [
    { key: 'code', label: 'Commande' },
    { key: 'totalAmount', label: 'Total', kind: 'money' },
    { key: 'orderStatus', label: 'Statut', kind: 'status' },
    { key: 'createdAt', label: 'Date', kind: 'date' },
  ];
  protected readonly recentUserColumns: DashboardTableColumn[] = [
    { key: 'name', label: 'Nom' },
    { key: 'role', label: 'Role', kind: 'status' },
    { key: 'status', label: 'Statut', kind: 'status' },
    { key: 'createdAt', label: 'Inscrit', kind: 'date' },
  ];

  protected readonly stats = computed<DashboardStat[]>(() => {
    const analytics = this.analytics();

    if (!analytics) {
      return [];
    }

    return [
      { label: 'Total users', value: analytics.totalUsers, helper: 'Tous roles', icon: 'U', tone: 'dark' },
      { label: 'Clients', value: analytics.totalClients, helper: 'CLIENT_PRO', icon: 'C', tone: 'gold' },
      { label: 'Fournisseurs', value: analytics.totalFournisseurs, helper: 'Comptes supply', icon: 'F', tone: 'blue' },
      { label: 'Produits', value: analytics.totalProducts, helper: 'Catalogue actif', icon: 'P', tone: 'gray' },
      { label: 'Commandes', value: analytics.totalOrders, helper: 'Toutes commandes', icon: 'O', tone: 'amber' },
      { label: 'Revenue', value: `${this.money(analytics.revenue.revenue)} MAD`, helper: 'CA total', icon: 'R', tone: 'gold' },
      { label: 'Demandes', value: analytics.pendingAccountRequests, helper: 'A traiter', icon: 'D', tone: 'red' },
      { label: 'Stock faible', value: analytics.lowStockCount, helper: 'Seuil 10 unites', icon: 'S', tone: 'amber' },
    ];
  });

  protected readonly revenueChart = computed<ChartDataPoint[]>(() =>
    (this.analytics()?.revenueByMonth || []).map((point) => ({
      label: point.label,
      value: Math.round(point.value),
    })),
  );

  protected readonly topProductChart = computed<ChartDataPoint[]>(() =>
    (this.analytics()?.topProducts || []).slice(0, 8).map((product) => ({
      label: product.productName,
      value: product.quantitySold,
      helper: `${this.money(product.revenue)} MAD`,
    })),
  );

  protected readonly recentOrderRows = computed<Record<string, unknown>[]>(() =>
    (this.analytics()?.recentOrders || this.orders()).slice(0, 8).map((order) => ({
      code: order._id.slice(-6).toUpperCase(),
      totalAmount: order.totalAmount,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
    })),
  );

  protected readonly recentUserRows = computed<Record<string, unknown>[]>(() =>
    (this.analytics()?.recentUsers || this.users()).slice(0, 8).map((user) => ({
      name: user.name,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    })),
  );

  protected readonly filteredRequests = computed(() =>
    this.applyFilters(this.requests(), this.requestFilters(), (request) => [
      request.name,
      request.email,
      request.companyName || '',
      request.requestedRole,
    ], (request) => request.status, (request) => request.createdAt),
  );

  protected readonly filteredUsers = computed(() =>
    this.applyFilters(this.users(), this.userFilters(), (user) => [
      user.name,
      user.email,
      user.companyName || '',
      user.role,
    ], (user) => user.status, (user) => user.createdAt),
  );

  protected readonly filteredProducts = computed(() =>
    this.applyFilters(this.products(), this.productFilters(), (product) => [
      product.name,
      product.category,
      product.fournisseurName,
      product.type || '',
    ], (product) => product.status),
  );

  protected readonly filteredOrders = computed(() =>
    this.applyFilters(this.orders(), this.orderFilters(), (order) => [
      order._id,
      order.items.map((item) => item.productName).join(' '),
      order.orderStatus,
    ], (order) => order.orderStatus, (order) => order.createdAt),
  );

  ngOnInit(): void {
    this.loadDashboard();
  }

  protected loadDashboard(): void {
    this.loading.set(true);
    this.error.set('');

    this.dashboard.getDashboard().subscribe({
      next: (data) => {
        this.analytics.set(data.analytics);
        this.users.set(data.users);
        this.requests.set(data.requests);
        this.products.set(data.products);
        this.orders.set(data.orders);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Impossible de charger le dashboard admin.");
        this.loading.set(false);
      },
    });
  }

  protected setTab(tab: string): void {
    this.activeTab.set(tab as AdminTab);
    this.notice.set('');
    this.error.set('');
  }

  protected setRequestFilters(filters: FilterState): void {
    this.requestFilters.set(filters);
  }

  protected setUserFilters(filters: FilterState): void {
    this.userFilters.set(filters);
  }

  protected setProductFilters(filters: FilterState): void {
    this.productFilters.set(filters);
  }

  protected setOrderFilters(filters: FilterState): void {
    this.orderFilters.set(filters);
  }

  protected approveRequest(request: AccountRequest): void {
    this.requestsApi.approveRequest(request._id).subscribe({
      next: () => this.afterAction('Demande approuvee.'),
      error: () => this.error.set("La demande n'a pas pu etre approuvee."),
    });
  }

  protected refuseRequest(request: AccountRequest): void {
    this.requestsApi.refuseRequest(request._id).subscribe({
      next: () => this.afterAction('Demande refusee.'),
      error: () => this.error.set("La demande n'a pas pu etre refusee."),
    });
  }

  protected toggleUserStatus(user: UserSummary): void {
    const userId = user._id || user.id;
    const nextStatus: UserStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';

    this.usersApi.updateStatus(userId, nextStatus).subscribe({
      next: (updatedUser) => {
        this.users.update((users) => users.map((item) => this.sameUser(item, updatedUser) ? updatedUser : item));
        this.notice.set(nextStatus === 'SUSPENDED' ? 'Utilisateur bloque.' : 'Utilisateur debloque.');
      },
      error: () => this.error.set("Le statut utilisateur n'a pas pu etre modifie."),
    });
  }

  protected changeUserRole(user: UserSummary, role: string): void {
    const userId = user._id || user.id;

    this.usersApi.updateUser(userId, { role: role as UserRole }).subscribe({
      next: (updatedUser) => {
        this.users.update((users) => users.map((item) => this.sameUser(item, updatedUser) ? updatedUser : item));
        this.notice.set('Role utilisateur mis a jour.');
      },
      error: () => this.error.set("Le role utilisateur n'a pas pu etre modifie."),
    });
  }

  protected toggleProduct(product: BackendProduct): void {
    const request =
      product.status === 'DISABLED'
        ? this.productsApi.updateProduct(product._id, { status: 'ACTIVE' })
        : this.productsApi.disableProduct(product._id);

    request.subscribe({
      next: (updatedProduct) => {
        this.products.update((products) =>
          products.map((item) => (item._id === updatedProduct._id ? updatedProduct : item)),
        );
        this.notice.set(product.status === 'DISABLED' ? 'Produit active.' : 'Produit desactive.');
      },
      error: () => this.error.set("Le produit n'a pas pu etre modifie."),
    });
  }

  protected updateOrder(order: SupplierOrder, orderStatus: OrderStatus): void {
    this.ordersApi.updateStatus(order._id, orderStatus).subscribe({
      next: (updatedOrder) => {
        this.orders.update((orders) =>
          orders.map((item) => (item._id === updatedOrder._id ? updatedOrder : item)),
        );
        this.selectedOrder.set(updatedOrder);
        this.notice.set('Commande mise a jour.');
      },
      error: () => this.error.set("La commande n'a pas pu etre modifiee."),
    });
  }

  protected viewOrder(order: SupplierOrder): void {
    this.selectedOrder.set(order);
  }

  protected closeOrder(): void {
    this.selectedOrder.set(null);
  }

  protected logout(): void {
    this.auth.logout();
  }

  protected money(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      maximumFractionDigits: 2,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value || 0);
  }

  protected dateText(value?: string): string {
    if (!value) {
      return '-';
    }

    return new Intl.DateTimeFormat('fr-MA', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  private applyFilters<T>(
    items: T[],
    filters: FilterState,
    searchable: (item: T) => string[],
    statusValue: (item: T) => string,
    dateValue: (item: T) => string | undefined = () => undefined,
  ): T[] {
    const search = this.normalize(filters.search);

    return items.filter((item) => {
      const matchesSearch = !search || searchable(item).some((value) => this.normalize(value).includes(search));
      const matchesStatus = !filters.status || statusValue(item) === filters.status;
      const matchesDate = !filters.date || String(dateValue(item) || '').startsWith(filters.date);
      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private afterAction(message: string): void {
    this.notice.set(message);
    this.loadDashboard();
  }

  private sameUser(first: UserSummary, second: UserSummary): boolean {
    return (first._id || first.id) === (second._id || second.id);
  }
}
