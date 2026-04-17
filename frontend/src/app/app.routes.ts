import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'auth/callback', loadComponent: () => import('./pages/auth-callback/auth-callback').then(m => m.AuthCallback) },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home), canActivate: [authGuard] },
  { path: 'ofertas', loadComponent: () => import('./pages/ofertas/ofertas').then(m => m.Ofertas), canActivate: [authGuard] },
  { path: 'solicitacoes', loadComponent: () => import('./pages/solicitacoes/solicitacoes').then(m => m.Solicitacoes), canActivate: [authGuard] },
  { path: 'moradores', loadComponent: () => import('./pages/moradores/moradores').then(m => m.Moradores), canActivate: [authGuard] },
  { path: 'condominios', loadComponent: () => import('./pages/condominios/condominios').then(m => m.Condominios), canActivate: [authGuard] },
  { path: 'vagas', loadComponent: () => import('./pages/vagas/vagas').then(m => m.Vagas), canActivate: [authGuard] },
  { path: 'perfil', loadComponent: () => import('./pages/perfil/perfil').then(m => m.Perfil), canActivate: [authGuard] },

  {
    path: 'admin',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/admin/login/admin-login').then(m => m.AdminLogin)
      },
      {
        path: '',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/layout/admin-layout').then(m => m.AdminLayout),
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard',    loadComponent: () => import('./pages/admin/dashboard/admin-dashboard').then(m => m.AdminDashboard) },
          { path: 'condominios',  loadComponent: () => import('./pages/admin/condominios/admin-condominios').then(m => m.AdminCondominios) },
          { path: 'moradores',    loadComponent: () => import('./pages/admin/moradores/admin-moradores').then(m => m.AdminMoradores) },
          { path: 'vagas',        loadComponent: () => import('./pages/admin/vagas/admin-vagas').then(m => m.AdminVagas) },
          { path: 'cargos',       loadComponent: () => import('./pages/admin/cargos/admin-cargos').then(m => m.AdminCargos) },
          { path: 'ofertas',      loadComponent: () => import('./pages/admin/ofertas/admin-ofertas').then(m => m.AdminOfertas) },
          { path: 'solicitacoes', loadComponent: () => import('./pages/admin/solicitacoes/admin-solicitacoes').then(m => m.AdminSolicitacoes) },
          { path: 'usuarios',     loadComponent: () => import('./pages/admin/usuarios/admin-usuarios').then(m => m.AdminUsuarios) },
        ]
      }
    ]
  }
];
