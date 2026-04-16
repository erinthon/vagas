import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="logo">🅿</div>
        <h1>Vagas Condomínio</h1>
        <p>Faça login para gerenciar ofertas e solicitações de vagas</p>
        <button class="btn-google" (click)="auth.loginWithGoogle()">
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Entrar com Google
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-card {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 3rem 2.5rem;
      text-align: center;
      max-width: 380px;
      width: 100%;
      box-shadow: 0 4px 24px rgba(0,0,0,.08);

      .logo { font-size: 3rem; margin-bottom: .5rem; }
      h1 { font-size: 1.5rem; margin: 0 0 .5rem; color: var(--text); }
      p { color: var(--text-muted); font-size: .9rem; margin-bottom: 2rem; }
    }
    .btn-google {
      display: inline-flex;
      align-items: center;
      gap: .75rem;
      padding: .75rem 1.5rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: #fff;
      font-size: .95rem;
      font-weight: 500;
      cursor: pointer;
      transition: box-shadow .15s, background .15s;
      width: 100%;
      justify-content: center;
      &:hover { background: #f8f9fa; box-shadow: 0 2px 8px rgba(0,0,0,.1); }
    }
  `]
})
export class Login {
  constructor(readonly auth: AuthService) {}
}
