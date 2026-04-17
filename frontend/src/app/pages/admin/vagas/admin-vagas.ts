import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminPainelService } from '../../../services/admin-painel.service';
import { Vaga } from '../../../models/vaga.model';
import { Morador } from '../../../models/morador.model';

@Component({
  selector: 'app-admin-vagas',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-header">
      <h1>Vagas</h1>
      <span class="badge">{{ items().length }}</span>
      <button class="btn-primary" (click)="abrirNovo()">
        {{ mostrarForm() && !editando() ? 'Cancelar' : '+ Nova' }}
      </button>
    </div>

    @if (mostrarForm()) {
      <div class="form-card">
        <h2>{{ editando() ? 'Editar vaga #' + editando()!.id : 'Nova vaga' }}</h2>
        <div class="form-grid">
          <div class="field"><label>Número *</label><input [(ngModel)]="form.numero" type="number" /></div>
          <div class="field">
            <label>Tipo *</label>
            <select [(ngModel)]="form.tipo">
              <option value="">Selecione...</option>
              <option value="COBERTA">COBERTA</option>
              <option value="DESCOBERTA">DESCOBERTA</option>
            </select>
          </div>
          <div class="field">
            <label>Proprietário *</label>
            <select [(ngModel)]="form.moradorId">
              <option value="">Selecione...</option>
              @for (m of moradores(); track m.id) {
                <option [value]="m.id">{{ m.nome }} — {{ m.condominio?.nome ?? 'sem condomínio' }}</option>
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
            <tr><th>ID</th><th>Número</th><th>Tipo</th><th>Proprietário</th><th>Condomínio</th><th>Ações</th></tr>
          </thead>
          <tbody>
            @for (v of items(); track v.id) {
              <tr>
                <td class="id">{{ v.id }}</td>
                <td><strong>{{ v.numero }}</strong></td>
                <td><span class="tag" [class.coberta]="v.tipo === 'COBERTA'">{{ v.tipo }}</span></td>
                <td>{{ v.proprietario?.nome || '—' }}</td>
                <td>{{ v.proprietario?.condominio?.nome || '—' }}</td>
                <td class="actions">
                  <button class="btn-edit" (click)="editar(v)">Editar</button>
                  <button class="btn-del" (click)="excluir(v)">Excluir</button>
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
    th { background: #f1f5f9; color: #475569; font-weight: 600; padding: .75rem 1rem; text-align: left; }
    td { padding: .65rem 1rem; border-top: 1px solid #f1f5f9; color: #334155; }
    tr:hover td { background: #f8fafc; }
    .id { color: #94a3b8; font-size: .8rem; }
    .actions { white-space: nowrap; }
    .tag { padding: .2rem .6rem; border-radius: 999px; font-size: .75rem; font-weight: 600; background: #f1f5f9; color: #475569; }
    .tag.coberta { background: #dbeafe; color: #1d4ed8; }
    .btn-edit { background: #f1f5f9; color: #1e293b; border: none; border-radius: 6px; padding: .3rem .7rem; font-size: .78rem; cursor: pointer; margin-right: .4rem; }
    .btn-edit:hover { background: #e2e8f0; }
    .btn-del { background: #fee2e2; color: #991b1b; border: none; border-radius: 6px; padding: .3rem .7rem; font-size: .78rem; cursor: pointer; }
    .btn-del:hover { background: #fecaca; }
  `]
})
export class AdminVagas implements OnInit {
  private readonly service = inject(AdminPainelService);

  carregando  = signal(true);
  salvando    = signal(false);
  mostrarForm = signal(false);
  editando    = signal<Vaga | null>(null);
  erro        = signal('');
  items       = signal<Vaga[]>([]);
  moradores   = signal<Morador[]>([]);

  form = emptyForm();

  ngOnInit() {
    forkJoin({ v: this.service.vagas(), m: this.service.moradores() }).subscribe({
      next: r => { this.items.set(r.v); this.moradores.set(r.m); this.carregando.set(false); },
      error: () => this.carregando.set(false)
    });
  }

  carregar() { this.service.vagas().subscribe({ next: d => this.items.set(d) }); }

  abrirNovo() {
    if (this.mostrarForm() && !this.editando()) { this.fecharForm(); return; }
    this.editando.set(null); this.form = emptyForm(); this.erro.set(''); this.mostrarForm.set(true);
  }

  editar(v: Vaga) {
    this.editando.set(v);
    this.form = { numero: String(v.numero), tipo: v.tipo, moradorId: String(v.proprietario?.id ?? '') };
    this.erro.set(''); this.mostrarForm.set(true);
  }

  fecharForm() { this.mostrarForm.set(false); this.editando.set(null); this.erro.set(''); }

  salvar() {
    if (!this.form.numero || !this.form.tipo || !this.form.moradorId) {
      this.erro.set('Preencha todos os campos.'); return;
    }
    this.salvando.set(true); this.erro.set('');
    const payload = { numero: +this.form.numero, tipo: this.form.tipo, proprietario: { id: +this.form.moradorId } };
    const ed = this.editando();
    const req$ = ed ? this.service.atualizarVaga(ed.id!, payload) : this.service.criarVaga(payload);
    req$.subscribe({
      next: () => { this.salvando.set(false); this.fecharForm(); this.carregar(); },
      error: err => { this.salvando.set(false); this.erro.set(err?.error?.message || 'Erro ao salvar.'); }
    });
  }

  excluir(v: Vaga) {
    if (!confirm(`Excluir vaga ${v.numero}?`)) return;
    this.service.excluirVaga(v.id!).subscribe({
      next: () => this.carregar(),
      error: err => alert(err?.error?.message || 'Erro ao excluir.')
    });
  }
}

function emptyForm() { return { numero: '', tipo: '', moradorId: '' }; }
