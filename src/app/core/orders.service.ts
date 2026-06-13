import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ApiResponse, OrderStatus, SupplierOrder } from './api.models';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);

  listOrders(filters: { orderStatus?: OrderStatus | ''; paymentStatus?: string } = {}): Observable<SupplierOrder[]> {
    const params: Record<string, string> = {};

    if (filters.orderStatus) {
      params['orderStatus'] = filters.orderStatus;
    }

    if (filters.paymentStatus) {
      params['paymentStatus'] = filters.paymentStatus;
    }

    return this.http
      .get<ApiResponse<SupplierOrder[]>>(`${API_BASE_URL}/orders`, { params })
      .pipe(map((response) => response.data));
  }

  updateStatus(orderId: string, orderStatus: OrderStatus): Observable<SupplierOrder> {
    return this.http
      .patch<ApiResponse<SupplierOrder>>(`${API_BASE_URL}/orders/${orderId}/status`, { orderStatus })
      .pipe(map((response) => response.data));
  }
}
