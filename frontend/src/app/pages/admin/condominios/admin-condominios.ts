import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminPainelService } from '../../../services/admin-painel.service';
import { Condominio } from '../../../models/condominio.model';

@Component({
  selector: 'app-admin-condominios',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-header">
      <h1>Condomínios</h1>
      <span class="badge">{{ items().length }}</span>
      <button class="btn-primary" (click)="abrirNovo()">
        {{ mostrarForm() && !editando() ? 'Cancelar' : '+ Novo' }}
      </button>
    </div>

    @if (mostrarForm()) {
      <div class="form-card">
        <h2>{{ editando() ? 'Editar condomínio #' + editando()!.id : 'Novo condomínio' }}</h2>

        <div class="section-title">Dados do condomínio</div>
        <div class="form-grid">
          <div class="field"><label>Nome *</label><input [(ngModel)]="form.nome" /></div>
          <div class="field"><label>CNPJ</label><input [(ngModel)]="form.cnpj" /></div>
          <div class="field"><label>Endereço</label><input [(ngModel)]="form.endereco" /></div>
          <div class="field"><label>Telefone</label><input [(ngModel)]="form.telefone" /></div>
          <div class="field"><label>E-mail</label><input [(ngModel)]="form.email" type="email" /></div>
        </div>

        @if (!editando()) {
          <div class="section-title" style="margin-top:1rem">Síndico responsável</div>
          <div class="form-grid">
            <div class="field"><label>Nome *</label><input [(ngModel)]="form.responsavelNome" /></div>
            <div class="field"><label>E-mail *</label><input [(ngModel)]="form.responsavelEmail" type="email" /></div>
            <div class="field"><label>Apartamento *</label><input [(ngModel)]="form.responsavelApartamento" /></div>
            <div class="field"><label>Bloco *</label><input [(ngModel)]="form.responsavelBloco" /></div>
            <div class="field"><label>Telefone</label><input [(ngModel)]="form.responsavelTelefone" /></div>
          </div>
        }

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
            <tr><th>ID</th><th>Nome</th><th>CNPJ</th><th>Endereço</th><th>Telefone</th><th>E-mail</th><th>Ações</th></tr>
          </thead>
          <tbody>
            @for (c of items(); track c.id) {
              <tr>
                <td class="id">{{ c.id }}</td>
                <td><strong>{{ c.nome }}</strong></td>
                <td>{{ c.cnpj || '—' }}</td>
                <td>{{ c.endereco || '—' }}</td>
                <td>{{ c.telefone || '—' }}</td>
                <td>{{ c.email || '—' }}</td>
                <td class="actions">
                  <button class="btn-edit" (click)="editar(c)">Editar</button>
                  <button class="btn-del" (click)="deletar(c)">Excluir</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: [sharedStyles()]
})
export class AdminCondominios implements OnInit {
  private readonly service = inject(AdminPainelService);

  carregando  = signal(true);
  salvando    = signal(false);
  mostrarForm = signal(false);
  editando    = signal<Condominio | null>(null);
  erro        = signal('');
  items       = signal<Condominio[]>([]);

  form = emptyForm();

  ngOnInit() { this.carregar(); }

  carregar() {
    this.service.condominios().subscribe({
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

  editar(c: Condominio) {
    this.editando.set(c);
    this.form = { ...emptyForm(), nome: c.nome, cnpj: c.cnpj ?? '', endereco: c.endereco ?? '', telefone: c.telefone ?? '', email: c.email ?? '' };
    this.erro.set('');
    this.mostrarForm.set(true);
  }

  fecharForm() { this.mostrarForm.set(false); this.editando.set(null); this.erro.set(''); }

  salvar() {
    if (!this.form.nome) { this.erro.set('Nome é obrigatório.'); return; }
    const ed = this.editando();
    if (!ed && (!this.form.responsavelNome || !this.form.responsavelEmail || !this.form.responsavelApartamento || !this.form.responsavelBloco)) {
      this.erro.set('Preencha todos os campos obrigatórios do síndico.'); return;
    }
    this.salvando.set(true); this.erro.set('');
    const req$ = ed
      ? this.service.atualizarCondominio(ed.id!, { nome: this.form.nome, cnpj: this.form.cnpj, endereco: this.form.endereco, telefone: this.form.telefone, email: this.form.email })
      : this.service.criarCondominio(this.form);
    req$.subscribe({
      next: () => { this.salvando.set(false); this.fecharForm(); this.carregar(); },
      error: err => { this.salvando.set(false); this.erro.set(err?.error?.message || 'Erro ao salvar.'); }
    });
  }

  deletar(c: Condominio) {
    if (!confirm(`Excluir condomínio "${c.nome}"?`)) return;
    this.service.deletarCondominio(c.id!).subscribe({
      next: () => this.carregar(),
      error: err => alert(err?.error?.message || 'Erro ao excluir.')
    });
  }
}

function emptyForm() {
  return { nome: '', cnpj: '', endereco: '', telefone: '', email: '', responsavelNome: '', responsavelEmail: '', responsavelApartamento: '', responsavelBloco: '', responsavelTelefone: '' };
}

function sharedStyles(): string {
  return `
    .page-header { display: flex; align-items: center; gap: .75rem; margin-bottom: 1.5rem; }
    h1 { margin: 0; font-size: 1.4rem; color: #1e293b; flex: 1; }
    .badge { background: #3b82f6; color: white; border-radius: 999px; padding: .2rem .7rem; font-size: .8rem; font-weight: 700; }
    .loading { color: #64748b; }
    .form-card { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .form-card h2 { margin: 0 0 1rem; font-size: 1rem; color: #1e293b; }
    .section-title { font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #64748b; margin-bottom: .75rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .9rem; margin-bottom: 1rem; }
    .field label { display: block; font-size: .75rem; color: #64748b; text-transform: uppercase; letter-spacing: .05em; margin-bottom: .3rem; font-weight: 600; }
    .field input, .field select { width: 100%; padding: .55rem .8rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: .875rem; outline: none; box-sizing: border-box; }
    .field input:focus, .field select:focus { border-color: #3b82f6; }
    .form-actions { display: flex; gap: .75rem; justify-content: flex-end; margin-top: .75rem; }
    .erro { color: #dc2626; font-size: .85rem; margin: .5rem 0; }
    .btn-primary { background: #3b82f6; color: white; border: none; border-radius: 8px; padding: .5rem 1.1rem; font-size: .875rem; font-weight: 600; cursor: pointer; }
    .btn-primary:hover:not(:disabled) { background: #2563eb; }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
    .btn-secondary { background: white; color: #475569; border: 1px solid #e2e8f0; border-radius: 8px; padding: .5rem 1rem; font-size: .875rem; cursor: pointer; }
    .btn-secondary:hover { background: #f8fafc; }
    .table-wrap { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.08); border: 1px solid #e2e8f0; overflow: auto; }
    table { width: 100%; border-collapse: collapse; font-size: .875rem; }
    th { background: #f1f5f9; color: #475569; font-weight: 600; padding: .75rem 1rem; text-align: left; white-space: nowrap; }
    td { padding: .65rem 1rem; border-top: 1px solid #f1f5f9; color: #334155; }
    tr:hover td { background: #f8fafc; }
    .id { color: #94a3b8; font-size: .8rem; }
    .actions { white-space: nowrap; }
    .btn-edit { background: #f1f5f9; color: #1e293b; border: none; border-radius: 6px; padding: .3rem .7rem; font-size: .78rem; cursor: pointer; margin-right: .4rem; }
    .btn-edit:hover { background: #e2e8f0; }
    .btn-del { background: #fee2e2; color: #991b1b; border: none; border-radius: 6px; padding: .3rem .7rem; font-size: .78rem; cursor: pointer; }
    .btn-del:hover { background: #fecaca; }
    .btn-action { background: #fef9c3; color: #854d0e; border: none; border-radius: 6px; padding: .3rem .7rem; font-size: .78rem; cursor: pointer; margin-right: .3rem; }
    .btn-action:hover { background: #fef08a; }
    .btn-ok { background: #dcfce7; color: #166534; border: none; border-radius: 6px; padding: .3rem .7rem; font-size: .78rem; cursor: pointer; margin-right: .3rem; }
    .btn-ok:hover { background: #bbf7d0; }
    .tag { padding: .2rem .6rem; border-radius: 999px; font-size: .75rem; font-weight: 600; }
  `;
}
