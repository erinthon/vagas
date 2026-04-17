import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminPainelService } from '../../../services/admin-painel.service';
import { Solicitacao } from '../../../models/solicitacao.model';
import { Oferta } from '../../../models/oferta.model';
import { Morador } from '../../../models/morador.model';

@Component({
  selector: 'app-admin-solicitacoes',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-header">
      <h1>Solicitações</h1>
      <span class="badge">{{ items().length }}</span>
      <button class="btn-primary" (click)="abrirNovo()">
        {{ mostrarForm() && modo() === 'criar' ? 'Cancelar' : '+ Nova' }}
      </button>
    </div>

    @if (mostrarForm() && modo() === 'criar') {
      <div class="form-card">
        <h2>Nova solicitação</h2>
        <div class="form-grid">
          <div class="field">
            <label>Morador *</label>
            <select [(ngModel)]="form.moradorId">
              <option value="">Selecione...</option>
              @for (m of moradores(); track m.id) {
                <option [value]="m.id">{{ m.nome }} — {{ m.condominio?.nome ?? 'sem condomínio' }}</option>
              }
            </select>
          </div>
          <div class="field"><label>Data início *</label><input [(ngModel)]="form.dataInicio" type="date" /></div>
          <div class="field"><label>Data fim *</label><input [(ngModel)]="form.dataFim" type="date" /></div>
          <div class="field" style="grid-column: span 2"><label>Observação</label><input [(ngModel)]="form.observacao" /></div>
        </div>
        @if (erro()) { <p class="erro">{{ erro() }}</p> }
        <div class="form-actions">
          <button class="btn-secondary" (click)="fecharForm()">Cancelar</button>
          <button class="btn-primary" [disabled]="salvando()" (click)="criarSolicitacao()">
            {{ salvando() ? 'Salvando...' : 'Criar' }}
          </button>
        </div>
      </div>
    }

    @if (mostrarForm() && modo() === 'atender') {
      <div class="form-card">
        <h2>Atender solicitação #{{ atendendoId() }}</h2>
        <div class="form-grid">
          <div class="field" style="grid-column: span 2">
            <label>Oferta ativa *</label>
            <select [(ngModel)]="ofertaIdSelecionada">
              <option value="">Selecione uma oferta...</option>
              @for (o of ofertasAtivas(); track o.id) {
                <option [value]="o.id">#{{ o.id }} — {{ o.morador?.nome }}, Vaga {{ o.vaga?.numero }} ({{ o.dataInicio }} → {{ o.dataFim }})</option>
              }
            </select>
          </div>
        </div>
        @if (erro()) { <p class="erro">{{ erro() }}</p> }
        <div class="form-actions">
          <button class="btn-secondary" (click)="fecharForm()">Cancelar</button>
          <button class="btn-ok" [disabled]="salvando()" (click)="confirmarAtender()">
            {{ salvando() ? 'Salvando...' : 'Confirmar' }}
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
            <tr><th>ID</th><th>Morador</th><th>Início</th><th>Fim</th><th>Status</th><th>Oferta atendida</th><th>Ações</th></tr>
          </thead>
          <tbody>
            @for (s of items(); track s.id) {
              <tr>
                <td class="id">{{ s.id }}</td>
                <td>{{ s.morador?.nome || '—' }}</td>
                <td>{{ s.dataInicio }}</td>
                <td>{{ s.dataFim }}</td>
                <td><span class="tag" [class]="'st-' + s.status">{{ s.status }}</span></td>
                <td>{{ s.ofertaAtendida ? '#' + s.ofertaAtendida.id : '—' }}</td>
                <td class="actions">
                  @if (s.status === 'PENDENTE') {
                    <button class="btn-ok" (click)="abrirAtender(s)">Atender</button>
                    <button class="btn-del" (click)="cancelar(s)">Cancelar</button>
                  }
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
    th { background: #f1f5f9; color: #475569; font-weight: 600; padding: .75rem 1rem; text-align: left; white-space: nowrap; }
    td { padding: .65rem 1rem; border-top: 1px solid #f1f5f9; color: #334155; }
    tr:hover td { background: #f8fafc; }
    .id { color: #94a3b8; font-size: .8rem; }
    .actions { white-space: nowrap; }
    .tag { padding: .2rem .6rem; border-radius: 999px; font-size: .75rem; font-weight: 600; }
    .st-PENDENTE  { background: #fef9c3; color: #854d0e; }
    .st-ATENDIDA  { background: #dcfce7; color: #166534; }
    .st-CANCELADA { background: #fee2e2; color: #991b1b; }
    .btn-ok { background: #dcfce7; color: #166534; border: none; border-radius: 6px; padding: .3rem .7rem; font-size: .78rem; cursor: pointer; margin-right: .3rem; }
    .btn-ok:hover { background: #bbf7d0; }
    .btn-ok:disabled { opacity: .6; cursor: not-allowed; }
    .btn-del { background: #fee2e2; color: #991b1b; border: none; border-radius: 6px; padding: .3rem .7rem; font-size: .78rem; cursor: pointer; }
    .btn-del:hover { background: #fecaca; }
  `]
})
export class AdminSolicitacoes implements OnInit {
  private readonly service = inject(AdminPainelService);

  carregando        = signal(true);
  salvando          = signal(false);
  mostrarForm       = signal(false);
  modo              = signal<'criar' | 'atender'>('criar');
  atendendoId       = signal<number | null>(null);
  ofertaIdSelecionada = '';
  erro              = signal('');
  items             = signal<Solicitacao[]>([]);
  moradores         = signal<Morador[]>([]);
  ofertas           = signal<Oferta[]>([]);

  form = emptyForm();

  ofertasAtivas() { return this.ofertas().filter(o => o.status === 'ATIVA'); }

  ngOnInit() {
    forkJoin({ s: this.service.solicitacoes(), m: this.service.moradores(), o: this.service.ofertas() }).subscribe({
      next: r => { this.items.set(r.s); this.moradores.set(r.m); this.ofertas.set(r.o); this.carregando.set(false); },
      error: () => this.carregando.set(false)
    });
  }

  carregar() {
    forkJoin({ s: this.service.solicitacoes(), o: this.service.ofertas() }).subscribe({
      next: r => { this.items.set(r.s); this.ofertas.set(r.o); }
    });
  }

  abrirNovo() {
    if (this.mostrarForm() && this.modo() === 'criar') { this.fecharForm(); return; }
    this.modo.set('criar'); this.form = emptyForm(); this.erro.set(''); this.mostrarForm.set(true);
  }

  abrirAtender(s: Solicitacao) {
    this.modo.set('atender'); this.atendendoId.set(s.id!); this.ofertaIdSelecionada = ''; this.erro.set(''); this.mostrarForm.set(true);
  }

  fecharForm() { this.mostrarForm.set(false); this.erro.set(''); }

  criarSolicitacao() {
    if (!this.form.moradorId || !this.form.dataInicio || !this.form.dataFim) {
      this.erro.set('Preencha todos os campos obrigatórios.'); return;
    }
    this.salvando.set(true); this.erro.set('');
    const payload = { morador: { id: +this.form.moradorId }, dataInicio: this.form.dataInicio, dataFim: this.form.dataFim, observacao: this.form.observacao || null };
    this.service.criarSolicitacao(payload).subscribe({
      next: () => { this.salvando.set(false); this.fecharForm(); this.carregar(); },
      error: err => { this.salvando.set(false); this.erro.set(err?.error?.message || 'Erro ao criar solicitação.'); }
    });
  }

  confirmarAtender() {
    if (!this.ofertaIdSelecionada) { this.erro.set('Selecione uma oferta.'); return; }
    this.salvando.set(true); this.erro.set('');
    this.service.atenderSolicitacao(this.atendendoId()!, +this.ofertaIdSelecionada).subscribe({
      next: () => { this.salvando.set(false); this.fecharForm(); this.carregar(); },
      error: err => { this.salvando.set(false); this.erro.set(err?.error?.message || 'Erro ao atender solicitação.'); }
    });
  }

  cancelar(s: Solicitacao) {
    if (!confirm(`Cancelar solicitação #${s.id}?`)) return;
    this.service.cancelarSolicitacao(s.id!).subscribe({
      next: () => this.carregar(),
      error: err => alert(err?.error?.message || 'Erro ao cancelar.')
    });
  }
}

function emptyForm() { return { moradorId: '', dataInicio: '', dataFim: '', observacao: '' }; }
