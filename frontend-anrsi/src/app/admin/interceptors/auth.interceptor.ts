import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Add token to request headers if available
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 (Unauthorized) or 403 (Forbidden) responses
      if (error.status === 401 || error.status === 403) {
        console.warn('Authentication failed - token expired or invalid. Logging out...');
        authService.logout();
        router.navigate(['/admin/login']);
      }
      return throwError(() => error);
    })
  );
};

