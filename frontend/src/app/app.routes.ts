import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'ofertas', loadComponent: () => import('./pages/ofertas/ofertas').then(m => m.Ofertas) },
  { path: 'solicitacoes', loadComponent: () => import('./pages/solicitacoes/solicitacoes').then(m => m.Solicitacoes) },
  { path: 'moradores', loadComponent: () => import('./pages/moradores/moradores').then(m => m.Moradores) },
];
