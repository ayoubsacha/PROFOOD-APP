import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, of, switchMap } from 'rxjs';
import {
  BackendProduct,
  Conversation,
  ConversationParty,
  Message,
  NotificationItem,
  OrderStatus,
  SupplierOrder,
} from '../../core/api.models';
import { AuthService } from '../../core/auth.service';
import { FilterState } from '../../core/dashboard.models';
import {
  BestClient,
  BestProduct,
  FournisseurDashboardService,
  FournisseurOrder,
  FournisseurProfile,
  FournisseurStats,
  InboxMessage,
  MonthlyIncomePoint,
  ProductPayload,
  StockItem,
} from '../../core/fournisseur-dashboard.service';
import { MessagingService } from '../../core/messaging.service';
import { NotificationService } from '../../core/notification.service';
import { FilterBarComponent } from '../../shared/components/dashboard/filter-bar/filter-bar.component';

type FournisseurSection = 'profile' | 'stock' | 'commandes' | 'inbox' | 'charts';

interface ProductEditorForm {
  name: string;
  price: number;
  image: string;
  category: string;
  type: string;
  stockQuantity: number;
  unit: string;
  description: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ReplyForm {
  content: string;
}

interface SidebarSection {
  id: FournisseurSection;
  label: string;
}

interface SectionCopy {
  eyebrow: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-fournisseur-dashboard-page',
  imports: [FormsModule, FilterBarComponent],
  templateUrl: './fournisseur-dashboard-page.component.html',
  styleUrl: './fournisseur-dashboard-page.component.scss',
})
export class FournisseurDashboardPageComponent implements OnInit {
  private readonly dashboard = inject(FournisseurDashboardService);
  private readonly auth = inject(AuthService);
  private readonly messaging = inject(MessagingService);
  private readonly notificationsApi = inject(NotificationService);

  protected readonly user = computed(() => this.auth.currentUser());
  protected readonly activeSection = signal<FournisseurSection>('profile');
  protected readonly sidebarOpen = signal(false);
  protected readonly loading = signal(false);
  protected readonly inboxLoading = signal(false);
  protected readonly notice = signal('');
  protected readonly error = signal('');

  protected readonly stockItems = signal<StockItem[]>([]);
  protected readonly orders = signal<FournisseurOrder[]>([]);
  protected readonly conversations = signal<Conversation[]>([]);
  protected readonly selectedConversation = signal<Conversation | null>(null);
  protected readonly messages = signal<Message[]>([]);
  protected readonly notifications = signal<NotificationItem[]>([]);
  protected readonly notificationPanelOpen = signal(false);
  protected readonly selectedOrder = signal<FournisseurOrder | null>(null);
  protected readonly editingProductId = signal<string | null>(null);
  protected readonly productImagePreview = signal('');
  protected readonly profileImagePreview = signal('');
  protected readonly rating = signal(4.7);

  protected readonly productFilters = signal<FilterState>({ search: '', status: '', date: '' });
  protected readonly orderFilters = signal<FilterState>({ search: '', status: '', date: '' });

