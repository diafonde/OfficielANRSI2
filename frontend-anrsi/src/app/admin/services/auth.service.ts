import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private router = inject(Router);

  private readonly TOKEN_KEY = 'admin_token';
  private readonly USER_KEY = 'admin_user';
  private readonly apiUrl = '/api/auth';

  constructor(private http: HttpClient) {
    // Check for existing session on service initialization
    this.loadStoredUser();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('Attempting login with:', { username: credentials.username });
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map((response) => {
        console.log('Login successful:', response);
        // Normalize role to lowercase for internal use
        if (response.user && response.user.role) {
          response.user.role = response.user.role.toLowerCase() as 'admin' | 'editor' | 'viewer';
        }
        // Store the token and user
        this.setCurrentUser(response.user, response.token);
        return response;
      }),
      catchError((error) => {
        console.error('Login error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
          url: `${this.apiUrl}/login`
        });
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/admin/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);
    if (!token || !user) {
      return false;
    }
    // Check if token is expired
    if (this.isTokenExpired(token)) {
      console.warn('Token expired, clearing session');
      this.logout();
      return false;
    }
    return true;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user?.role) return false;
    // Normalize both to lowercase for comparison
    const userRole = user.role.toLowerCase();
    const checkRole = role.toLowerCase();
    return userRole === checkRole;
  }

  isAdmin(): boolean {
    return this.hasRole('admin') || this.hasRole('ADMIN');
  }

  isEditor(): boolean {
    return this.hasRole('editor') || this.hasRole('EDITOR') || this.isAdmin();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    const storedToken = localStorage.getItem(this.TOKEN_KEY);

    if (storedUser && storedToken) {
      // Validate token format (JWT should have 3 parts separated by dots)
      if (!this.isValidJwtToken(storedToken)) {
        console.warn('Invalid token format detected, clearing stored session');
        this.logout();
        return;
      }

      // Check if token is expired
      if (this.isTokenExpired(storedToken)) {
        console.warn('Stored token is expired, clearing session');
        this.logout();
        return;
      }

      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout();
      }
    }
  }

  private isValidJwtToken(token: string): boolean {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      if (!exp) {
        return true; // No expiration claim means expired
      }
      const expirationDate = new Date(exp * 1000); // Convert to milliseconds
      return expirationDate < new Date();
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // If we can't decode, consider it expired
    }
  }

  private setCurrentUser(user: User, token: string): void {
    // Normalize role to lowercase before storing
    const normalizedUser = { ...user };
    if (normalizedUser.role) {
      normalizedUser.role = normalizedUser.role.toLowerCase() as 'admin' | 'editor' | 'viewer';
    }
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(normalizedUser));
    this.currentUserSubject.next(normalizedUser);
  }
}
