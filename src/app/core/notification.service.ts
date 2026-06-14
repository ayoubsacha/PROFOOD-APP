import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ApiResponse, NotificationItem } from './api.models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);

  getNotifications(): Observable<NotificationItem[]> {
    return this.http
      .get<ApiResponse<NotificationItem[]>>(`${API_BASE_URL}/notifications`)
      .pipe(map((response) => response.data));
  }

  getUnreadCount(): Observable<number> {
    return this.http
      .get<ApiResponse<{ count: number }>>(`${API_BASE_URL}/notifications/unread-count`)
      .pipe(map((response) => response.data.count));
  }

  markAsRead(notificationId: string): Observable<NotificationItem> {
    return this.http
      .patch<ApiResponse<NotificationItem>>(`${API_BASE_URL}/notifications/${notificationId}/read`, {})
      .pipe(map((response) => response.data));
  }

  markAllAsRead(): Observable<{ modifiedCount: number }> {
    return this.http
      .patch<ApiResponse<{ modifiedCount: number }>>(`${API_BASE_URL}/notifications/read-all`, {})
      .pipe(map((response) => response.data));
  }
}
