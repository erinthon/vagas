import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminGuard: CanActivateFn = () => {
  const admin = inject(AdminAuthService);
  const router = inject(Router);
  if (admin.isLoggedIn) return true;
  router.navigate(['/admin/login']);
  return false;
};
