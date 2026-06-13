import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ApiResponse, SupplierOrder } from './api.models';

@Injectable({ providedIn: 'root' })
export class ClientDashboardService {
  private readonly http = inject(HttpClient);

  getOrders(): Observable<SupplierOrder[]> {
    return this.http
      .get<ApiResponse<SupplierOrder[]>>(`${API_BASE_URL}/orders`)
      .pipe(map((response) => response.data));
  }
}
