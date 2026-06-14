import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import {
  BackendProduct,
  Conversation,
  ConversationParty,
  Message,
  SupplierOrder,
  UserRole,
  UserStatus,
} from '../../core/api.models';
import { AccountRequestsService } from '../../core/account-requests.service';
import { AdminDashboardService } from '../../core/admin-dashboard.service';
import { AuthService } from '../../core/auth.service';
import { AccountRequest, AdminAnalytics, ChartDataPoint, UserSummary } from '../../core/dashboard.models';
import { MessagingService } from '../../core/messaging.service';
import { ProductsService } from '../../core/products.service';
import { UsersService } from '../../core/users.service';

type AdminSection = 'profile' | 'accounts' | 'requests' | 'products' | 'inbox' | 'charts';

interface SidebarSection {
  id: AdminSection;
  label: string;
}

interface SectionCopy {
  eyebrow: string;
  title: string;
  description: string;
}

interface AdminProfile {
  fullName: string;
  email: string;
  phone: string;
  profileImage: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface AccountFilterState {
  search: string;
  role: UserRole | '';
  status: UserStatus | '';
}

interface RequestFilterState {
  search: string;
  status: AccountRequest['status'] | '';
  date: string;
}

interface ProductFilterState {
  search: string;
  category: string;
  supplier: string;
  status: BackendProduct['status'] | '';
}

interface AdminStat {
  label: string;
  value: string | number;
  helper: string;
  icon: string;
  tone: 'cart' | 'orders' | 'paid' | 'profile';
}

interface BestSpendingClient {
  clientId: string;
  clientName: string;
  companyName: string;
  orderCount: number;
  totalSpending: number;
  lastOrderDate: string;
}

interface BestSellerFournisseur {
  fournisseurId: string;
  fournisseurName: string;
  companyName: string;
  totalIncome: number;
  acceptedOrders: number;
  productsSold: number;
  rating: number;
}

interface ClientAccountDetails {
  orderCount: number;
  totalSpending: number;
  favoriteSupplier: string;
  lastOrders: SupplierOrder[];
}

interface FournisseurAccountDetails {
  totalIncome: number;
  productCount: number;
  activeProducts: number;
  outOfStockProducts: number;
  acceptedOrders: number;
  refusedOrders: number;
  pendingOrders: number;
  bestProduct: string;
  rating: number;
}

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [FormsModule],
  templateUrl: './admin-dashboard-page.component.html',
  styleUrl: './admin-dashboard-page.component.scss',
})
export class AdminDashboardPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly dashboard = inject(AdminDashboardService);
  private readonly requestsApi = inject(AccountRequestsService);
  private readonly usersApi = inject(UsersService);
  private readonly productsApi = inject(ProductsService);
  private readonly messaging = inject(MessagingService);

  protected readonly user = computed(() => this.auth.currentUser());
  protected readonly activeSection = signal<AdminSection>('profile');
  protected readonly sidebarOpen = signal(false);
  protected readonly analytics = signal<AdminAnalytics | null>(null);
  protected readonly users = signal<UserSummary[]>([]);
  protected readonly requests = signal<AccountRequest[]>([]);
  protected readonly products = signal<BackendProduct[]>([]);
  protected readonly orders = signal<SupplierOrder[]>([]);
  protected readonly conversations = signal<Conversation[]>([]);
  protected readonly selectedConversation = signal<Conversation | null>(null);
  protected readonly messages = signal<Message[]>([]);
  protected readonly selectedUser = signal<UserSummary | null>(null);
  protected readonly selectedRequest = signal<AccountRequest | null>(null);
  protected readonly selectedProduct = signal<BackendProduct | null>(null);
  protected readonly loading = signal(false);
  protected readonly inboxLoading = signal(false);
  protected readonly notice = signal('');
  protected readonly error = signal('');
  protected readonly profileImagePreview = signal('');

  protected readonly accountFilters = signal<AccountFilterState>({
    search: '',
    role: '',
    status: '',
  });
  protected readonly requestFilters = signal<RequestFilterState>({
    search: '',
    status: '',
    date: '',
  });
  protected readonly productFilters = signal<ProductFilterState>({
    search: '',
    category: '',
    supplier: '',
    status: '',
  });

  protected readonly roles: UserRole[] = ['ADMIN', 'FOURNISSEUR', 'CLIENT_PRO'];
  protected readonly userStatusOptions: UserStatus[] = ['PENDING', 'ACTIVE', 'SUSPENDED', 'REFUSED'];
  protected readonly requestStatusOptions: AccountRequest['status'][] = ['PENDING', 'ACCEPTED', 'REFUSED'];
  protected readonly productStatusOptions: BackendProduct['status'][] = ['ACTIVE', 'OUT_OF_STOCK', 'DISABLED'];

  protected readonly sections: SidebarSection[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'accounts', label: 'Accounts' },
    { id: 'requests', label: 'Requests' },
    { id: 'products', label: 'Products' },
    { id: 'inbox', label: 'Boite de reception' },
    { id: 'charts', label: 'Charts' },
  ];

  protected readonly sectionCopy: Record<AdminSection, SectionCopy> = {
    profile: {
      eyebrow: 'Admin',
      title: 'Profile',
      description: 'Profil, mot de passe et statut du compte administrateur.',
    },
    accounts: {
      eyebrow: 'Utilisateurs',
      title: 'Accounts',
      description: 'Gestion des comptes clients, fournisseurs et administrateurs.',
    },
    requests: {
      eyebrow: 'Demandes',
      title: 'Requests',
      description: 'Validation et refus des demandes de comptes professionnels.',
    },
    products: {
      eyebrow: 'Catalogue',
      title: 'Products',
      description: 'Moderation des produits et services de tous les fournisseurs.',
    },
    inbox: {
      eyebrow: 'Messages',
      title: 'Boite de reception',
      description: 'Conversations utilisateurs visibles par l administration.',
    },
    charts: {
      eyebrow: 'Charts',
      title: 'Statistiques',
      description: 'Performance globale, revenus, comptes et meilleurs acteurs.',
    },
  };

  protected readonly profileForm: AdminProfile = {
    fullName: '',
    email: '',
    phone: '',
    profileImage: '',
  };

  protected readonly passwordForm: PasswordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  protected readonly currentSectionCopy = computed(() => this.sectionCopy[this.activeSection()]);

  protected readonly filteredUsers = computed(() => {
    const filters = this.accountFilters();
    const search = this.normalize(filters.search);

    return this.users().filter((user) => {
      const matchesSearch =
        !search ||
        [user.name, user.email, user.companyName || '', user.phone || ''].some((value) =>
          this.normalize(value).includes(search),
        );
      const matchesRole = !filters.role || user.role === filters.role;
      const matchesStatus = !filters.status || user.status === filters.status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  });

  protected readonly filteredRequests = computed(() => {
    const filters = this.requestFilters();
    const search = this.normalize(filters.search);

    return this.requests().filter((request) => {
      const matchesSearch =
        !search ||
        [request.name, request.email, request.companyName || '', request.phone || ''].some((value) =>
          this.normalize(value).includes(search),
        );
      const matchesStatus = !filters.status || request.status === filters.status;
      const matchesDate = !filters.date || request.createdAt.startsWith(filters.date);
      return matchesSearch && matchesStatus && matchesDate;
    });
  });

  protected readonly filteredProducts = computed(() => {
    const filters = this.productFilters();
    const search = this.normalize(filters.search);
    const category = this.normalize(filters.category);
    const supplier = this.normalize(filters.supplier);

    return this.products().filter((product) => {
      const matchesSearch =
        !search ||
        [product.name, product.category, product.fournisseurName, product.type || ''].some((value) =>
          this.normalize(value).includes(search),
        );
      const matchesCategory = !category || this.normalize(product.category) === category;
      const matchesSupplier = !supplier || this.normalize(product.fournisseurName) === supplier;
      const matchesStatus = !filters.status || product.status === filters.status;
      return matchesSearch && matchesCategory && matchesSupplier && matchesStatus;
    });
  });

  protected readonly categoryOptions = computed(() =>
    [...new Set(this.products().map((product) => product.category).filter(Boolean))].sort(),
  );

  protected readonly supplierOptions = computed(() =>
    [...new Set(this.products().map((product) => product.fournisseurName).filter(Boolean))].sort(),
  );

  protected readonly adminStats = computed<AdminStat[]>(() => {
    const analytics = this.analytics();
    const users = this.users();
    const products = this.products();
    const pendingRequests = this.requests().filter((request) => request.status === 'PENDING').length;
    const totalProducts = analytics?.totalProducts || products.length;
    const activeProducts = products.filter((product) => product.status === 'ACTIVE').length;

    return [
      {
        label: 'Total users',
        value: analytics?.totalUsers || users.length,
        helper: 'Tous les comptes',
        icon: 'U',
        tone: 'profile',
      },
      {
        label: 'Clients',
        value: analytics?.totalClients || users.filter((user) => user.role === 'CLIENT_PRO').length,
        helper: 'CLIENT_PRO',
        icon: 'C',
        tone: 'orders',
      },
      {
        label: 'Fournisseurs',
        value:
          analytics?.totalFournisseurs || users.filter((user) => user.role === 'FOURNISSEUR').length,
        helper: 'Comptes supply',
        icon: 'F',
        tone: 'cart',
      },
      {
        label: 'Admins',
        value: users.filter((user) => user.role === 'ADMIN').length,
        helper: 'Equipe admin',
        icon: 'A',
        tone: 'paid',
      },
      {
        label: 'Products',
        value: totalProducts,
        helper: `${activeProducts} actifs`,
        icon: 'P',
        tone: 'cart',
      },
      {
        label: 'Orders',
        value: analytics?.totalOrders || this.orders().length,
        helper: 'Toutes commandes',
        icon: 'O',
        tone: 'orders',
      },
      {
        label: 'Revenue',
        value: `${this.money(analytics?.revenue.revenue || this.totalRevenue())} MAD`,
        helper: 'CA total',
        icon: 'R',
        tone: 'paid',
      },
      {
        label: 'Requests',
        value: analytics?.pendingAccountRequests || pendingRequests,
        helper: 'En attente',
        icon: 'D',
        tone: 'profile',
      },
    ];
  });

  protected readonly bestSpendingClient = computed<BestSpendingClient | null>(() => {
    const clients = this.bestClients();
    return clients.length ? clients[0] : null;
  });

  protected readonly bestSellerFournisseur = computed<BestSellerFournisseur | null>(() => {
    const fournisseurs = this.bestFournisseurs();
    return fournisseurs.length ? fournisseurs[0] : null;
  });

  protected readonly selectedClientDetails = computed<ClientAccountDetails | null>(() => {
    const user = this.selectedUser();
    return user?.role === 'CLIENT_PRO' ? this.buildClientDetails(user) : null;
  });

  protected readonly selectedFournisseurDetails = computed<FournisseurAccountDetails | null>(() => {
    const user = this.selectedUser();
    return user?.role === 'FOURNISSEUR' ? this.buildFournisseurDetails(user) : null;
  });

  protected readonly usersByRoleChart = computed(() =>
    this.withPercent(this.analytics()?.usersByRole || this.countUsersByRole()),
  );

  protected readonly ordersByStatusChart = computed(() =>
    this.withPercent(this.analytics()?.ordersByStatus || this.countOrdersByStatus()),
  );

  protected readonly productsByCategoryChart = computed(() =>
    this.withPercent(this.analytics()?.productsByCategory || this.countProductsByCategory()),
  );

  protected readonly revenueByMonthChart = computed(() =>
    this.withPercent(
      (this.analytics()?.revenueByMonth || []).map((point) => ({
        label: point.label,
        value: Math.round(point.value),
      })),
    ),
  );

  protected readonly bestFournisseursChart = computed(() =>
    this.withPercent(
      this.bestFournisseurs()
        .slice(0, 5)
        .map((supplier) => ({
          label: supplier.fournisseurName,
          value: Math.round(supplier.totalIncome),
          helper: `${supplier.productsSold} unites`,
        })),
    ),
  );

  protected readonly bestClientsChart = computed(() =>
    this.withPercent(
      this.bestClients()
        .slice(0, 5)
        .map((client) => ({
          label: client.clientName,
          value: Math.round(client.totalSpending),
          helper: `${client.orderCount} commandes`,
        })),
    ),
  );

  ngOnInit(): void {
    this.hydrateProfile();
    this.loadProfileExtras();
    this.loadDashboard();
    this.loadInbox();
  }

  protected setSection(section: AdminSection): void {
    this.activeSection.set(section);
    this.sidebarOpen.set(false);
    this.notice.set('');
    this.error.set('');
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
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
        this.refreshSelections(data.users, data.requests, data.products);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set(this.readApiError(error) || 'Impossible de charger le dashboard admin.');
      },
    });
  }

  protected loadInbox(): void {
    this.inboxLoading.set(true);

    this.messaging.listConversations().subscribe({
      next: (conversations) => {
        this.conversations.set(conversations);
        this.inboxLoading.set(false);

        if (!this.selectedConversation() && conversations.length) {
          this.selectConversation(conversations[0]);
        }
      },
      error: () => {
        this.inboxLoading.set(false);
        this.error.set("Impossible de charger la boite de reception admin.");
      },
    });
  }

  protected saveProfile(): void {
    const user = this.user();

    if (!user) {
      this.error.set('Session admin introuvable.');
      return;
    }

    this.notice.set('');
    this.error.set('');

    this.auth
      .updateProfile({
        name: this.profileForm.fullName.trim(),
        phone: this.profileForm.phone.trim(),
        profileImage: this.profileForm.profileImage,
      })
      .pipe(
        switchMap(() =>
          this.dashboard.saveAdminProfileExtras(user.id, {
            email: this.profileForm.email.trim(),
          }),
        ),
      )
      .subscribe({
        next: () => this.notice.set('Profil admin mis a jour.'),
        error: (error) =>
          this.error.set(this.readApiError(error) || "Le profil n'a pas pu etre mis a jour."),
      });
  }

  protected importProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.error.set('Veuillez importer une image valide.');
      return;
    }

    this.resizeImage(file)
      .then((image) => {
        this.profileForm.profileImage = image;
        this.profileImagePreview.set(image);
        this.error.set('');
      })
      .catch(() => this.error.set("L'image de profil n'a pas pu etre importee."));
  }

  protected removeProfileImage(): void {
    this.profileForm.profileImage = '';
    this.profileImagePreview.set('');
  }

  protected changePassword(): void {
    this.notice.set('');
    this.error.set('');

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.error.set('La confirmation du mot de passe ne correspond pas.');
      return;
    }

    this.auth
      .changePassword({
        currentPassword: this.passwordForm.currentPassword,
        newPassword: this.passwordForm.newPassword,
      })
      .subscribe({
        next: () => {
          this.notice.set('Mot de passe modifie.');
          this.passwordForm.currentPassword = '';
          this.passwordForm.newPassword = '';
          this.passwordForm.confirmPassword = '';
        },
        error: (error) =>
          this.error.set(this.readApiError(error) || "Le mot de passe n'a pas pu etre modifie."),
      });
  }

  protected toggleOwnAccountStatus(): void {
    const user = this.user();

    if (!user) {
      return;
    }

    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';

    if (nextStatus === 'SUSPENDED' && !this.confirmAdminDeactivation(user.id)) {
      return;
    }

    this.auth.updateAccountStatus(nextStatus).subscribe({
      next: () =>
        this.notice.set(nextStatus === 'ACTIVE' ? 'Compte admin active.' : 'Compte admin desactive.'),
      error: (error) =>
        this.error.set(this.readApiError(error) || "Le statut du compte n'a pas pu etre modifie."),
    });
  }

  protected setAccountFilter(field: keyof AccountFilterState, value: string): void {
    this.accountFilters.update((filters) => ({ ...filters, [field]: value } as AccountFilterState));
  }

  protected setRequestFilter(field: keyof RequestFilterState, value: string): void {
    this.requestFilters.update((filters) => ({ ...filters, [field]: value } as RequestFilterState));
  }

  protected setProductFilter(field: keyof ProductFilterState, value: string): void {
    this.productFilters.update((filters) => ({ ...filters, [field]: value } as ProductFilterState));
  }

  protected viewUser(user: UserSummary): void {
    this.selectedUser.set(user);
  }

  protected closeUserDetails(): void {
    this.selectedUser.set(null);
  }

  protected toggleUserStatus(user: UserSummary): void {
    const userId = this.userId(user);
    const nextStatus: UserStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';

    if (nextStatus === 'SUSPENDED' && !this.confirmAdminDeactivation(userId)) {
      return;
    }

    if (
      nextStatus === 'SUSPENDED' &&
      !window.confirm(`Desactiver le compte ${user.companyName || user.name} ?`)
    ) {
      return;
    }

    this.usersApi.updateStatus(userId, nextStatus).subscribe({
      next: (updatedUser) => {
        this.users.update((users) =>
          users.map((item) => (this.sameUser(item, updatedUser) ? updatedUser : item)),
        );
        this.selectedUser.update((current) =>
          current && this.sameUser(current, updatedUser) ? updatedUser : current,
        );
        this.notice.set(nextStatus === 'SUSPENDED' ? 'Utilisateur desactive.' : 'Utilisateur active.');
      },
      error: (error) =>
        this.error.set(this.readApiError(error) || "Le statut utilisateur n'a pas pu etre modifie."),
    });
  }

  protected changeUserRole(user: UserSummary, role: string): void {
    const nextRole = role as UserRole;

    if (user.role === nextRole) {
      return;
    }

    const userId = this.userId(user);

    if (
      !window.confirm(
        `Changer le role de ${user.companyName || user.name} de ${user.role} vers ${nextRole} ?`,
      )
    ) {
      return;
    }

    if (this.isSelf(userId) && user.role === 'ADMIN') {
      const confirmation = window.prompt('Tapez CHANGE ADMIN ROLE pour confirmer ce changement.');
      if (confirmation !== 'CHANGE ADMIN ROLE') {
        return;
      }
    }

    this.usersApi.updateUser(userId, { role: nextRole }).subscribe({
      next: (updatedUser) => {
        this.users.update((users) =>
          users.map((item) => (this.sameUser(item, updatedUser) ? updatedUser : item)),
        );
        this.selectedUser.update((current) =>
          current && this.sameUser(current, updatedUser) ? updatedUser : current,
        );
        this.notice.set('Role utilisateur mis a jour.');
      },
      error: (error) =>
        this.error.set(this.readApiError(error) || "Le role utilisateur n'a pas pu etre modifie."),
    });
  }

  protected viewRequest(request: AccountRequest): void {
    this.selectedRequest.set(request);
  }

  protected approveRequest(request: AccountRequest): void {
    if (!window.confirm(`Accepter la demande de ${request.companyName || request.name} ?`)) {
      return;
    }

    this.requestsApi.approveRequest(request._id).subscribe({
      next: () => this.afterAction('Demande approuvee.'),
      error: (error) =>
        this.error.set(this.readApiError(error) || "La demande n'a pas pu etre approuvee."),
    });
  }

  protected refuseRequest(request: AccountRequest): void {
    const reason = window.prompt('Raison du refus');

    if (!reason?.trim()) {
      this.error.set('Une raison est requise pour refuser une demande.');
      return;
    }

    this.requestsApi
      .refuseRequest(request._id, reason.trim())
      .pipe(switchMap(() => this.dashboard.saveRequestReviewNote(request._id, reason.trim())))
      .subscribe({
        next: () => this.afterAction('Demande refusee.'),
        error: (error) =>
          this.error.set(this.readApiError(error) || "La demande n'a pas pu etre refusee."),
      });
  }

  protected requestReviewNote(request: AccountRequest): string {
    return this.dashboard.getRequestReviewNote(request._id);
  }

  protected viewProduct(product: BackendProduct): void {
    this.selectedProduct.set(product);
  }

  protected toggleProduct(product: BackendProduct): void {
    const nextStatus: BackendProduct['status'] = product.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED';

    if (nextStatus === 'DISABLED' && !window.confirm(`Desactiver ${product.name} ?`)) {
      return;
    }

    const request =
      nextStatus === 'ACTIVE'
        ? this.productsApi.updateProduct(product._id, { status: 'ACTIVE' })
        : this.productsApi.disableProduct(product._id);

    request.subscribe({
      next: (updatedProduct) => {
        this.products.update((products) =>
          products.map((item) => (item._id === updatedProduct._id ? updatedProduct : item)),
        );
        this.selectedProduct.update((current) =>
          current?._id === updatedProduct._id ? updatedProduct : current,
        );
        this.notice.set(nextStatus === 'ACTIVE' ? 'Produit active.' : 'Produit desactive.');
      },
      error: (error) =>
        this.error.set(this.readApiError(error) || "Le produit n'a pas pu etre modifie."),
    });
  }

  protected deleteProduct(product: BackendProduct): void {
    if (!window.confirm(`Supprimer definitivement ${product.name} du catalogue ?`)) {
      return;
    }

    this.productsApi.deleteProduct(product._id).subscribe({
      next: () => {
        this.products.update((products) => products.filter((item) => item._id !== product._id));
        this.selectedProduct.set(null);
        this.notice.set('Produit supprime.');
      },
      error: (error) =>
        this.error.set(this.readApiError(error) || "Le produit n'a pas pu etre supprime."),
    });
  }

  protected selectConversation(conversation: Conversation): void {
    this.selectedConversation.set(conversation);
    this.inboxLoading.set(true);

    this.messaging.listMessages(conversation._id).subscribe({
      next: (messages) => {
        this.messages.set(messages);
        this.inboxLoading.set(false);
      },
      error: () => {
        this.messages.set([]);
        this.inboxLoading.set(false);
        this.error.set("Impossible de charger les messages de cette conversation.");
      },
    });
  }

  protected replyUnavailable(): void {
    this.notice.set('Reponse admin indisponible: endpoint support/admin a ajouter cote backend.');
  }

  protected logout(): void {
    this.auth.logout();
  }

  protected statusLabel(status: string): string {
    const labels: Record<string, string> = {
      ACTIVE: 'Actif',
      SUSPENDED: 'Desactive',
      PENDING: 'En attente',
      ACCEPTED: 'Acceptee',
      REFUSED: 'Refusee',
      DISABLED: 'Inactif',
      OUT_OF_STOCK: 'Rupture',
      CONFIRMED: 'Acceptee',
      PROCESSING: 'En preparation',
      DELIVERED: 'Livree',
      CANCELLED: 'Annulee',
      PAID: 'Payee',
      FAILED: 'Echec',
      ADMIN: 'Admin',
      FOURNISSEUR: 'Fournisseur',
      CLIENT_PRO: 'Client Pro',
    };

    return labels[status] || status;
  }

  protected money(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      maximumFractionDigits: 2,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value || 0);
  }

  protected dateText(value?: string): string {
    if (!value) {
      return 'Date inconnue';
    }

    return new Intl.DateTimeFormat('fr-MA', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  protected userId(user: UserSummary): string {
    return user._id || user.id;
  }

  protected productUnit(product: BackendProduct): string {
    return String(product.characteristics?.['unit'] || 'unite');
  }

  protected productImage(product: BackendProduct): string {
    return product.image || '/assets/business-hero.png';
  }

  protected conversationTitle(conversation: Conversation): string {
    return `${this.partyName(conversation.clientProId, 'Client')} / ${this.partyName(
      conversation.fournisseurId,
      'Fournisseur',
    )}`;
  }

  protected conversationRoleSummary(conversation: Conversation): string {
    return `${this.partyRole(conversation.clientProId)} / ${this.partyRole(conversation.fournisseurId)}`;
  }

  protected messageSender(message: Message): string {
    return this.partyName(message.senderId, 'Utilisateur');
  }

  protected messageSenderRole(message: Message): string {
    return this.partyRole(message.senderId);
  }

  protected conversationHasUnread(conversation: Conversation): boolean {
    if (this.selectedConversation()?._id !== conversation._id) {
      return false;
    }

    return this.messages().some((message) => !message.isRead);
  }

  private hydrateProfile(): void {
    const user = this.user();

    if (!user) {
      return;
    }

    this.profileForm.fullName = user.name || '';
    this.profileForm.email = user.email || '';
    this.profileForm.phone = user.phone || '';
    this.profileForm.profileImage = user.profileImage || '';
    this.profileImagePreview.set(user.profileImage || '');
  }

  private loadProfileExtras(): void {
    const user = this.user();

    if (!user) {
      return;
    }

    this.dashboard.getAdminProfileExtras(user.id).subscribe({
      next: (extras) => {
        this.profileForm.email = extras.email || user.email || '';
      },
    });
  }

  private buildClientDetails(user: UserSummary): ClientAccountDetails {
    const userOrders = this.orders().filter((order) => order.clientProId === this.userId(user));
    const favoriteSupplier = this.favoriteSupplier(userOrders);

    return {
      orderCount: userOrders.length,
      totalSpending: userOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      favoriteSupplier,
      lastOrders: userOrders.slice(0, 5),
    };
  }

  private buildFournisseurDetails(user: UserSummary): FournisseurAccountDetails {
    const fournisseurId = this.userId(user);
    const products = this.products().filter(
      (product) => product.fournisseurId === fournisseurId || product.fournisseurName === user.companyName,
    );
    const supplierOrders = this.orders().filter((order) =>
      order.items.some((item) => item.fournisseurId === fournisseurId),
    );
    const validOrders = supplierOrders.filter((order) => order.orderStatus !== 'CANCELLED');
    const sales = new Map<string, { name: string; quantity: number; revenue: number }>();

    validOrders.forEach((order) => {
      order.items
        .filter((item) => item.fournisseurId === fournisseurId)
        .forEach((item) => {
          const current = sales.get(item.productId) || {
            name: item.productName,
            quantity: 0,
            revenue: 0,
          };
          current.quantity += item.quantity;
          current.revenue += item.totalPrice;
          sales.set(item.productId, current);
        });
    });

    const bestProduct = [...sales.values()].sort((first, second) => second.revenue - first.revenue)[0];

    return {
      totalIncome: validOrders.reduce(
        (sum, order) =>
          sum +
          order.items
            .filter((item) => item.fournisseurId === fournisseurId)
            .reduce((itemSum, item) => itemSum + item.totalPrice, 0),
        0,
      ),
      productCount: products.length,
      activeProducts: products.filter((product) => product.status === 'ACTIVE').length,
      outOfStockProducts: products.filter((product) => product.status === 'OUT_OF_STOCK').length,
      acceptedOrders: supplierOrders.filter((order) =>
        ['CONFIRMED', 'PROCESSING', 'DELIVERED'].includes(order.orderStatus),
      ).length,
      refusedOrders: supplierOrders.filter((order) => order.orderStatus === 'CANCELLED').length,
      pendingOrders: supplierOrders.filter((order) => order.orderStatus === 'PENDING').length,
      bestProduct: bestProduct?.name || 'Non disponible',
      rating: this.dashboard.fallbackSupplierRating(),
    };
  }

  private bestClients(): BestSpendingClient[] {
    const usersById = new Map(this.users().map((user) => [this.userId(user), user]));
    const clients = new Map<string, BestSpendingClient>();

    this.orders().forEach((order) => {
      const user = usersById.get(order.clientProId);
      const current = clients.get(order.clientProId) || {
        clientId: order.clientProId,
        clientName: user?.name || order.checkoutInfo?.contactName || `Client ${order.clientProId.slice(-5)}`,
        companyName: user?.companyName || order.checkoutInfo?.companyName || '',
        orderCount: 0,
        totalSpending: 0,
        lastOrderDate: order.createdAt,
      };

      current.orderCount += 1;
      current.totalSpending += order.totalAmount;

      if (new Date(order.createdAt) > new Date(current.lastOrderDate)) {
        current.lastOrderDate = order.createdAt;
      }

      clients.set(order.clientProId, current);
    });

    return [...clients.values()].sort((first, second) => second.totalSpending - first.totalSpending);
  }

  private bestFournisseurs(): BestSellerFournisseur[] {
    const usersById = new Map(this.users().map((user) => [this.userId(user), user]));
    const suppliers = new Map<
      string,
      BestSellerFournisseur & { orderIds: Set<string> }
    >();

    this.orders()
      .filter((order) => order.orderStatus !== 'CANCELLED')
      .forEach((order) => {
        order.items.forEach((item) => {
          const user = usersById.get(item.fournisseurId);
          const current = suppliers.get(item.fournisseurId) || {
            fournisseurId: item.fournisseurId,
            fournisseurName: user?.name || `Fournisseur ${item.fournisseurId.slice(-5)}`,
            companyName: user?.companyName || '',
            totalIncome: 0,
            acceptedOrders: 0,
            productsSold: 0,
            rating: this.dashboard.fallbackSupplierRating(),
            orderIds: new Set<string>(),
          };

          current.totalIncome += item.totalPrice;
          current.productsSold += item.quantity;
          current.orderIds.add(order._id);
          current.acceptedOrders = current.orderIds.size;
          suppliers.set(item.fournisseurId, current);
        });
      });

    return [...suppliers.values()]
      .map(({ orderIds, ...supplier }) => supplier)
      .sort((first, second) => second.totalIncome - first.totalIncome);
  }

  private favoriteSupplier(orders: SupplierOrder[]): string {
    const suppliers = new Map<string, { quantity: number; spending: number }>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const current = suppliers.get(item.fournisseurId) || { quantity: 0, spending: 0 };
        current.quantity += item.quantity;
        current.spending += item.totalPrice;
        suppliers.set(item.fournisseurId, current);
      });
    });

    const best = [...suppliers.entries()].sort((first, second) => second[1].spending - first[1].spending)[0];
    if (!best) {
      return 'Non disponible';
    }

    const supplierUser = this.users().find((user) => this.userId(user) === best[0]);
    return supplierUser?.companyName || supplierUser?.name || `Fournisseur ${best[0].slice(-5)}`;
  }

  private countUsersByRole(): ChartDataPoint[] {
    return this.roles.map((role) => ({
      label: this.statusLabel(role),
      value: this.users().filter((user) => user.role === role).length,
    }));
  }

  private countOrdersByStatus(): ChartDataPoint[] {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED'];
    return statuses.map((status) => ({
      label: this.statusLabel(status),
      value: this.orders().filter((order) => order.orderStatus === status).length,
    }));
  }

  private countProductsByCategory(): ChartDataPoint[] {
    return this.categoryOptions().map((category) => ({
      label: category,
      value: this.products().filter((product) => product.category === category).length,
    }));
  }

  private withPercent(points: ChartDataPoint[]): ChartDataPoint[] {
    const max = Math.max(...points.map((point) => point.value), 1);
    return points.map((point) => ({
      ...point,
      percent: point.percent ?? (point.value ? Math.max(4, Math.round((point.value / max) * 100)) : 0),
    }));
  }

  private totalRevenue(): number {
    return this.orders().reduce((sum, order) => sum + order.totalAmount, 0);
  }

  private confirmAdminDeactivation(targetUserId: string): boolean {
    const activeAdmins = this.users().filter(
      (item) => item.role === 'ADMIN' && item.status === 'ACTIVE',
    ).length;

    if (!this.isSelf(targetUserId) || activeAdmins > 1) {
      return true;
    }

    const confirmation = window.prompt(
      'Ce compte semble etre le seul admin actif. Tapez DEACTIVATE ADMIN pour confirmer.',
    );
    return confirmation === 'DEACTIVATE ADMIN';
  }

  private isSelf(userId: string): boolean {
    return this.user()?.id === userId;
  }

  private sameUser(first: UserSummary, second: UserSummary): boolean {
    return this.userId(first) === this.userId(second);
  }

  private refreshSelections(
    users: UserSummary[],
    requests: AccountRequest[],
    products: BackendProduct[],
  ): void {
    const selectedUser = this.selectedUser();
    const selectedRequest = this.selectedRequest();
    const selectedProduct = this.selectedProduct();

    if (selectedUser) {
      this.selectedUser.set(users.find((user) => this.userId(user) === this.userId(selectedUser)) || null);
    }

    if (selectedRequest) {
      this.selectedRequest.set(
        requests.find((request) => request._id === selectedRequest._id) || null,
      );
    }

    if (selectedProduct) {
      this.selectedProduct.set(
        products.find((product) => product._id === selectedProduct._id) || null,
      );
    }
  }

  private afterAction(message: string): void {
    this.notice.set(message);
    this.loadDashboard();
  }

  private partyName(party: string | ConversationParty, fallback: string): string {
    if (typeof party === 'string') {
      return `${fallback} ${party.slice(-5).toUpperCase()}`;
    }

    return party.companyName || party.name || fallback;
  }

  private partyRole(party: string | ConversationParty): string {
    return typeof party === 'string' ? 'Utilisateur' : this.statusLabel(party.role || 'Utilisateur');
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private readApiError(error: unknown): string {
    const apiError = error as {
      error?: {
        message?: string;
        details?: { field?: string; message?: string }[];
      };
    };
    const details = apiError.error?.details;

    if (details?.length) {
      return details
        .map((item) => (item.field ? `${item.field}: ${item.message}` : item.message))
        .join(' | ');
    }

    return apiError.error?.message || '';
  }

  private resizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => reject(new Error('Image read failed'));
      reader.onload = () => {
        const image = new Image();

        image.onerror = () => reject(new Error('Image load failed'));
        image.onload = () => {
          const maxSize = 1100;
          const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(image.width * ratio);
          canvas.height = Math.round(image.height * ratio);

          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('Canvas unsupported'));
            return;
          }

          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.78));
        };

        image.src = String(reader.result || '');
      };

      reader.readAsDataURL(file);
    });
  }
}
