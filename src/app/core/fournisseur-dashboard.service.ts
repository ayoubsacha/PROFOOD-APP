import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ApiResponse, BackendProduct, OrderStatus, SupplierOrder } from './api.models';

export interface ProductPayload {
  name: string;
  price: number;
  image?: string;
  category: string;
  type?: string;
  stockQuantity: number;
  characteristics?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class FournisseurDashboardService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<BackendProduct[]> {
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

  disableProduct(productId: string): Observable<unknown> {
    return this.http
      .delete<ApiResponse<unknown>>(`${API_BASE_URL}/products/${productId}`)
      .pipe(map((response) => response.data));
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
}
