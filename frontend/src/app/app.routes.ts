import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'auth/callback', loadComponent: () => import('./pages/auth-callback/auth-callback').then(m => m.AuthCallback) },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home), canActivate: [authGuard] },
  { path: 'ofertas', loadComponent: () => import('./pages/ofertas/ofertas').then(m => m.Ofertas), canActivate: [authGuard] },
  { path: 'solicitacoes', loadComponent: () => import('./pages/solicitacoes/solicitacoes').then(m => m.Solicitacoes), canActivate: [authGuard] },
  { path: 'moradores', loadComponent: () => import('./pages/moradores/moradores').then(m => m.Moradores), canActivate: [authGuard] },
  { path: 'condominios', loadComponent: () => import('./pages/condominios/condominios').then(m => m.Condominios), canActivate: [authGuard] },
  { path: 'perfil', loadComponent: () => import('./pages/perfil/perfil').then(m => m.Perfil), canActivate: [authGuard] },
];
