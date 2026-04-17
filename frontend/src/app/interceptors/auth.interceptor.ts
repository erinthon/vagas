import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AdminAuthService } from '../services/admin-auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isAdminReq = req.url.includes('/api/admin/');
  const token = isAdminReq
    ? inject(AdminAuthService).token
    : inject(AuthService).token;

  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
