import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ApiResponse, UserRole, UserStatus } from './api.models';
import { UserSummary } from './dashboard.models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  listUsers(filters: { role?: UserRole | ''; status?: UserStatus | '' } = {}): Observable<UserSummary[]> {
    const params: Record<string, string> = {};

    if (filters.role) {
      params['role'] = filters.role;
    }

    if (filters.status) {
      params['status'] = filters.status;
    }

    return this.http
      .get<ApiResponse<UserSummary[]>>(`${API_BASE_URL}/users`, { params })
      .pipe(map((response) => response.data));
  }

  updateUser(userId: string, payload: Partial<UserSummary>): Observable<UserSummary> {
    return this.http
      .patch<ApiResponse<UserSummary>>(`${API_BASE_URL}/users/${userId}`, payload)
      .pipe(map((response) => response.data));
  }

  updateStatus(userId: string, status: UserStatus): Observable<UserSummary> {
    return this.http
      .patch<ApiResponse<UserSummary>>(`${API_BASE_URL}/users/${userId}/status`, { status })
      .pipe(map((response) => response.data));
  }
}