  protected readonly productStatusOptions: string[] = ['ACTIVE', 'OUT_OF_STOCK', 'DISABLED'];
  protected readonly orderStatusOptions: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'DELIVERED',
    'CANCELLED',
  ];

  protected readonly sections: SidebarSection[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'stock', label: 'Stock' },
    { id: 'commandes', label: 'Commandes' },
    { id: 'inbox', label: 'Boite de reception' },
    { id: 'charts', label: 'Charts' },
  ];

  protected readonly sectionCopy: Record<FournisseurSection, SectionCopy> = {
    profile: {
      eyebrow: 'Fournisseur',
      title: 'Profile',
      description: 'Coordonnees, mot de passe et gestion du compte fournisseur.',
    },
    stock: {
      eyebrow: 'Catalogue',
      title: 'Stock',
      description: 'Produits et services appartenant au fournisseur connecte.',
    },
    commandes: {
      eyebrow: 'Operations',
      title: 'Commandes',
      description: 'Commandes acceptees, nouvelles demandes et details de suivi.',
    },
    inbox: {
      eyebrow: 'Messages',
      title: 'Boite de reception',
      description: 'Echanges entre clients professionnels et fournisseur.',
    },
    charts: {
      eyebrow: 'Charts',
      title: 'Statistiques',
      description: 'Performance commerciale, revenus et meilleurs clients.',
    },
  };

  protected readonly productForm: ProductEditorForm = {
    name: '',
    price: 0,
    image: '',
    category: '',
    type: '',
    stockQuantity: 0,
    unit: 'unite',
    description: '',
  };

  protected readonly profileForm: FournisseurProfile = {
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    companyAddress: '',
    specialty: '',
    profileImage: '',
  };

  protected readonly passwordForm: PasswordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  protected readonly replyForm: ReplyForm = {
    content: '',
  };

  protected readonly currentSectionCopy = computed(() => this.sectionCopy[this.activeSection()]);
  protected readonly unreadNotifications = computed(
    () => this.notifications().filter((notification) => !notification.read).length,
  );

  protected readonly filteredStockItems = computed(() => {
    const filters = this.productFilters();
    const search = this.normalize(filters.search);

    return this.stockItems().filter((product) => {
      const searchableValues = [
        product.name,
        product.category,
        product.type || '',
        product.unit,
        product.description,
      ];
      const matchesSearch =
        !search || searchableValues.some((value) => this.normalize(value).includes(search));
      const matchesStatus = !filters.status || product.status === filters.status;
      return matchesSearch && matchesStatus;
    });
  });

  protected readonly filteredOrders = computed(() => {
    const filters = this.orderFilters();
    const search = this.normalize(filters.search);

    return this.orders().filter((order) => {
      const productNames = order.items.map((item) => item.productName);
      const matchesSearch =
        !search ||
        [order._id, order.orderNumber, order.clientName, order.orderStatus, ...productNames].some(
          (value) => this.normalize(value).includes(search),
        );
      const matchesStatus = !filters.status || order.orderStatus === filters.status;
      const matchesDate = !filters.date || order.createdAt.startsWith(filters.date);
      return matchesSearch && matchesStatus && matchesDate;
    });
  });

  protected readonly pendingOrders = computed(() =>
    this.filteredOrders().filter((order) => order.orderStatus === 'PENDING'),
  );

  protected readonly acceptedOrders = computed(() =>
    this.orders().filter((order) =>
      ['CONFIRMED', 'PROCESSING', 'DELIVERED'].includes(order.orderStatus),
    ),
  );

  protected readonly stats = computed<FournisseurStats>(() => {
    const orders = this.orders();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const validOrders = orders.filter((order) => order.orderStatus !== 'CANCELLED');
    const monthlyOrders = validOrders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
    });

    return {
      totalProducts: this.stockItems().length,
      totalProductsSold: validOrders.reduce(
        (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
        0,
      ),
      activeProducts: this.stockItems().filter((product) => product.status === 'ACTIVE').length,
      outOfStockProducts: this.stockItems().filter(
        (product) => product.stockStatus === 'OUT_OF_STOCK',
      ).length,
      totalOrders: orders.length,
      monthlyIncome: monthlyOrders.reduce((sum, order) => sum + order.supplierTotal, 0),
      totalIncome: validOrders.reduce((sum, order) => sum + order.supplierTotal, 0),
      rating: this.rating(),
    };
  });

  protected readonly bestProducts = computed<BestProduct[]>(() => {
    const imagesByProductId = new Map(this.stockItems().map((product) => [product._id, product.image]));
    const sales = new Map<string, BestProduct>();

    this.orders()
      .filter((order) => order.orderStatus !== 'CANCELLED')
      .forEach((order) => {
        order.items.forEach((item) => {
          const current = sales.get(item.productId) || {
            productId: item.productId,
            productName: item.productName,
            image: imagesByProductId.get(item.productId),
            unitsSold: 0,
            revenue: 0,
          };

          current.unitsSold += item.quantity;
          current.revenue += item.totalPrice;
          sales.set(item.productId, current);
        });
      });

    return [...sales.values()].sort((first, second) => second.revenue - first.revenue).slice(0, 6);
  });

  protected readonly monthlyIncomeChart = computed<MonthlyIncomePoint[]>(() => {
    const now = new Date();
    const buckets: { key: string; label: string; income: number }[] = [];

    for (let offset = 11; offset >= 0; offset -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      buckets.push({
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: new Intl.DateTimeFormat('fr-MA', { month: 'short' }).format(date),
        income: 0,
      });
    }

    this.orders()
      .filter((order) => order.orderStatus !== 'CANCELLED')
      .forEach((order) => {
        const createdAt = new Date(order.createdAt);
        const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
        const bucket = buckets.find((item) => item.key === key);

        if (bucket) {
          bucket.income += order.supplierTotal;
        }
      });

    const maxIncome = Math.max(...buckets.map((bucket) => bucket.income), 1);
    return buckets.map((bucket) => ({
      month: bucket.label,
      income: bucket.income,
      percent: bucket.income ? Math.max(4, Math.round((bucket.income / maxIncome) * 100)) : 0,
    }));
  });

  protected readonly bestClients = computed<BestClient[]>(() => {
    const clients = new Map<string, BestClient>();

    this.orders()
      .filter((order) => order.orderStatus !== 'CANCELLED')
      .forEach((order) => {
        const current = clients.get(order.clientProId) || {
          clientId: order.clientProId,
          clientName: order.clientName,
          orderCount: 0,
          totalSpending: 0,
          lastOrderDate: order.createdAt,
        };

        current.orderCount += 1;
        current.totalSpending += order.supplierTotal;

        if (new Date(order.createdAt) > new Date(current.lastOrderDate)) {
          current.lastOrderDate = order.createdAt;
        }

        clients.set(order.clientProId, current);
      });

    return [...clients.values()]
      .sort((first, second) => second.totalSpending - first.totalSpending)
      .slice(0, 5);
  });

  protected readonly inboxPreview = computed<InboxMessage[]>(() =>
    this.conversations()
      .slice(0, 3)
      .map((conversation) => ({
        id: conversation._id,
        conversationId: conversation._id,
        clientName: this.conversationTitle(conversation),
        subject: 'Discussion client',
        preview: conversation.lastMessage || this.conversationSubtitle(conversation),
        date: conversation.updatedAt || conversation.createdAt || '',
        unread: this.conversationHasUnread(conversation),
      })),
  );

  ngOnInit(): void {
    this.hydrateProfile();
    this.loadProfileExtras();
    this.loadDashboard();
    this.loadInbox();
    this.loadNotifications();
  }

  protected setSection(section: FournisseurSection): void {
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

    forkJoin({
      products: this.dashboard.getProducts(),
      orders: this.dashboard.getOrders(),
      rating: this.dashboard.getSupplierRating(),
    }).subscribe({
      next: ({ products, orders, rating }) => {
        this.stockItems.set(products.map((product) => this.dashboard.toStockItem(product)));
        this.orders.set(orders.map((order) => this.dashboard.toSupplierOrder(order)));
        this.rating.set(rating);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set(this.readApiError(error) || 'Impossible de charger le dashboard fournisseur.');
      },
    });
  }

  protected loadInbox(): void {
    this.inboxLoading.set(true);

    this.messaging.listConversations().subscribe({
      next: (conversations) => {
        this.conversations.set(conversations);
        this.inboxLoading.set(false);

        const selected = this.selectedConversation();
        if (!selected && conversations.length) {
          this.selectConversation(conversations[0]);
          return;
        }

        if (selected) {
          const freshConversation =
            conversations.find((conversation) => conversation._id === selected._id) || null;
          this.selectedConversation.set(freshConversation);

          if (freshConversation) {
            this.loadMessages(freshConversation._id);
          } else {
            this.messages.set([]);
          }
        }
      },
      error: () => {
        this.inboxLoading.set(false);
        this.error.set("Impossible de charger la boite de reception fournisseur.");
      },
    });
  }

  protected loadNotifications(): void {
    this.notificationsApi.getNotifications().subscribe({
      next: (notifications) => this.notifications.set(notifications),
      error: () => this.notifications.set([]),
    });
  }

  protected saveProduct(): void {
    this.notice.set('');
    this.error.set('');

    if (!this.productForm.name.trim() || !this.productForm.category.trim()) {
      this.error.set('Le nom et la categorie sont obligatoires.');
      return;
    }

    const editingId = this.editingProductId();
    const payload = this.buildProductPayload();

    if (editingId) {
      const { stockQuantity, ...updatePayload } = payload;

      this.dashboard
        .updateProduct(editingId, updatePayload)
        .pipe(switchMap(() => this.dashboard.updateStock(editingId, stockQuantity)))
        .subscribe({
          next: (product) => {
            this.replaceProduct(product, 'Produit mis a jour.');
            this.resetProductForm();
          },
          error: (error) =>
            this.error.set(this.readApiError(error) || "Le produit n'a pas pu etre mis a jour."),
        });

      return;
    }

    this.dashboard.createProduct(payload).subscribe({
      next: (product) => {
        this.stockItems.update((products) => [this.dashboard.toStockItem(product), ...products]);
        this.notice.set('Produit ajoute au stock fournisseur.');
        this.resetProductForm();
      },
      error: (error) =>
        this.error.set(this.readApiError(error) || "Le produit n'a pas pu etre ajoute."),
    });
  }

  protected editProduct(product: StockItem): void {
    this.editingProductId.set(product._id);
    this.productForm.name = product.name;
    this.productForm.price = product.price;
    this.productForm.image = product.image || '';
    this.productForm.category = product.category;
    this.productForm.type = product.type || '';
    this.productForm.stockQuantity = product.stockQuantity;
    this.productForm.unit = product.unit;
    this.productForm.description = product.description;
    this.productImagePreview.set(product.image || '');
    this.notice.set('');
    this.error.set('');
  }

  protected cancelProductEdit(): void {
    this.resetProductForm();
  }

  protected importProductImage(event: Event): void {
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
        this.productForm.image = image;
        this.productImagePreview.set(image);
        this.error.set('');
      })
      .catch(() => this.error.set("L'image du produit n'a pas pu etre importee."));
  }

  protected updateStock(product: StockItem, rawValue: string): void {
    const stockQuantity = Math.max(0, Number(rawValue || 0));

    this.dashboard.updateStock(product._id, stockQuantity).subscribe({
      next: (updatedProduct) => this.replaceProduct(updatedProduct, 'Stock mis a jour.'),
      error: (error) =>
        this.error.set(this.readApiError(error) || "Le stock n'a pas pu etre mis a jour."),
    });
  }

  protected activateProduct(product: StockItem): void {
    if (product.stockQuantity <= 0) {
      this.error.set('Ajoutez du stock avant d activer ce produit.');
      return;
    }

    this.dashboard.activateProduct(product._id).subscribe({
      next: (updatedProduct) => this.replaceProduct(updatedProduct, 'Produit active.'),
      error: (error) =>
        this.error.set(this.readApiError(error) || "Le produit n'a pas pu etre active."),
    });
  }

  protected deactivateProduct(product: StockItem): void {
    const confirmed = window.confirm(`Desactiver ${product.name} ?`);

    if (!confirmed) {
      return;
    }

    this.dashboard.deactivateProduct(product._id).subscribe({
      next: (updatedProduct) => this.replaceProduct(updatedProduct, 'Produit desactive.'),
      error: (error) =>
        this.error.set(this.readApiError(error) || "Le produit n'a pas pu etre desactive."),
    });
  }

  protected deleteProduct(product: StockItem): void {
    const confirmed = window.confirm(`Supprimer ${product.name} du stock fournisseur ?`);

    if (!confirmed) {
      return;
    }

    this.dashboard.deleteProduct(product._id).subscribe({
      next: () => {
        this.stockItems.update((products) => products.filter((item) => item._id !== product._id));
        this.notice.set('Produit supprime du stock fournisseur.');
      },
      error: (error) =>
        this.error.set(this.readApiError(error) || "Le produit n'a pas pu etre supprime."),
    });
  }

  protected updateOrder(order: FournisseurOrder, orderStatus: OrderStatus): void {
    if (orderStatus === 'CANCELLED') {
      const confirmed = window.confirm(`Refuser la commande ${order.orderNumber} ?`);

      if (!confirmed) {
        return;
      }
    }

    this.dashboard.updateOrderStatus(order._id, orderStatus).subscribe({
      next: (updatedOrder) => {
        this.replaceOrder(updatedOrder);
        this.notice.set('Commande mise a jour.');
      },
      error: (error) =>
        this.error.set(this.readApiError(error) || "La commande n'a pas pu etre modifiee."),
    });
  }

  protected viewOrderDetails(order: FournisseurOrder): void {
    this.selectedOrder.set(order);
  }

  protected setProductFilters(filters: FilterState): void {
    this.productFilters.set(filters);
  }

  protected setOrderFilters(filters: FilterState): void {
    this.orderFilters.set(filters);
  }

  protected saveProfile(): void {
    const user = this.user();

    if (!user) {
      this.error.set('Session fournisseur introuvable.');
      return;
    }

    this.notice.set('');
    this.error.set('');

    this.auth
      .updateProfile({
        name: this.profileForm.fullName.trim(),
        companyName: this.profileForm.companyName.trim(),
        phone: this.profileForm.phone.trim(),
        address: this.profileForm.companyAddress.trim(),
        profileImage: this.profileForm.profileImage,
      })
      .pipe(
        switchMap(() =>
          this.dashboard.saveProfileExtras(user.id, {
            email: this.profileForm.email.trim(),
            specialty: this.profileForm.specialty.trim(),
          }),
        ),
      )
      .subscribe({
        next: () => this.notice.set('Profil fournisseur mis a jour.'),
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

  protected toggleAccountStatus(): void {
    const user = this.user();

    if (!user) {
      return;
    }

    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';

    if (nextStatus === 'SUSPENDED' && !window.confirm('Desactiver ce compte fournisseur ?')) {
      return;
    }

    this.auth.updateAccountStatus(nextStatus).subscribe({
      next: () =>
        this.notice.set(
          nextStatus === 'ACTIVE' ? 'Compte fournisseur active.' : 'Compte fournisseur desactive.',
        ),
      error: (error) =>
        this.error.set(this.readApiError(error) || "Le statut du compte n'a pas pu etre modifie."),
    });
  }

  protected selectConversation(conversation: Conversation): void {
    this.selectedConversation.set(conversation);
    this.replyForm.content = '';
    this.loadMessages(conversation._id);
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
        this.conversations.update((conversations) =>
          conversations.map((item) =>
            item._id === conversation._id
              ? { ...item, lastMessage: message.content, updatedAt: message.createdAt }
              : item,
          ),
        );
        this.replyForm.content = '';
        this.notice.set('Reponse envoyee.');
        this.loadNotifications();
      },
      error: (error) =>
        this.error.set(this.readApiError(error) || "Le message n'a pas pu etre envoye."),
    });
  }

  protected toggleNotificationPanel(): void {
    this.notificationPanelOpen.update((open) => !open);
  }

  protected openNotification(notification: NotificationItem): void {
    const openInbox = () => {
      this.notificationPanelOpen.set(false);
      this.setSection('inbox');
      this.loadInbox();
    };

    if (notification.read) {
      openInbox();
      return;
    }

    this.notificationsApi.markAsRead(notification._id).subscribe({
      next: (updatedNotification) => {
        this.notifications.update((notifications) =>
          notifications.map((item) =>
            item._id === updatedNotification._id ? updatedNotification : item,
          ),
        );
        openInbox();
      },
      error: openInbox,
    });
  }

  protected markAllNotificationsRead(): void {
    this.notificationsApi.markAllAsRead().subscribe({
      next: () =>
        this.notifications.update((notifications) =>
          notifications.map((notification) => ({ ...notification, read: true })),
        ),
    });
  }

  protected logout(): void {
    this.auth.logout();
  }

  protected statusLabel(status: string): string {
    const labels: Record<string, string> = {
      ACTIVE: 'Actif',
      OUT_OF_STOCK: 'Rupture',
      DISABLED: 'Inactif',
      PENDING: 'En attente',
      CONFIRMED: 'Acceptee',
      PROCESSING: 'Expediee',
      DELIVERED: 'Livree',
      CANCELLED: 'Refusee / Annulee',
      PAID: 'Payee',
      FAILED: 'Echec',
      SUSPENDED: 'Desactive',
      REFUSED: 'Refuse',
    };

    return labels[status] || status;
  }

  protected stockStatusLabel(status: StockItem['stockStatus']): string {
    const labels: Record<StockItem['stockStatus'], string> = {
      IN_STOCK: 'En stock',
      LOW_STOCK: 'Stock faible',
      OUT_OF_STOCK: 'Rupture de stock',
    };

    return labels[status];
  }

  protected money(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      maximumFractionDigits: 2,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
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

  protected productImage(product: StockItem | BestProduct): string {
    return product.image || '/assets/business-hero.png';
  }

  protected conversationTitle(conversation: Conversation): string {
    return this.partyName(conversation.clientProId, 'Client');
  }

  protected conversationSubtitle(conversation: Conversation): string {
    const date = conversation.updatedAt || conversation.createdAt;
    return conversation.productName || (date ? `Dernier message ${this.dateText(date)}` : 'Conversation client');
  }

  protected conversationMeta(conversation: Conversation): string {
    return conversation.subject || conversation.lastMessage || 'Message client';
  }

  protected selectedConversationTitle(): string {
    const conversation = this.selectedConversation();
    return conversation ? this.conversationTitle(conversation) : 'Conversation';
  }

  protected messageSender(message: Message): string {
    return this.partyId(message.senderId) === this.user()?.id
      ? 'Vous'
      : this.partyName(message.senderId, 'Client');
  }

  protected isOwnMessage(message: Message): boolean {
    return this.partyId(message.senderId) === this.user()?.id;
  }

  protected messageContext(message: Message): string {
    const parts = [message.productName, message.subject].filter(Boolean);
    return parts.length ? parts.join(' - ') : '';
  }

  protected conversationHasUnread(conversation: Conversation): boolean {
    return Boolean(conversation.unreadCount) || this.messages().some(
      (message) => !message.isRead && this.partyId(message.senderId) !== this.user()?.id,
    );
  }

  protected orderQuantity(order: FournisseurOrder): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  private loadMessages(conversationId: string): void {
    this.inboxLoading.set(true);

    this.messaging.getConversation(conversationId).subscribe({
      next: (thread) => {
        this.selectedConversation.set(thread.conversation);
        this.messages.set(thread.messages);
        this.inboxLoading.set(false);
        this.messaging.markConversationAsRead(conversationId).subscribe({
          next: () => {
            this.messages.update((messages) =>
              messages.map((message) =>
                this.isOwnMessage(message) ? message : { ...message, isRead: true, status: 'read' },
              ),
            );
            this.conversations.update((conversations) =>
              conversations.map((item) =>
                item._id === conversationId ? { ...item, unreadCount: 0 } : item,
              ),
            );
            this.loadNotifications();
          },
        });
      },
      error: () => {
        this.messages.set([]);
        this.inboxLoading.set(false);
        this.error.set("Impossible de charger les messages de cette conversation.");
      },
    });
  }

  private hydrateProfile(): void {
    const user = this.user();

    if (!user) {
      return;
    }

    this.profileForm.fullName = user.name || '';
    this.profileForm.email = user.email || '';
    this.profileForm.phone = user.phone || '';
    this.profileForm.companyName = user.companyName || '';
    this.profileForm.companyAddress = user.address || '';
    this.profileForm.profileImage = user.profileImage || '';
    this.profileImagePreview.set(user.profileImage || '');
  }

  private loadProfileExtras(): void {
    const user = this.user();

    if (!user) {
      return;
    }

    this.dashboard.getProfileExtras(user.id).subscribe({
      next: (extras) => {
        this.profileForm.email = extras.email || user.email || '';
        this.profileForm.specialty = extras.specialty || '';
      },
    });
  }

  private buildProductPayload(): ProductPayload {
    return {
      name: this.productForm.name.trim(),
      price: Number(this.productForm.price || 0),
      image: this.productForm.image,
      category: this.productForm.category.trim(),
      type: this.productForm.type.trim(),
      stockQuantity: Math.max(0, Number(this.productForm.stockQuantity || 0)),
      characteristics: {
        unit: this.productForm.unit.trim() || 'unite',
        description: this.productForm.description.trim(),
      },
    };
  }

  private replaceProduct(product: BackendProduct, message: string): void {
    const stockItem = this.dashboard.toStockItem(product);
    this.stockItems.update((products) =>
      products.map((item) => (item._id === stockItem._id ? stockItem : item)),
    );
    this.notice.set(message);
  }

  private replaceOrder(order: SupplierOrder): void {
    const supplierOrder = this.dashboard.toSupplierOrder(order);
    this.orders.update((orders) =>
      orders.map((item) => (item._id === supplierOrder._id ? supplierOrder : item)),
    );

    if (this.selectedOrder()?._id === supplierOrder._id) {
      this.selectedOrder.set(supplierOrder);
    }
  }

  private resetProductForm(): void {
    this.editingProductId.set(null);
    this.productForm.name = '';
    this.productForm.price = 0;
    this.productForm.image = '';
    this.productForm.category = '';
    this.productForm.type = '';
    this.productForm.stockQuantity = 0;
    this.productForm.unit = 'unite';
    this.productForm.description = '';
    this.productImagePreview.set('');
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private partyId(party: string | ConversationParty): string {
    return typeof party === 'string' ? party : party._id;
  }

  private partyName(party: string | ConversationParty, fallback: string): string {
    if (typeof party === 'string') {
      return `${fallback} ${party.slice(-5).toUpperCase()}`;
    }

    return party.companyName || party.name || fallback;
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
