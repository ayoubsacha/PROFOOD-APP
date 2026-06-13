import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ApiResponse } from './api.models';
import { AccountRequest } from './dashboard.models';

@Injectable({ providedIn: 'root' })
export class AccountRequestsService {
  private readonly http = inject(HttpClient);

  listRequests(status = ''): Observable<AccountRequest[]> {
    const params: Record<string, string> = {};

    if (status) {
      params['status'] = status;
    }

    return this.http
      .get<ApiResponse<AccountRequest[]>>(`${API_BASE_URL}/account-requests`, { params })
      .pipe(map((response) => response.data));
  }

  approveRequest(requestId: string, message = ''): Observable<AccountRequest> {
    return this.http
      .patch<ApiResponse<AccountRequest>>(`${API_BASE_URL}/account-requests/${requestId}/approve`, {
        message,
      })
      .pipe(map((response) => response.data));
  }

  refuseRequest(requestId: string, message = ''): Observable<AccountRequest> {
    return this.http
      .patch<ApiResponse<AccountRequest>>(`${API_BASE_URL}/account-requests/${requestId}/refuse`, {
        message,
      })
      .pipe(map((response) => response.data));
  }
}
