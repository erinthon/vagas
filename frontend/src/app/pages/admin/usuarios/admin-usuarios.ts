import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminPainelService } from '../../../services/admin-painel.service';
import { AdminUser } from '../../../models/admin-user.model';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-header">
      <h1>🔑 Usuários Admin</h1>
      <button class="btn-primary" (click)="mostrarForm.set(!mostrarForm())">
        {{ mostrarForm() ? 'Cancelar' : '+ Novo usuário' }}
      </button>
    </div>

    @if (mostrarForm()) {
      <div class="form-card">
        <h2>Novo usuário administrador</h2>
        <div class="form-grid">
          <div class="field">
            <label>Username</label>
            <input [(ngModel)]="form.username" placeholder="admin2" />
          </div>
          <div class="field">
            <label>Nome</label>
            <input [(ngModel)]="form.nome" placeholder="João Silva" />
          </div>
          <div class="field">
            <label>E-mail</label>
            <input [(ngModel)]="form.email" type="email" placeholder="joao@admin.com" />
          </div>
          <div class="field">
            <label>Senha</label>
            <input [(ngModel)]="form.senha" type="password" placeholder="••••••••" />
          </div>
        </div>
        @if (erro()) { <p class="erro">{{ erro() }}</p> }
        <button class="btn-primary" [disabled]="salvando()" (click)="criar()">
          {{ salvando() ? 'Salvando...' : 'Criar usuário' }}
        </button>
      </div>
    }

    @if (carregando()) {
      <p class="loading">Carregando...</p>
    } @else {
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Username</th><th>Nome</th><th>E-mail</th></tr>
          </thead>
          <tbody>
            @for (u of items(); track u.id) {
              <tr>
                <td class="id">{{ u.id }}</td>
                <td><code>{{ u.username }}</code></td>
                <td>{{ u.nome }}</td>
                <td>{{ u.email }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: [`
    .page-header { display: flex; align-items: center; gap: .75rem; margin-bottom: 1.5rem; }
    h1 { margin: 0; font-size: 1.4rem; color: #1e293b; flex: 1; }
    .btn-primary { background: #3b82f6; color: white; border: none; border-radius: 8px; padding: .5rem 1.1rem; font-size: .875rem; font-weight: 600; cursor: pointer; }
    .btn-primary:hover:not(:disabled) { background: #2563eb; }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
    .form-card { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .form-card h2 { margin: 0 0 1.2rem; font-size: 1rem; color: #1e293b; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem; }
    .field label { display: block; font-size: .75rem; color: #64748b; text-transform: uppercase; letter-spacing: .05em; margin-bottom: .35rem; font-weight: 600; }
    .field input { width: 100%; padding: .6rem .8rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: .875rem; outline: none; box-sizing: border-box; }
    .field input:focus { border-color: #3b82f6; }
    .erro { color: #dc2626; font-size: .85rem; margin-bottom: .75rem; }
    .loading { color: #64748b; }
    .table-wrap { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.08); border: 1px solid #e2e8f0; overflow: auto; }
    table { width: 100%; border-collapse: collapse; font-size: .875rem; }
    th { background: #f1f5f9; color: #475569; font-weight: 600; padding: .75rem 1rem; text-align: left; }
    td { padding: .7rem 1rem; border-top: 1px solid #f1f5f9; color: #334155; }
    tr:hover td { background: #f8fafc; }
    .id { color: #94a3b8; font-size: .8rem; }
    code { background: #f1f5f9; padding: .1rem .4rem; border-radius: 4px; font-size: .8rem; }
  `]
})
export class AdminUsuarios implements OnInit {
  private readonly service = inject(AdminPainelService);

  carregando = signal(true);
  salvando   = signal(false);
  mostrarForm = signal(false);
  erro = signal('');
  items = signal<AdminUser[]>([]);
  form = { username: '', nome: '', email: '', senha: '' };

  ngOnInit() { this.carregar(); }

  carregar() {
    this.service.usuarios().subscribe({ next: d => { this.items.set(d); this.carregando.set(false); }, error: () => this.carregando.set(false) });
  }

  criar() {
    if (!this.form.username || !this.form.nome || !this.form.email || !this.form.senha) {
      this.erro.set('Preencha todos os campos.'); return;
    }
    this.salvando.set(true);
    this.erro.set('');
    this.service.criarUsuario(this.form).subscribe({
      next: () => {
        this.salvando.set(false);
        this.mostrarForm.set(false);
        this.form = { username: '', nome: '', email: '', senha: '' };
        this.carregar();
      },
      error: () => { this.erro.set('Erro ao criar usuário.'); this.salvando.set(false); }
    });
  }
}
