import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminAuthService } from '../../../services/admin-auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">
          <span>⚙️</span>
          <span>Admin</span>
        </div>

        <nav>
          <a routerLink="/admin/dashboard"    routerLinkActive="active">📊 Dashboard</a>
          <a routerLink="/admin/condominios"  routerLinkActive="active">🏢 Condomínios</a>
          <a routerLink="/admin/moradores"    routerLinkActive="active">👥 Moradores</a>
          <a routerLink="/admin/vagas"        routerLinkActive="active">🅿 Vagas</a>
          <a routerLink="/admin/cargos"       routerLinkActive="active">🏅 Cargos</a>
          <a routerLink="/admin/ofertas"      routerLinkActive="active">📋 Ofertas</a>
          <a routerLink="/admin/solicitacoes" routerLinkActive="active">📩 Solicitações</a>
          <a routerLink="/admin/usuarios"     routerLinkActive="active">🔑 Usuários Admin</a>
        </nav>

        <button class="logout" (click)="logout()">↩ Sair</button>
      </aside>

      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .shell { display: flex; min-height: 100vh; }
    .sidebar {
      width: 220px;
      min-width: 220px;
      background: #1e293b;
      display: flex;
      flex-direction: column;
      padding: 1.5rem 0;
      position: sticky;
      top: 0;
      height: 100vh;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: .6rem;
      padding: 0 1.25rem 1.5rem;
      font-size: 1.1rem;
      font-weight: 700;
      color: white;
      border-bottom: 1px solid #334155;
      margin-bottom: .75rem;
    }
    nav { flex: 1; display: flex; flex-direction: column; gap: .15rem; padding: 0 .75rem; }
    nav a {
      display: block;
      padding: .6rem .75rem;
      color: #94a3b8;
      text-decoration: none;
      border-radius: 8px;
      font-size: .875rem;
      transition: background .15s, color .15s;
    }
    nav a:hover  { background: #334155; color: #e2e8f0; }
    nav a.active { background: #3b82f6; color: white; }
    .logout {
      margin: 1rem .75rem 0;
      padding: .6rem .75rem;
      background: transparent;
      border: 1px solid #334155;
      color: #94a3b8;
      border-radius: 8px;
      cursor: pointer;
      font-size: .875rem;
      text-align: left;
      transition: background .15s, color .15s;
    }
    .logout:hover { background: #450a0a; color: #fca5a5; border-color: #dc2626; }
    .content { flex: 1; background: #f8fafc; padding: 2rem; overflow: auto; }
  `]
})
export class AdminLayout {
  private readonly adminAuth = inject(AdminAuthService);
  logout() { this.adminAuth.logout(); }
}
