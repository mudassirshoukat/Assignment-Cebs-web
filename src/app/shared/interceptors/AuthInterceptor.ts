import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

// Note: Ensure your path to AuthService is correct relative to this file
import { AuthService } from '../../core/services/infrastructure/auth.service'; 

// 1. Define the interceptor as a constant function with the HttpInterceptorFn type
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  
  // 2. Use the 'inject' function to retrieve the AuthService dependency
  const authService = inject(AuthService);
  const token = authService.getToken();
console.log("AuthInterceptor - Retrieved Token:", token);
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};