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
      <h1>Usuários Admin</h1>
      <span class="badge">{{ items().length }}</span>
      <button class="btn-primary" (click)="abrirNovo()">
        {{ mostrarForm() && !editando() ? 'Cancelar' : '+ Novo' }}
      </button>
    </div>

    @if (mostrarForm()) {
      <div class="form-card">
        <h2>{{ editando() ? 'Editar usuário' : 'Novo usuário administrador' }}</h2>
        <div class="form-grid">
          @if (!editando()) {
            <div class="field">
              <label>Username *</label>
              <input [(ngModel)]="form.username" placeholder="admin2" />
            </div>
          }
          <div class="field">
            <label>Nome *</label>
            <input [(ngModel)]="form.nome" placeholder="João Silva" />
          </div>
          <div class="field">
            <label>E-mail *</label>
            <input [(ngModel)]="form.email" type="email" placeholder="joao@admin.com" />
          </div>
          <div class="field">
            <label>{{ editando() ? 'Nova senha (deixe em branco para manter)' : 'Senha *' }}</label>
            <input [(ngModel)]="form.senha" type="password" placeholder="••••••••" />
          </div>
        </div>
        @if (erro()) { <p class="erro">{{ erro() }}</p> }
        <div class="form-actions">
          <button class="btn-secondary" (click)="fecharForm()">Cancelar</button>
          <button class="btn-primary" [disabled]="salvando()" (click)="salvar()">
            {{ salvando() ? 'Salvando...' : (editando() ? 'Atualizar' : 'Criar') }}
          </button>
        </div>
      </div>
    }

    @if (carregando()) {
      <p class="loading">Carregando...</p>
    } @else {
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Username</th><th>Nome</th><th>E-mail</th><th>Ações</th></tr>
          </thead>
          <tbody>
            @for (u of items(); track u.id) {
              <tr>
                <td class="id">{{ u.id }}</td>
                <td><code>{{ u.username }}</code></td>
                <td>{{ u.nome }}</td>
                <td>{{ u.email }}</td>
                <td class="actions">
                  <button class="btn-edit" (click)="editar(u)">Editar</button>
                  <button class="btn-del" (click)="excluir(u)">Excluir</button>
                </td>
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
    .badge { background: #3b82f6; color: white; border-radius: 999px; padding: .2rem .7rem; font-size: .8rem; font-weight: 700; }
    .loading { color: #64748b; }
    .form-card { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .form-card h2 { margin: 0 0 1.2rem; font-size: 1rem; color: #1e293b; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem; }
    .field label { display: block; font-size: .75rem; color: #64748b; text-transform: uppercase; letter-spacing: .05em; margin-bottom: .35rem; font-weight: 600; }
    .field input { width: 100%; padding: .6rem .8rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: .875rem; outline: none; box-sizing: border-box; }
    .field input:focus { border-color: #3b82f6; }
    .form-actions { display: flex; gap: .75rem; justify-content: flex-end; }
    .erro { color: #dc2626; font-size: .85rem; margin-bottom: .75rem; }
    .btn-primary { background: #3b82f6; color: white; border: none; border-radius: 8px; padding: .5rem 1.1rem; font-size: .875rem; font-weight: 600; cursor: pointer; }
    .btn-primary:hover:not(:disabled) { background: #2563eb; }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
    .btn-secondary { background: white; color: #475569; border: 1px solid #e2e8f0; border-radius: 8px; padding: .5rem 1rem; font-size: .875rem; cursor: pointer; }
    .btn-secondary:hover { background: #f8fafc; }
    .table-wrap { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.08); border: 1px solid #e2e8f0; overflow: auto; }
    table { width: 100%; border-collapse: collapse; font-size: .875rem; }
    th { background: #f1f5f9; color: #475569; font-weight: 600; padding: .75rem 1rem; text-align: left; }
    td { padding: .7rem 1rem; border-top: 1px solid #f1f5f9; color: #334155; }
    tr:hover td { background: #f8fafc; }
    .id { color: #94a3b8; font-size: .8rem; }
    .actions { white-space: nowrap; }
    code { background: #f1f5f9; padding: .1rem .4rem; border-radius: 4px; font-size: .8rem; }
    .btn-edit { background: #f1f5f9; color: #1e293b; border: none; border-radius: 6px; padding: .3rem .7rem; font-size: .78rem; cursor: pointer; margin-right: .4rem; }
    .btn-edit:hover { background: #e2e8f0; }
    .btn-del { background: #fee2e2; color: #991b1b; border: none; border-radius: 6px; padding: .3rem .7rem; font-size: .78rem; cursor: pointer; }
    .btn-del:hover { background: #fecaca; }
  `]
})
export class AdminUsuarios implements OnInit {
  private readonly service = inject(AdminPainelService);

  carregando  = signal(true);
  salvando    = signal(false);
  mostrarForm = signal(false);
  editando    = signal<AdminUser | null>(null);
  erro        = signal('');
  items       = signal<AdminUser[]>([]);

  form = emptyForm();

  ngOnInit() { this.carregar(); }

  carregar() {
    this.service.usuarios().subscribe({
      next: d => { this.items.set(d); this.carregando.set(false); },
      error: () => this.carregando.set(false)
    });
  }

  abrirNovo() {
    if (this.mostrarForm() && !this.editando()) { this.fecharForm(); return; }
    this.editando.set(null);
    this.form = emptyForm();
    this.erro.set('');
    this.mostrarForm.set(true);
  }

  editar(u: AdminUser) {
    this.editando.set(u);
    this.form = { username: u.username, nome: u.nome, email: u.email, senha: '' };
    this.erro.set('');
    this.mostrarForm.set(true);
  }

  fecharForm() { this.mostrarForm.set(false); this.editando.set(null); this.erro.set(''); }

  salvar() {
    const ed = this.editando();
    if (!ed && (!this.form.username || !this.form.nome || !this.form.email || !this.form.senha)) {
      this.erro.set('Preencha todos os campos.'); return;
    }
    if (ed && (!this.form.nome || !this.form.email)) {
      this.erro.set('Nome e e-mail são obrigatórios.'); return;
    }
    this.salvando.set(true); this.erro.set('');

    const req$ = ed
      ? this.service.atualizarUsuario(ed.id!, { nome: this.form.nome, email: this.form.email, senha: this.form.senha || undefined })
      : this.service.criarUsuario({ username: this.form.username, nome: this.form.nome, email: this.form.email, senha: this.form.senha });

    req$.subscribe({
      next: () => { this.salvando.set(false); this.fecharForm(); this.carregar(); },
      error: err => { this.salvando.set(false); this.erro.set(err?.error?.message || 'Erro ao salvar.'); }
    });
  }

  excluir(u: AdminUser) {
    if (!confirm(`Excluir usuário "${u.username}"?`)) return;
    this.service.excluirUsuario(u.id!).subscribe({
      next: () => this.carregar(),
      error: err => alert(err?.error?.message || 'Erro ao excluir.')
    });
  }
}

function emptyForm() { return { username: '', nome: '', email: '', senha: '' }; }
