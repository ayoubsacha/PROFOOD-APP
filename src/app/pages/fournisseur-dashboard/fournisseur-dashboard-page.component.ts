import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { BackendProduct, OrderStatus, SupplierOrder } from '../../core/api.models';
import {
  FournisseurDashboardService,
  ProductPayload,
} from '../../core/fournisseur-dashboard.service';

type DashboardTab = 'overview' | 'stock' | 'orders' | 'account';

interface ChartPoint {
  label: string;
  value: number;
  percent: number;
}

@Component({
  selector: 'app-fournisseur-dashboard-page',
  imports: [FormsModule],
  templateUrl: './fournisseur-dashboard-page.component.html',
  styleUrl: './fournisseur-dashboard-page.component.scss',
})
export class FournisseurDashboardPageComponent implements OnInit {
  private readonly dashboard = inject(FournisseurDashboardService);
  private readonly auth = inject(AuthService);

  protected readonly user = computed(() => this.auth.currentUser());
  protected readonly activeTab = signal<DashboardTab>('overview');
  protected readonly products = signal<BackendProduct[]>([]);
  protected readonly orders = signal<SupplierOrder[]>([]);
  protected readonly loading = signal(false);
  protected readonly notice = signal('');
  protected readonly error = signal('');

  protected readonly productForm: ProductPayload = {
    name: '',
    price: 0,
    image: '',
    category: '',
    type: '',
    stockQuantity: 0,
    characteristics: {
      unit: 'kg',
      description: '',
    },
  };

  protected readonly profileForm = {
    name: '',
    companyName: '',
    phone: '',
    address: '',
  };

  protected readonly passwordForm = {
    currentPassword: '',
    newPassword: '',
  };
  protected readonly imagePreview = signal('');

  protected readonly tabs: { id: DashboardTab; label: string }[] = [
    { id: 'overview', label: "Vue d'ensemble" },
    { id: 'stock', label: 'Stock' },
    { id: 'orders', label: 'Commandes' },
    { id: 'account', label: 'Compte' },
  ];

  protected readonly totalRevenue = computed(() =>
    this.orders().reduce((sum, order) => {
      if (order.orderStatus === 'CANCELLED') {
        return sum;
      }

      return sum + this.orderSupplierTotal(order);
    }, 0),
  );

  protected readonly paidRevenue = computed(() =>
    this.orders().reduce((sum, order) => {
      if (order.paymentStatus !== 'PAID' || order.orderStatus === 'CANCELLED') {
        return sum;
      }

      return sum + this.orderSupplierTotal(order);
    }, 0),
  );

  protected readonly pendingOrders = computed(
    () => this.orders().filter((order) => order.orderStatus === 'PENDING').length,
  );

  protected readonly lowStockProducts = computed(() =>
    this.products().filter((product) => product.stockQuantity <= 10 && product.status !== 'DISABLED'),
  );

  protected readonly activeProducts = computed(
    () => this.products().filter((product) => product.status === 'ACTIVE').length,
  );

  protected readonly orderStatusChart = computed(() => {
    const counts = new Map<OrderStatus, number>();
    this.orders().forEach((order) => counts.set(order.orderStatus, (counts.get(order.orderStatus) || 0) + 1));
    return this.toChartPoints([...counts.entries()].map(([label, value]) => ({ label, value })));
  });

  protected readonly monthlyRevenueChart = computed(() => {
    const revenue = new Map<string, number>();

    this.orders().forEach((order) => {
      if (order.orderStatus === 'CANCELLED') {
        return;
      }

      const label = this.shortMonth(order.createdAt);
      revenue.set(label, (revenue.get(label) || 0) + this.orderSupplierTotal(order));
    });

    return this.toChartPoints([...revenue.entries()].map(([label, value]) => ({ label, value })));
  });

  protected readonly stockChart = computed(() => {
    const points = this.products()
      .filter((product) => product.status !== 'DISABLED')
      .slice(0, 8)
      .map((product) => ({ label: product.name, value: product.stockQuantity }));

    return this.toChartPoints(points);
  });

  ngOnInit(): void {
    this.hydrateProfile();
    this.loadDashboard();
  }

  protected setTab(tab: DashboardTab): void {
    this.activeTab.set(tab);
    this.notice.set('');
    this.error.set('');
  }

