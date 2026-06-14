import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ApiResponse } from './api.models';
import { AccountRequestsService } from './account-requests.service';
import { OrdersService } from './orders.service';
import { ProductsService } from './products.service';
import { UsersService } from './users.service';
import {
  AccountRequest,
  AdminAnalytics,
  AdminDashboardData,
  ChartDataPoint,
} from './dashboard.models';
import { HttpClient } from '@angular/common/http';

const ADMIN_PROFILE_EXTRAS_KEY = 'profood-admin-profile-extras';
const ADMIN_REQUEST_NOTES_KEY = 'profood-admin-request-notes';

interface CountRow {
  key: string;
  count: number;
}

export interface AdminProfileExtras {
  email?: string;
}

type RawAdminAnalytics = Omit<
  AdminAnalytics,
  'usersByRole' | 'requestsByStatus' | 'productsByCategory' | 'ordersByStatus'
> & {
  usersByRole: CountRow[];
  requestsByStatus: CountRow[];
  productsByCategory: CountRow[];
  ordersByStatus: CountRow[];
};

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private readonly http = inject(HttpClient);
  private readonly users = inject(UsersService);
  private readonly requests = inject(AccountRequestsService);
  private readonly products = inject(ProductsService);
  private readonly orders = inject(OrdersService);

  getDashboard(): Observable<AdminDashboardData> {
    return forkJoin({
      analytics: this.getAnalytics(),
      users: this.users.listUsers().pipe(catchError(() => of([]))),
      requests: this.requests.listRequests().pipe(catchError(() => of([]))),
      products: forkJoin([
        this.products.listProducts({ status: 'ACTIVE' }),
        this.products.listProducts({ status: 'OUT_OF_STOCK' }),
        this.products.listProducts({ status: 'DISABLED' }),
      ]).pipe(
        map((groups) => groups.flat()),
        catchError(() => of([])),
      ),
      orders: this.orders.listOrders().pipe(catchError(() => of([]))),
    });
  }

  getAnalytics(): Observable<AdminAnalytics> {
    return this.http.get<ApiResponse<RawAdminAnalytics>>(`${API_BASE_URL}/admin/analytics`).pipe(
      map((response) => this.normalizeAnalytics(response.data)),
      catchError(() => of(this.emptyAnalytics())),
    );
  }

  getAdminProfileExtras(userId: string): Observable<AdminProfileExtras> {
    // TODO: Replace this local fallback when PATCH /auth/me supports admin email updates.
    return of(this.readAdminProfileExtras(userId));
  }

  saveAdminProfileExtras(userId: string, extras: AdminProfileExtras): Observable<AdminProfileExtras> {
    // TODO: Replace this local fallback when PATCH /auth/me supports admin email updates.
    const nextExtras = {
      ...this.readAdminProfileExtras(userId),
      ...extras,
    };
    this.writeAdminProfileExtras(userId, nextExtras);
    return of(nextExtras);
  }

  getRequestReviewNote(requestId: string): string {
    // TODO: Replace this local fallback when account request review notes are returned by the backend.
    return this.readRequestNotes()[requestId] || '';
  }

  saveRequestReviewNote(requestId: string, note: string): Observable<string> {
    // TODO: Replace this local fallback when account request review notes are persisted by the backend.
    const notes = this.readRequestNotes();
    notes[requestId] = note;
    this.writeRequestNotes(notes);
    return of(note);
  }

  fallbackSupplierRating(): number {
    // TODO: Replace with a backend fournisseur rating metric when it exists.
    return 4.7;
  }

  private normalizeAnalytics(data: RawAdminAnalytics): AdminAnalytics {
    return {
      ...data,
      usersByRole: this.toPoints(data.usersByRole),
      requestsByStatus: this.toPoints(data.requestsByStatus),
      productsByCategory: this.toPoints(data.productsByCategory),
      ordersByStatus: this.toPoints(data.ordersByStatus),
      pendingRequests: data.pendingRequests || [],
      lowStockCount: data.lowStockCount ?? data.lowStockProducts?.length ?? 0,
      revenueByMonth: data.revenueByMonth || [],
      recentOrders: data.recentOrders || [],
      recentUsers: data.recentUsers || [],
    };
  }

  private toPoints(rows: CountRow[] = []): ChartDataPoint[] {
    const max = Math.max(...rows.map((row) => row.count), 1);
    return rows.map((row) => ({
      label: row.key || 'Non defini',
      value: row.count,
      percent: Math.max(4, Math.round((row.count / max) * 100)),
    }));
  }

  private emptyAnalytics(): AdminAnalytics {
    // TODO: Replace with hard failure UI when the analytics backend is guaranteed in production.
    return {
      totalUsers: 0,
      totalClients: 0,
      totalFournisseurs: 0,
      pendingAccountRequests: 0,
      totalProducts: 0,
      totalOrders: 0,
      lowStockCount: 0,
      revenue: { revenue: 0, averageOrderValue: 0, paidOrders: 0 },
      usersByRole: [],
      requestsByStatus: [],
      productsByCategory: [],
      ordersByStatus: [],
      revenueByMonth: [],
      topProducts: [],
      lowStockProducts: [],
      recentOrders: [],
      recentUsers: [],
      pendingRequests: [] as AccountRequest[],
    };
  }

  private readAdminProfileExtras(userId: string): AdminProfileExtras {
    if (typeof localStorage === 'undefined') {
      return {};
    }

    const rawValue = localStorage.getItem(`${ADMIN_PROFILE_EXTRAS_KEY}:${userId}`);

    if (!rawValue) {
      return {};
    }

    try {
      return JSON.parse(rawValue) as AdminProfileExtras;
    } catch {
      return {};
    }
  }

  private writeAdminProfileExtras(userId: string, extras: AdminProfileExtras): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(`${ADMIN_PROFILE_EXTRAS_KEY}:${userId}`, JSON.stringify(extras));
  }

  private readRequestNotes(): Record<string, string> {
    if (typeof localStorage === 'undefined') {
      return {};
    }

    const rawValue = localStorage.getItem(ADMIN_REQUEST_NOTES_KEY);

    if (!rawValue) {
      return {};
    }

    try {
      return JSON.parse(rawValue) as Record<string, string>;
    } catch {
      return {};
    }
  }

  private writeRequestNotes(notes: Record<string, string>): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(ADMIN_REQUEST_NOTES_KEY, JSON.stringify(notes));
  }
}
