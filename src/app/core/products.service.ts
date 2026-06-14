import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ApiResponse, BackendProduct } from './api.models';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);

  listProducts(filters: { status?: BackendProduct['status'] | ''; mine?: boolean } = {}): Observable<BackendProduct[]> {
    const params: Record<string, string> = {};

    if (filters.status) {
      params['status'] = filters.status;
    }

    if (filters.mine) {
      params['mine'] = 'true';
    }

    return this.http
      .get<ApiResponse<BackendProduct[]>>(`${API_BASE_URL}/products`, { params })
      .pipe(map((response) => response.data));
  }

  updateProduct(productId: string, payload: Partial<BackendProduct>): Observable<BackendProduct> {
    return this.http
      .patch<ApiResponse<BackendProduct>>(`${API_BASE_URL}/products/${productId}`, payload)
      .pipe(map((response) => response.data));
  }

  disableProduct(productId: string): Observable<BackendProduct> {
    return this.http
      .patch<ApiResponse<BackendProduct>>(`${API_BASE_URL}/products/${productId}/disable`, {})
      .pipe(map((response) => response.data));
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
}
