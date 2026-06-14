import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ApiResponse, BackendProduct, OrderStatus, SupplierOrder } from './api.models';

const PROFILE_EXTRAS_KEY = 'profood-fournisseur-profile-extras';

export interface ProductPayload {
  name: string;
  price: number;
  image?: string;
  category: string;
  type?: string;
  stockQuantity: number;
  status?: BackendProduct['status'];
  characteristics?: Record<string, unknown>;
}

export interface FournisseurProfile {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  companyAddress: string;
  specialty: string;
  profileImage: string;
}

export interface FournisseurProfileExtras {
  email?: string;
  specialty?: string;
}

export interface FournisseurProduct extends BackendProduct {
  unit: string;
  description: string;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface StockItem extends FournisseurProduct {}

export interface FournisseurOrder extends SupplierOrder {
  orderNumber: string;
  clientName: string;
  supplierTotal: number;
}

export interface InboxMessage {
  id: string;
  conversationId: string;
  clientName: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
}

export interface BestProduct {
  productId?: string;
  productName: string;
  image?: string;
  unitsSold: number;
  revenue: number;
}

export interface MonthlyIncomePoint {
  month: string;
  income: number;
  percent: number;
}

export interface BestClient {
  clientId: string;
  clientName: string;
  orderCount: number;
  totalSpending: number;
  lastOrderDate: string;
}

export interface FournisseurStats {
  totalProducts: number;
  totalProductsSold: number;
  activeProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  monthlyIncome: number;
  totalIncome: number;
  rating: number;
}

@Injectable({ providedIn: 'root' })
export class FournisseurDashboardService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<BackendProduct[]> {
    // TODO: Allow `mine=true` to include disabled products for fournisseurs so inactive stock can survive a reload.
    return this.http
      .get<ApiResponse<BackendProduct[]>>(`${API_BASE_URL}/products?mine=true`)
      .pipe(map((response) => response.data));
  }

  createProduct(payload: ProductPayload): Observable<BackendProduct> {
    return this.http
      .post<ApiResponse<BackendProduct>>(`${API_BASE_URL}/products`, payload)
      .pipe(map((response) => response.data));
  }

  updateProduct(productId: string, payload: Partial<ProductPayload>): Observable<BackendProduct> {
    return this.http
      .patch<ApiResponse<BackendProduct>>(`${API_BASE_URL}/products/${productId}`, payload)
      .pipe(map((response) => response.data));
  }

  updateStock(productId: string, stockQuantity: number): Observable<BackendProduct> {
    return this.http
      .patch<ApiResponse<BackendProduct>>(`${API_BASE_URL}/products/${productId}/stock`, {
        stockQuantity,
      })
      .pipe(map((response) => response.data));
  }

  activateProduct(productId: string): Observable<BackendProduct> {
    return this.updateProduct(productId, { status: 'ACTIVE' });
  }

  deactivateProduct(productId: string): Observable<BackendProduct> {
    return this.updateProduct(productId, { status: 'DISABLED' });
  }

  deleteProduct(productId: string): Observable<BackendProduct | null> {
    return this.http
      .delete<ApiResponse<BackendProduct | { deleted: true }>>(`${API_BASE_URL}/products/${productId}`)
      .pipe(
        map((response) =>
          response.data && 'deleted' in response.data ? null : (response.data as BackendProduct),
        ),
      );
  }

  getOrders(): Observable<SupplierOrder[]> {
    return this.http
      .get<ApiResponse<SupplierOrder[]>>(`${API_BASE_URL}/orders`)
      .pipe(map((response) => response.data));
  }

  updateOrderStatus(orderId: string, orderStatus: OrderStatus): Observable<SupplierOrder> {
    return this.http
      .patch<ApiResponse<SupplierOrder>>(`${API_BASE_URL}/orders/${orderId}/status`, {
        orderStatus,
      })
      .pipe(map((response) => response.data));
  }

  getSupplierRating(): Observable<number> {
    // TODO: Replace this fallback with a backend analytics/rating endpoint for fournisseurs.
    return of(4.7);
  }

  getProfileExtras(userId: string): Observable<FournisseurProfileExtras> {
    // TODO: Replace this local fallback with backend fields for email changes and supplier specialty/domain.
    return of(this.readProfileExtras(userId));
  }

  saveProfileExtras(userId: string, extras: FournisseurProfileExtras): Observable<FournisseurProfileExtras> {
    // TODO: Replace this local fallback with PATCH /auth/me support for email and specialty/domain.
    const nextExtras = {
      ...this.readProfileExtras(userId),
      ...extras,
    };
    this.writeProfileExtras(userId, nextExtras);
    return of(nextExtras);
  }

  toStockItem(product: BackendProduct): StockItem {
    const characteristics = product.characteristics ?? {};
    const unit = String(characteristics['unit'] || 'unite');
    const description = String(characteristics['description'] || '');
    const stockStatus =
      product.stockQuantity <= 0
        ? 'OUT_OF_STOCK'
        : product.stockQuantity <= 10
          ? 'LOW_STOCK'
          : 'IN_STOCK';

    return {
      ...product,
      unit,
      description,
      stockStatus,
    };
  }

  toSupplierOrder(order: SupplierOrder): FournisseurOrder {
    const clientName =
      order.checkoutInfo?.companyName ||
      order.checkoutInfo?.contactName ||
      `Client ${order.clientProId.slice(-5).toUpperCase()}`;

    return {
      ...order,
      orderNumber: order._id.slice(-6).toUpperCase(),
      clientName,
      supplierTotal: order.items.reduce((sum, item) => sum + item.totalPrice, 0),
    };
  }

  private readProfileExtras(userId: string): FournisseurProfileExtras {
    if (typeof localStorage === 'undefined') {
      return {};
    }

    const rawValue = localStorage.getItem(`${PROFILE_EXTRAS_KEY}:${userId}`);

    if (!rawValue) {
      return {};
    }

    try {
      return JSON.parse(rawValue) as FournisseurProfileExtras;
    } catch {
      return {};
    }
  }

  private writeProfileExtras(userId: string, extras: FournisseurProfileExtras): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(`${PROFILE_EXTRAS_KEY}:${userId}`, JSON.stringify(extras));
  }
}
