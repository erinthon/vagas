import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="brand">
          <span class="icon">⚙️</span>
          <h1>Painel Administrativo</h1>
          <p>Vagas Condomínio</p>
        </div>

        <form (ngSubmit)="login()">
          <div class="field">
            <label>Usuário</label>
            <input type="text" [(ngModel)]="username" name="username" placeholder="admin" required />
          </div>
          <div class="field">
            <label>Senha</label>
            <input type="password" [(ngModel)]="senha" name="senha" placeholder="••••••••" required />
          </div>

          @if (erro()) {
            <div class="erro">{{ erro() }}</div>
          }

          <button type="submit" [disabled]="carregando()">
            {{ carregando() ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <a routerLink="/login" class="link-morador">← Acesso de moradores</a>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      background: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-card {
      background: #1e293b;
      border-radius: 12px;
      padding: 2.5rem;
      width: 100%;
      max-width: 380px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }
    .brand {
      text-align: center;
      margin-bottom: 2rem;
      color: white;
    }
    .brand .icon { font-size: 2.5rem; display: block; margin-bottom: .5rem; }
    .brand h1 { font-size: 1.3rem; margin: 0 0 .25rem; font-weight: 700; }
    .brand p  { font-size: .85rem; color: #94a3b8; margin: 0; }
    .field { margin-bottom: 1.2rem; }
    label { display: block; font-size: .8rem; color: #94a3b8; margin-bottom: .4rem; text-transform: uppercase; letter-spacing: .05em; }
    input {
      width: 100%;
      padding: .7rem 1rem;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      color: white;
      font-size: .95rem;
      box-sizing: border-box;
      outline: none;
      transition: border-color .2s;
    }
    input:focus { border-color: #3b82f6; }
    button {
      width: 100%;
      padding: .8rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: .5rem;
      transition: background .2s;
    }
    button:hover:not(:disabled) { background: #2563eb; }
    button:disabled { opacity: .6; cursor: not-allowed; }
    .erro { background: #450a0a; border: 1px solid #dc2626; color: #fca5a5; padding: .7rem 1rem; border-radius: 8px; font-size: .85rem; margin-bottom: 1rem; }
    .link-morador { display: block; text-align: center; margin-top: 1.5rem; color: #64748b; font-size: .85rem; text-decoration: none; }
    .link-morador:hover { color: #94a3b8; }
  `]
})
export class AdminLogin {
  private readonly adminAuth = inject(AdminAuthService);
  private readonly router = inject(Router);

  username = '';
  senha = '';
  carregando = signal(false);
  erro = signal('');

  login() {
    if (!this.username || !this.senha) return;
    this.carregando.set(true);
    this.erro.set('');
    this.adminAuth.login(this.username, this.senha).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: () => {
        this.erro.set('Usuário ou senha inválidos.');
        this.carregando.set(false);
      }
    });
  }
}
