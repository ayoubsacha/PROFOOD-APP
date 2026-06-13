import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ApiResponse } from './api.models';

export interface AccountRequestPayload {
  name: string;
  email: string;
  requestedRole: 'FOURNISSEUR' | 'CLIENT_PRO';
  companyName?: string;
  phone?: string;
  address?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AccountRequestService {
  private readonly http = inject(HttpClient);

  submit(payload: AccountRequestPayload): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${API_BASE_URL}/account-requests`, payload);
  }
}
