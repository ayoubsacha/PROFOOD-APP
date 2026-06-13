import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  CartItem,
  CartProductRef,
  CheckoutInfo,
  ClientCart,
  Conversation,
  ConversationParty,
  Message,
  OrderStatus,
  SupplierOrder,
} from '../../core/api.models';
import { AuthService } from '../../core/auth.service';
import { CartApiService } from '../../core/cart-api.service';
import { ClientDashboardService } from '../../core/client-dashboard.service';
import { FilterState } from '../../core/dashboard.models';
import { MessagingService } from '../../core/messaging.service';
import { FilterBarComponent } from '../../shared/components/dashboard/filter-bar/filter-bar.component';

type ClientTab = 'overview' | 'cart' | 'orders' | 'account' | 'inbox';

interface ChartPoint {
  label: string;
  value: number;
  percent: number;
}

@Component({
  selector: 'app-client-dashboard-page',
  imports: [FormsModule, RouterLink, FilterBarComponent],
  templateUrl: './client-dashboard-page.component.html',
  styleUrl: './client-dashboard-page.component.scss',
})
export class ClientDashboardPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly cartApi = inject(CartApiService);
  private readonly dashboard = inject(ClientDashboardService);
  private readonly messaging = inject(MessagingService);
  private readonly route = inject(ActivatedRoute);

  protected readonly user = computed(() => this.auth.currentUser());
  protected readonly activeTab = signal<ClientTab>('account');
  protected readonly sidebarOpen = signal(false);
  protected readonly cart = signal<ClientCart | null>(null);
  protected readonly orders = signal<SupplierOrder[]>([]);
  protected readonly conversations = signal<Conversation[]>([]);
  protected readonly selectedConversation = signal<Conversation | null>(null);
  protected readonly messages = signal<Message[]>([]);
  protected readonly profileImagePreview = signal('');
  protected readonly loading = signal(false);
  protected readonly notice = signal('');
  protected readonly error = signal('');
  protected readonly orderFilters = signal<FilterState>({ search: '', status: '', date: '' });
  protected readonly orderStatusOptions: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'DELIVERED',
    'CANCELLED',
  ];

  protected readonly profileForm = {
    name: '',
    email: '',
    companyName: '',
    phone: '',
    address: '',
    profileImage: '',
  };

  protected readonly passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  protected readonly paymentForm = {
    method: 'Paiement securise Profood',
  };

  protected readonly replyForm = {
    content: '',
  };

  protected readonly checkoutForm: CheckoutInfo = {
    contactName: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  };

  protected readonly tabs: { id: ClientTab; label: string }[] = [
    { id: 'account', label: 'Profile' },
    { id: 'cart', label: 'Panier' },
    { id: 'orders', label: 'Commandes' },
    { id: 'inbox', label: 'Boite de reception' },
    { id: 'overview', label: 'Charts' },
  ];
  protected readonly trackingSteps: { status: OrderStatus; label: string }[] = [
    { status: 'PENDING', label: 'En attente' },
    { status: 'CONFIRMED', label: 'Approuvee' },
    { status: 'PROCESSING', label: 'En expedition' },
    { status: 'DELIVERED', label: 'Livree' },
  ];

  protected readonly cartItems = computed(() => this.cart()?.items ?? []);
  protected readonly cartCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0),
  );
  protected readonly cartTotal = computed(() => this.cart()?.totalPrice ?? 0);
  protected readonly inboxCount = computed(() => this.conversations().length);
  protected readonly pendingOrders = computed(
    () => this.orders().filter((order) => order.orderStatus === 'PENDING').length,
  );
  protected readonly activeOrders = computed(
    () => this.orders().filter((order) => order.orderStatus !== 'CANCELLED').length,
  );
  protected readonly deliveredOrders = computed(
    () => this.orders().filter((order) => order.orderStatus === 'DELIVERED').length,
  );
  protected readonly paidTotal = computed(() =>
    this.orders().reduce(
      (sum, order) => (order.paymentStatus === 'PAID' ? sum + order.totalAmount : sum),
      0,
    ),
  );
  protected readonly monthlySpending = computed(() => {
    const now = new Date();

    return this.orders().reduce((sum, order) => {
      const createdAt = new Date(order.createdAt);

      if (
        order.orderStatus === 'CANCELLED' ||
        createdAt.getMonth() !== now.getMonth() ||
        createdAt.getFullYear() !== now.getFullYear()
      ) {
        return sum;
      }

      return sum + order.totalAmount;
    }, 0);
  });

  protected readonly favoriteSuppliers = computed(() => {
    const suppliers = new Map<
      string,
      { supplierId: string; quantity: number; orderIds: Set<string>; totalSpending: number }
    >();

    this.orders().forEach((order) => {
      const suppliersInOrder = new Set<string>();

      order.items.forEach((item) => {
        const supplier =
          suppliers.get(item.fournisseurId) ||
          {
            supplierId: item.fournisseurId,
            quantity: 0,
            orderIds: new Set<string>(),
            totalSpending: 0,
          };

        supplier.quantity += item.quantity;
        supplier.totalSpending += item.totalPrice || item.quantity * item.unitPrice;
        suppliersInOrder.add(item.fournisseurId);
        suppliers.set(item.fournisseurId, supplier);
      });

      suppliersInOrder.forEach((supplierId) => suppliers.get(supplierId)?.orderIds.add(order._id));
    });

    return [...suppliers.values()]
      .sort(
        (first, second) =>
          second.totalSpending - first.totalSpending || second.quantity - first.quantity,
      )
      .slice(0, 5)
      .map((supplier) => ({
        supplierId: supplier.supplierId,
        label: `Fournisseur ${supplier.supplierId.slice(-5).toUpperCase()}`,
        quantity: supplier.quantity,
        orderCount: supplier.orderIds.size,
        totalSpending: supplier.totalSpending,
      }));
  });

  protected readonly orderStatusChart = computed(() => {
    const counts = new Map<OrderStatus, number>();
    this.orders().forEach((order) => counts.set(order.orderStatus, (counts.get(order.orderStatus) || 0) + 1));
    return this.toChartPoints([...counts.entries()].map(([label, value]) => ({ label, value })));
  });

  protected readonly monthlySpendChart = computed(() => {
    const amounts = new Map<string, number>();
    this.orders().forEach((order) => {
      const label = this.shortMonth(order.createdAt);
      amounts.set(label, (amounts.get(label) || 0) + order.totalAmount);
    });

    return this.toChartPoints([...amounts.entries()].map(([label, value]) => ({ label, value })));
  });

  protected readonly spendingByCategoryChart = computed(() => {
    const categories = new Map<string, number>();

    this.cartItems().forEach((item) => {
      const category = this.productRef(item)?.category || 'Commandes B2B';
      categories.set(category, (categories.get(category) || 0) + this.itemTotal(item));
    });

    if (!categories.size && this.orders().length) {
      categories.set('Historique commandes', this.paidTotal());
    }

    return this.toChartPoints([...categories.entries()].map(([label, value]) => ({ label, value })));
  });

  protected readonly frequentlyPurchasedChart = computed(() => {
    const products = new Map<string, number>();

    this.orders().forEach((order) => {
      order.items.forEach((item) => {
        products.set(item.productName, (products.get(item.productName) || 0) + item.quantity);
      });
    });

    return this.toChartPoints(
      [...products.entries()]
        .sort((first, second) => second[1] - first[1])
        .slice(0, 6)
        .map(([label, value]) => ({ label, value })),
    );
  });

  protected readonly filteredOrders = computed(() => {
    const filters = this.orderFilters();
    const search = this.normalize(filters.search);

    return this.orders().filter((order) => {
      const matchesSearch =
        !search ||
        [order._id, order.orderStatus, ...order.items.map((item) => item.productName)].some((value) =>
          this.normalize(value).includes(search),
        );
      const matchesStatus = !filters.status || order.orderStatus === filters.status;
      const matchesDate = !filters.date || order.createdAt.startsWith(filters.date);
      return matchesSearch && matchesStatus && matchesDate;
    });
  });

  ngOnInit(): void {
    this.hydrateProfile();
    this.hydrateCheckout();
    this.readRequestedTab();
    this.loadDashboard();
    this.loadInbox();
  }

  protected setTab(tab: ClientTab, keepMessages = false): void {
    this.activeTab.set(tab);
    this.sidebarOpen.set(false);

    if (!keepMessages) {
      this.notice.set('');
      this.error.set('');
    }
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((isOpen) => !isOpen);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected loadDashboard(): void {
    this.loading.set(true);
    this.notice.set('');
    this.error.set('');

    let pendingRequests = 2;
    const markDone = () => {
      pendingRequests -= 1;
      if (pendingRequests === 0) {
        this.loading.set(false);
      }
    };

    this.cartApi.getCart().subscribe({
      next: (cart) => this.cart.set(cart),
      error: () => {
        this.error.set("Impossible de charger le panier.");
        markDone();
      },
      complete: markDone,
    });

    this.dashboard.getOrders().subscribe({
      next: (orders) => this.orders.set(orders),
      error: () => {
        this.error.set("Impossible de charger les commandes.");
        markDone();
      },
      complete: markDone,
    });
  }

  protected loadInbox(): void {
    this.messaging.listConversations().subscribe({
      next: (conversations) => {
        this.conversations.set(conversations);
        if (!this.selectedConversation() && conversations.length) {
          this.selectConversation(conversations[0]);
        }
      },
      error: () => {
        this.conversations.set([]);
        this.messages.set([]);
      },
    });
  }

  protected updateCartQuantity(item: CartItem, rawValue: string): void {
    const quantity = Math.max(1, Number(rawValue || 1));
    this.notice.set('');
    this.error.set('');

    this.cartApi.updateQuantity(this.productId(item), quantity).subscribe({
      next: (cart) => {
        this.cart.set(cart);
        this.notice.set('Panier mis a jour.');
      },
      error: (error) => this.error.set(this.readApiError(error) || "Quantite impossible a enregistrer."),
    });
  }

  protected removeCartItem(item: CartItem): void {
    this.notice.set('');
    this.error.set('');

    this.cartApi.removeItem(this.productId(item)).subscribe({
      next: (cart) => {
        this.cart.set(cart);
        this.notice.set('Produit retire du panier.');
      },
      error: () => this.error.set("Le produit n'a pas pu etre retire."),
    });
  }

  protected clearCart(): void {
    this.notice.set('');
    this.error.set('');

    this.cartApi.clearCart().subscribe({
      next: (cart) => {
        this.cart.set(cart);
        this.notice.set('Panier vide.');
      },
      error: () => this.error.set("Le panier n'a pas pu etre vide."),
    });
  }

  protected validateCart(): void {
    if (!this.cartItems().length) {
      this.error.set('Ajoutez au moins un produit avant de valider.');
      return;
    }

    if (!this.checkoutForm.contactName || !this.checkoutForm.phone || !this.checkoutForm.address) {
      this.error.set('Completez le contact, le telephone et l adresse avant de payer.');
      return;
    }

    this.notice.set('');
    this.error.set('');

    this.cartApi.validateCart({
      paymentInfo: this.paymentForm,
      checkoutInfo: this.checkoutForm,
    }).subscribe({
      next: (order) => {
        this.orders.update((orders) => [order, ...orders]);
        this.cart.update((cart) => (cart ? { ...cart, items: [], totalPrice: 0 } : cart));
        this.notice.set('Commande envoyee aux fournisseurs.');
        this.setTab('orders', true);
      },
      error: (error) => this.error.set(this.readApiError(error) || "La commande n'a pas pu etre validee."),
    });
  }

  protected reorder(order: SupplierOrder): void {
    if (!order.items.length) {
      return;
    }

    forkJoin(order.items.map((item) => this.cartApi.addItem(item.productId, item.quantity))).subscribe({
      next: (carts) => {
        const latestCart = carts[carts.length - 1];
        if (latestCart) {
          this.cart.set(latestCart);
        }
        this.notice.set('Commande ajoutee au panier.');
        this.setTab('cart', true);
      },
      error: () => this.error.set("La commande n'a pas pu etre ajoutee au panier."),
    });
  }

  protected setOrderFilters(filters: FilterState): void {
    this.orderFilters.set(filters);
  }

  protected saveProfile(): void {
    this.notice.set('');
    this.error.set('');

    this.auth.updateProfile(this.profileForm).subscribe({
      next: () => this.notice.set('Profil mis a jour.'),
      error: () => this.error.set("Le profil n'a pas pu etre mis a jour."),
    });
  }

  protected updateProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.error.set('Choisissez une image valide.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.profileForm.profileImage = String(reader.result || '');
      this.profileImagePreview.set(this.profileForm.profileImage);
    };
    reader.readAsDataURL(file);
  }

  protected removeProfileImage(): void {
    this.profileForm.profileImage = '';
    this.profileImagePreview.set('');
  }

  protected changePassword(): void {
    this.notice.set('');
    this.error.set('');

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.error.set('Confirmez le meme nouveau mot de passe.');
      return;
    }

    if (this.passwordForm.newPassword.length < 8) {
      this.error.set('Le nouveau mot de passe doit contenir au moins 8 caracteres.');
      return;
    }

    this.auth.changePassword({
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword,
    }).subscribe({
      next: () => {
        this.passwordForm.currentPassword = '';
        this.passwordForm.newPassword = '';
        this.passwordForm.confirmPassword = '';
        this.notice.set('Mot de passe modifie.');
      },
      error: () => this.error.set("Le mot de passe n'a pas pu etre modifie."),
    });
  }

  protected toggleAccountStatus(): void {
    const currentStatus = this.user()?.status || 'ACTIVE';
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    this.notice.set('');
    this.error.set('');

    this.auth.updateAccountStatus(nextStatus).subscribe({
      next: () =>
        this.notice.set(
          nextStatus === 'ACTIVE' ? 'Compte active.' : 'Compte desactive. Vous pouvez le reactiver ici.',
        ),
      error: () => this.error.set("Le statut du compte n'a pas pu etre modifie."),
    });
  }

  protected selectConversation(conversation: Conversation): void {
    this.selectedConversation.set(conversation);
    this.messaging.listMessages(conversation._id).subscribe({
      next: (messages) => this.messages.set(messages),
      error: () => this.messages.set([]),
    });
  }

  protected sendReply(): void {
    const conversation = this.selectedConversation();
    const content = this.replyForm.content.trim();

    if (!conversation || !content) {
      return;
    }

    this.messaging.sendMessage(conversation._id, content).subscribe({
      next: (message) => {
        this.messages.update((messages) => [...messages, message]);
        this.replyForm.content = '';
        this.loadInbox();
      },
      error: () => this.error.set("Le message n'a pas pu etre envoye."),
    });
  }

  protected logout(): void {
    this.auth.logout();
  }

  protected conversationTitle(conversation: Conversation): string {
    return this.partyName(conversation.fournisseurId) || 'Fournisseur';
  }

  protected conversationSubtitle(conversation: Conversation): string {
    const partner = this.party(conversation.fournisseurId);
    return partner?.email || conversation.lastMessage || 'Conversation fournisseur';
  }

  protected messageSender(message: Message): string {
    return this.partyName(message.senderId) || 'Utilisateur';
  }

  protected productId(item: CartItem): string {
    return typeof item.productId === 'string' ? item.productId : item.productId._id;
  }

  protected productName(item: CartItem): string {
    return typeof item.productId === 'string' ? 'Produit du panier' : item.productId.name;
  }

  protected productImage(item: CartItem): string {
    return this.productRef(item)?.image || '/assets/business-hero.png';
  }

  protected productSlug(item: CartItem): string | null {
    return this.productRef(item)?.slug || this.productRef(item)?._id || null;
  }

  protected productSupplier(item: CartItem): string {
    return this.productRef(item)?.fournisseurName || 'Fournisseur Profood';
  }

  protected productStock(item: CartItem): string {
    const stockQuantity = this.productRef(item)?.stockQuantity;
    return typeof stockQuantity === 'number' ? `${stockQuantity} en stock` : 'Stock verifie';
  }

  protected itemTotal(item: CartItem): number {
    return item.quantity * item.unitPrice;
  }

  protected money(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      maximumFractionDigits: 2,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
  }

  protected dateText(value: string): string {
    return new Intl.DateTimeFormat('fr-MA', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  protected statusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      CONFIRMED: 'Approuvee',
      PROCESSING: 'Preparation',
      DELIVERED: 'Livree',
      CANCELLED: 'Refusee',
      PAID: 'Payee',
      FAILED: 'Echec',
      ACTIVE: 'Actif',
      SUSPENDED: 'Desactive',
    };

    return labels[status] || status;
  }

  protected isTrackingStepReached(order: SupplierOrder, step: OrderStatus): boolean {
    if (order.orderStatus === 'CANCELLED') {
      return false;
    }

    return this.statusRank(order.orderStatus) >= this.statusRank(step);
  }

  private productRef(item: CartItem): CartProductRef | null {
    return typeof item.productId === 'string' ? null : item.productId;
  }

  private hydrateProfile(): void {
    const user = this.user();

    if (!user) {
      return;
    }

    this.profileForm.name = user.name || '';
    this.profileForm.email = user.email || '';
    this.profileForm.companyName = user.companyName || '';
    this.profileForm.phone = user.phone || '';
    this.profileForm.address = user.address || '';
    this.profileForm.profileImage = user.profileImage || '';
    this.profileImagePreview.set(user.profileImage || '');
  }

  private hydrateCheckout(): void {
    const user = this.user();

    if (!user) {
      return;
    }

    this.checkoutForm.contactName = user.name || '';
    this.checkoutForm.companyName = user.companyName || '';
    this.checkoutForm.email = user.email || '';
    this.checkoutForm.phone = user.phone || '';
    this.checkoutForm.address = user.address || '';
    this.checkoutForm.city = this.readCity(user.address || '');
  }

  private readRequestedTab(): void {
    const requestedTab = this.route.snapshot.queryParamMap.get('tab') as ClientTab | null;
    const allowedTabs: ClientTab[] = ['overview', 'cart', 'orders', 'account', 'inbox'];

    if (requestedTab && allowedTabs.includes(requestedTab)) {
      this.activeTab.set(requestedTab);
    }
  }

  private readCity(address: string): string {
    return address.split(',').map((part) => part.trim()).filter(Boolean)[0] || '';
  }

  private statusRank(status: OrderStatus): number {
    const order: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED'];
    return order.indexOf(status);
  }

  private shortMonth(value: string): string {
    return new Intl.DateTimeFormat('fr-MA', { month: 'short' }).format(new Date(value));
  }

  private party(value: string | ConversationParty): ConversationParty | null {
    return typeof value === 'string' ? null : value;
  }

  private partyName(value: string | ConversationParty): string {
    const party = this.party(value);
    return party?.companyName || party?.name || '';
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private toChartPoints(points: { label: string; value: number }[]): ChartPoint[] {
    const max = Math.max(...points.map((point) => point.value), 1);

    return points.map((point) => ({
      ...point,
      percent: Math.max(4, Math.round((point.value / max) * 100)),
    }));
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
}
