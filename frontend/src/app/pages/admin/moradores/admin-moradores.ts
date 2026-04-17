import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminPainelService } from '../../../services/admin-painel.service';
import { Morador } from '../../../models/morador.model';
import { Condominio } from '../../../models/condominio.model';
import { Cargo } from '../../../models/cargo.model';

@Component({
  selector: 'app-admin-moradores',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-header">
      <h1>Moradores</h1>
      <span class="badge">{{ items().length }}</span>
      <button class="btn-primary" (click)="abrirNovo()">
        {{ mostrarForm() && !editando() ? 'Cancelar' : '+ Novo' }}
      </button>
    </div>

    @if (mostrarForm()) {
      <div class="form-card">
        <h2>{{ editando() ? 'Editar morador #' + editando()!.id : 'Novo morador' }}</h2>
        <div class="form-grid">
          <div class="field"><label>Nome *</label><input [(ngModel)]="form.nome" /></div>
          <div class="field"><label>E-mail *</label><input [(ngModel)]="form.email" type="email" /></div>
          <div class="field"><label>Apartamento *</label><input [(ngModel)]="form.apartamento" /></div>
          <div class="field"><label>Bloco *</label><input [(ngModel)]="form.bloco" /></div>
          <div class="field"><label>Telefone</label><input [(ngModel)]="form.telefone" /></div>
          @if (!editando()) {
            <div class="field">
              <label>Condomínio <span class="optional">(opcional — pode vincular depois)</span></label>
              <select [(ngModel)]="form.condominioId">
                <option value="">Sem condomínio</option>
                @for (c of condominios(); track c.id) {
                  <option [value]="c.id">{{ c.nome }}</option>
                }
              </select>
            </div>
          }
          <div class="field">
            <label>Cargo</label>
            <select [(ngModel)]="form.cargoId">
              <option value="">Sem cargo</option>
              @for (c of cargosFiltrados(); track c.id) {
                <option [value]="c.id">{{ c.nome }} ({{ c.condominio?.nome }})</option>
              }
            </select>
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
            <tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Apto</th><th>Bloco</th><th>Condomínio</th><th>Cargo</th><th>Ações</th></tr>
          </thead>
          <tbody>
            @for (m of items(); track m.id) {
              <tr>
                <td class="id">{{ m.id }}</td>
                <td><strong>{{ m.nome }}</strong></td>
                <td>{{ m.email }}</td>
                <td>{{ m.apartamento || '—' }}</td>
                <td>{{ m.bloco || '—' }}</td>
                <td>@if (m.condominio) { {{ m.condominio.nome }} } @else { <span class="tag pend">Não vinculado</span> }</td>
                <td>{{ m.cargo?.nome || '—' }}</td>
                <td class="actions">
                  <button class="btn-edit" (click)="editar(m)">Editar</button>
                  <button class="btn-del" (click)="excluir(m)">Excluir</button>
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
export class AdminMoradores implements OnInit {
  private readonly service = inject(AdminPainelService);

  carregando   = signal(true);
  salvando     = signal(false);
  mostrarForm  = signal(false);
  editando     = signal<Morador | null>(null);
  erro         = signal('');
  items        = signal<Morador[]>([]);
  condominios  = signal<Condominio[]>([]);
  cargos       = signal<Cargo[]>([]);

  form = emptyForm();

  cargosFiltrados() {
    const cid = this.editando()?.condominio?.id ?? (this.form.condominioId ? +this.form.condominioId : null);
    return cid ? this.cargos().filter(c => c.condominio?.id === cid) : this.cargos();
  }

  ngOnInit() {
    forkJoin({ m: this.service.moradores(), c: this.service.condominios(), g: this.service.cargos() }).subscribe({
      next: r => { this.items.set(r.m); this.condominios.set(r.c); this.cargos.set(r.g); this.carregando.set(false); },
      error: () => this.carregando.set(false)
    });
  }

  carregar() {
    this.service.moradores().subscribe({ next: d => this.items.set(d), error: () => {} });
  }

  abrirNovo() {
    if (this.mostrarForm() && !this.editando()) { this.fecharForm(); return; }
    this.editando.set(null);
    this.form = emptyForm();
    this.erro.set('');
    this.mostrarForm.set(true);
  }

  editar(m: Morador) {
    this.editando.set(m);
    this.form = { nome: m.nome, email: m.email, apartamento: m.apartamento, bloco: m.bloco, telefone: m.telefone ?? '', condominioId: String(m.condominio?.id ?? ''), cargoId: String(m.cargo?.id ?? '') };
    this.erro.set('');
    this.mostrarForm.set(true);
  }

  fecharForm() { this.mostrarForm.set(false); this.editando.set(null); this.erro.set(''); }

  salvar() {
    if (!this.form.nome || !this.form.email) {
      this.erro.set('Nome e e-mail são obrigatórios.'); return;
    }
    const ed = this.editando();
    this.salvando.set(true); this.erro.set('');

    const payload: any = { nome: this.form.nome, email: this.form.email, apartamento: this.form.apartamento, bloco: this.form.bloco, telefone: this.form.telefone || null };
    if (this.form.cargoId) payload['cargo'] = { id: +this.form.cargoId };
    if (!ed && this.form.condominioId) payload['condominio'] = { id: +this.form.condominioId };

    const req$ = ed ? this.service.atualizarMorador(ed.id!, payload) : this.service.criarMorador(payload);
    req$.subscribe({
      next: () => { this.salvando.set(false); this.fecharForm(); this.carregar(); },
      error: err => { this.salvando.set(false); this.erro.set(err?.error?.message || 'Erro ao salvar.'); }
    });
  }

  excluir(m: Morador) {
    if (!confirm(`Excluir morador "${m.nome}"?`)) return;
    this.service.excluirMorador(m.id!).subscribe({
      next: () => this.carregar(),
      error: err => alert(err?.error?.message || 'Erro ao excluir.')
    });
  }
}

function emptyForm() {
  return { nome: '', email: '', apartamento: '', bloco: '', telefone: '', condominioId: '', cargoId: '' };
}

function sharedStyles(): string {
  return `
    .page-header { display: flex; align-items: center; gap: .75rem; margin-bottom: 1.5rem; }
    h1 { margin: 0; font-size: 1.4rem; color: #1e293b; flex: 1; }
    .badge { background: #3b82f6; color: white; border-radius: 999px; padding: .2rem .7rem; font-size: .8rem; font-weight: 700; }
    .loading { color: #64748b; }
    .form-card { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .form-card h2 { margin: 0 0 1rem; font-size: 1rem; color: #1e293b; }
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
    .tag { padding: .2rem .6rem; border-radius: 999px; font-size: .75rem; font-weight: 600; }
    .pend { background: #fef9c3; color: #854d0e; }
    .optional { font-size: .7rem; text-transform: none; font-weight: 400; color: #94a3b8; }
  `;
}
