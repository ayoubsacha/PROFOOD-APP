import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ApiResponse, AuthUser, LoginResult } from './api.models';

const TOKEN_KEY = 'profood-auth-token';
const USER_KEY = 'profood-auth-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly token = signal<string | null>(this.readToken());
  readonly currentUser = signal<AuthUser | null>(this.readUser());

  login(credentials: { email: string; password: string }): Observable<LoginResult> {
    return this.http.post<ApiResponse<LoginResult>>(`${API_BASE_URL}/auth/login`, credentials).pipe(
      map((response) => response.data),
      tap((session) => this.storeSession(session)),
    );
  }

  updateProfile(payload: {
    name?: string;
    companyName?: string;
    phone?: string;
    address?: string;
  }): Observable<AuthUser> {
    return this.http.patch<ApiResponse<AuthUser>>(`${API_BASE_URL}/auth/me`, payload).pipe(
      map((response) => response.data),
      tap((user) => this.storeUser(user)),
    );
  }

  changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }): Observable<ApiResponse<unknown>> {
    return this.http.patch<ApiResponse<unknown>>(`${API_BASE_URL}/auth/me/password`, payload);
  }

  ensureProfile(): Observable<AuthUser | null> {
    if (!this.token()) {
      return of(null);
    }

    const existingUser = this.currentUser();
    if (existingUser?.status === 'ACTIVE') {
      return of(existingUser);
    }

    return this.http.get<ApiResponse<AuthUser>>(`${API_BASE_URL}/auth/me`).pipe(
      map((response) => response.data),
      tap((user) => this.storeUser(user)),
      catchError(() => {
        this.logout(false);
        return of(null);
      }),
    );
  }

  logout(redirect = true): void {
    this.token.set(null);
    this.currentUser.set(null);

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  private storeSession(session: LoginResult): void {
    this.token.set(session.token);
    this.storeUser(session.user);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, session.token);
    }
  }

  private storeUser(user: AuthUser): void {
    this.currentUser.set(user);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  private readToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  }

  private readUser(): AuthUser | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const value = localStorage.getItem(USER_KEY);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as AuthUser;
    } catch {
      return null;
    }
  }
}
