import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly TOKEN_KEY = 'admin_token';
  private readonly USER_KEY = 'admin_user';

  constructor() {
    // Check for existing session on service initialization
    this.loadStoredUser();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Mock authentication - replace with actual API call
    const mockUsers: User[] = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@anrsi.mr',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date()
      },
      {
        id: 2,
        username: 'editor',
        email: 'editor@anrsi.mr',
        role: 'editor',
        firstName: 'Editor',
        lastName: 'User',
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date()
      }
    ];

    const user = mockUsers.find(u => 
      u.username === credentials.username && 
      credentials.password === 'password' // Mock password
    );

    if (user) {
      const response: LoginResponse = {
        user: { ...user, lastLogin: new Date() },
        token: this.generateToken(),
        expiresIn: 3600 // 1 hour
      };

      this.setCurrentUser(response.user, response.token);
      return of(response);
    } else {
      throw new Error('Invalid credentials');
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);
    return !!(token && user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isEditor(): boolean {
    return this.hasRole('editor') || this.isAdmin();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    const storedToken = localStorage.getItem(this.TOKEN_KEY);

    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout();
      }
    }
  }

  private setCurrentUser(user: User, token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private generateToken(): string {
    // Mock token generation - replace with actual JWT generation
    return 'mock-jwt-token-' + Date.now();
  }
}
