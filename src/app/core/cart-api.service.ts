import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ApiResponse, CheckoutInfo, ClientCart, SupplierOrder } from './api.models';

export interface CheckoutPayload {
  paymentInfo: {
    method: string;
  };
  checkoutInfo: CheckoutInfo;
}

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private readonly http = inject(HttpClient);

  getCart(): Observable<ClientCart> {
    return this.http
      .get<ApiResponse<ClientCart>>(`${API_BASE_URL}/cart`)
      .pipe(map((response) => response.data));
  }

  addItem(productId: string, quantity: number): Observable<ClientCart> {
    return this.http.post<ApiResponse<ClientCart>>(`${API_BASE_URL}/cart/items`, {
      productId,
      quantity,
    }).pipe(map((response) => response.data));
  }

  updateQuantity(productId: string, quantity: number): Observable<ClientCart> {
    return this.http
      .patch<ApiResponse<ClientCart>>(`${API_BASE_URL}/cart/items/${productId}`, { quantity })
      .pipe(map((response) => response.data));
  }

  removeItem(productId: string): Observable<ClientCart> {
    return this.http
      .delete<ApiResponse<ClientCart>>(`${API_BASE_URL}/cart/items/${productId}`)
      .pipe(map((response) => response.data));
  }

  clearCart(): Observable<ClientCart> {
    return this.http
      .delete<ApiResponse<ClientCart>>(`${API_BASE_URL}/cart`)
      .pipe(map((response) => response.data));
  }

  validateCart(payload: CheckoutPayload): Observable<SupplierOrder> {
    return this.http
      .post<ApiResponse<SupplierOrder>>(`${API_BASE_URL}/cart/validate`, payload)
      .pipe(map((response) => response.data));
  }
}