  protected loadDashboard(): void {
    this.loading.set(true);
    this.error.set('');

    this.dashboard.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Impossible de charger le stock fournisseur.');
      },
    });

    this.dashboard.getOrders().subscribe({
      next: (orders) => this.orders.set(orders),
      error: () => this.error.set('Impossible de charger les commandes fournisseur.'),
    });
  }

  protected createProduct(): void {
    this.notice.set('');
    this.error.set('');

    this.dashboard.createProduct(this.productForm).subscribe({
      next: (product) => {
        this.products.update((products) => [product, ...products]);
        this.notice.set('Produit ajoute au stock fournisseur.');
        this.resetProductForm();
      },
      error: (error) =>
        this.error.set(this.readApiError(error) || "Le produit n'a pas pu etre ajoute."),
    });
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
        this.imagePreview.set(image);
        this.error.set('');
      })
      .catch(() => this.error.set("L'image n'a pas pu etre importee."));
  }

  protected updateStock(product: BackendProduct, rawValue: string): void {
    const stockQuantity = Math.max(0, Number(rawValue || 0));

    this.dashboard.updateStock(product._id, stockQuantity).subscribe({
      next: (updatedProduct) => this.replaceProduct(updatedProduct, 'Stock mis a jour.'),
      error: () => this.error.set("Le stock n'a pas pu etre mis a jour."),
    });
  }

  protected disableProduct(product: BackendProduct): void {
    this.dashboard.disableProduct(product._id).subscribe({
      next: () => {
        this.products.update((products) =>
          products.map((item) =>
            item._id === product._id ? { ...item, status: 'DISABLED' } : item,
          ),
        );
        this.notice.set('Produit desactive.');
      },
      error: () => this.error.set("Le produit n'a pas pu etre desactive."),
    });
  }

  protected updateOrder(order: SupplierOrder, orderStatus: OrderStatus): void {
    this.dashboard.updateOrderStatus(order._id, orderStatus).subscribe({
      next: (updatedOrder) => {
        this.orders.update((orders) =>
          orders.map((item) => (item._id === updatedOrder._id ? updatedOrder : item)),
        );
        this.notice.set('Commande mise a jour.');
      },
      error: () => this.error.set("La commande n'a pas pu etre modifiee."),
    });
  }

  protected saveProfile(): void {
    this.auth.updateProfile(this.profileForm).subscribe({
      next: () => this.notice.set('Compte mis a jour.'),
      error: () => this.error.set("Le compte n'a pas pu etre mis a jour."),
    });
  }

  protected changePassword(): void {
    this.auth.changePassword(this.passwordForm).subscribe({
      next: () => {
        this.notice.set('Mot de passe modifie.');
        this.passwordForm.currentPassword = '';
        this.passwordForm.newPassword = '';
      },
      error: () => this.error.set("Le mot de passe n'a pas pu etre modifie."),
    });
  }

  protected logout(): void {
    this.auth.logout();
  }

  protected orderSupplierTotal(order: SupplierOrder): number {
    return order.items.reduce((sum, item) => sum + item.totalPrice, 0);
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
      ACTIVE: 'Actif',
      OUT_OF_STOCK: 'Rupture',
      DISABLED: 'Desactive',
      PENDING: 'En attente',
      CONFIRMED: 'Approuvee',
      PROCESSING: 'Preparation',
      DELIVERED: 'Livree',
      CANCELLED: 'Refusee',
      PAID: 'Payee',
      FAILED: 'Echec',
    };

    return labels[status] || status;
  }

  private hydrateProfile(): void {
    const user = this.user();

    if (!user) {
      return;
    }

    this.profileForm.name = user.name || '';
    this.profileForm.companyName = user.companyName || '';
    this.profileForm.phone = user.phone || '';
    this.profileForm.address = user.address || '';
  }

  private replaceProduct(product: BackendProduct, message: string): void {
    this.products.update((products) =>
      products.map((item) => (item._id === product._id ? product : item)),
    );
    this.notice.set(message);
  }

  private resetProductForm(): void {
    this.productForm.name = '';
    this.productForm.price = 0;
    this.productForm.image = '';
    this.productForm.category = '';
    this.productForm.type = '';
    this.productForm.stockQuantity = 0;
    this.productForm.characteristics = {
      unit: 'kg',
      description: '',
    };
    this.imagePreview.set('');
  }

  private shortMonth(value: string): string {
    return new Intl.DateTimeFormat('fr-MA', { month: 'short' }).format(new Date(value));
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
