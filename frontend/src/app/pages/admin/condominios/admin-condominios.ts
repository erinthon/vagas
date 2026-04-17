import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminPainelService } from '../../../services/admin-painel.service';
import { Condominio } from '../../../models/condominio.model';
import { Morador } from '../../../models/morador.model';
import { Cargo } from '../../../models/cargo.model';

interface CondominioDetalhe {
  moradores: Morador[];
  cargos: Cargo[];
  carregando: boolean;
  cargoForm: { nome: string };
  cargoEditando: Cargo | null;
  cargoErro: string;
}

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

        <p class="section-label">Dados do condomínio</p>
        <div class="form-grid">
          <div class="field"><label>Nome *</label><input [(ngModel)]="form.nome" /></div>
          <div class="field"><label>CNPJ</label><input [(ngModel)]="form.cnpj" placeholder="00.000.000/0000-00" /></div>
          <div class="field"><label>Endereço</label><input [(ngModel)]="form.endereco" /></div>
          <div class="field"><label>Telefone</label><input [(ngModel)]="form.telefone" /></div>
          <div class="field" style="grid-column:span 2"><label>E-mail</label><input [(ngModel)]="form.email" type="email" /></div>
        </div>

        @if (!editando()) {
          <p class="section-label" style="margin-top:.5rem">Síndico responsável</p>
          <div class="form-grid">
            <div class="field"><label>Nome *</label><input [(ngModel)]="form.responsavelNome" /></div>
            <div class="field"><label>E-mail *</label><input [(ngModel)]="form.responsavelEmail" type="email" /></div>
            <div class="field"><label>Apartamento *</label><input [(ngModel)]="form.responsavelApartamento" /></div>
            <div class="field"><label>Bloco *</label><input [(ngModel)]="form.responsavelBloco" /></div>
            <div class="field"><label>Telefone</label><input [(ngModel)]="form.responsavelTelefone" /></div>
          </div>
        }

        @if (formErro()) { <p class="erro">{{ formErro() }}</p> }
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
            <tr>
              <th style="width:2rem"></th>
              <th>ID</th><th>Nome</th><th>CNPJ</th><th>Endereço</th><th>Contato</th>
              <th class="center">Moradores</th><th class="center">Cargos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (c of items(); track c.id) {
              <tr class="main-row" [class.expanded]="expandido() === c.id">
                <td class="toggle-cell">
                  <button class="toggle-btn" (click)="toggleExpand(c)" [title]="expandido() === c.id ? 'Recolher' : 'Expandir'">
                    {{ expandido() === c.id ? '▼' : '▶' }}
                  </button>
                </td>
                <td class="id">{{ c.id }}</td>
                <td><strong>{{ c.nome }}</strong></td>
                <td>{{ c.cnpj || '—' }}</td>
                <td>{{ c.endereco || '—' }}</td>
                <td>{{ c.telefone || c.email || '—' }}</td>
                <td class="center">
                  <span class="count-badge blue">{{ contarMoradores(c.id!) }}</span>
                </td>
                <td class="center">
                  <span class="count-badge purple">{{ contarCargos(c.id!) }}</span>
                </td>
                <td class="actions">
                  <button class="btn-edit" (click)="editar(c); $event.stopPropagation()">Editar</button>
                  <button class="btn-del" (click)="deletar(c); $event.stopPropagation()">Excluir</button>
                </td>
              </tr>

              @if (expandido() === c.id) {
                <tr class="detail-row">
                  <td colspan="9">
                    <div class="detail-panel">
                      @if (detalhe(c.id!)?.carregando) {
                        <p class="loading-sm">Carregando detalhes...</p>
                      } @else {

                        <div class="detail-cols">

                          <!-- MORADORES -->
                          <div class="detail-section">
                            <div class="detail-header">
                              <span class="detail-title">Moradores ({{ detalhe(c.id!)?.moradores?.length ?? 0 }})</span>
                            </div>
                            @if (!detalhe(c.id!)?.moradores?.length) {
                              <p class="empty">Nenhum morador vinculado.</p>
                            } @else {
                              <table class="inner-table">
                                <thead>
                                  <tr><th>Nome</th><th>Apto</th><th>Bloco</th><th>Cargo</th></tr>
                                </thead>
                                <tbody>
                                  @for (m of detalhe(c.id!)!.moradores; track m.id) {
                                    <tr>
                                      <td>{{ m.nome }}</td>
                                      <td>{{ m.apartamento || '—' }}</td>
                                      <td>{{ m.bloco || '—' }}</td>
                                      <td>{{ m.cargo?.nome || '—' }}</td>
                                    </tr>
                                  }
                                </tbody>
                              </table>
                            }
                          </div>

                          <!-- CARGOS -->
                          <div class="detail-section">
                            <div class="detail-header">
                              <span class="detail-title">Cargos ({{ detalhe(c.id!)?.cargos?.length ?? 0 }})</span>
                              <button class="btn-sm-primary" (click)="abrirFormCargo(c.id!)">+ Novo cargo</button>
                            </div>

                            @if (detalhe(c.id!)!.cargoEditando || detalhe(c.id!)!.cargoForm.nome) {
                              <div class="cargo-form">
                                <input [(ngModel)]="detalhe(c.id!)!.cargoForm.nome" placeholder="Nome do cargo" class="cargo-input" />
                                @if (detalhe(c.id!)!.cargoErro) {
                                  <p class="erro-sm">{{ detalhe(c.id!)!.cargoErro }}</p>
                                }
                                <div class="cargo-form-actions">
                                  <button class="btn-sm-secondary" (click)="cancelarFormCargo(c.id!)">Cancelar</button>
                                  <button class="btn-sm-primary" (click)="salvarCargo(c.id!)">
                                    {{ detalhe(c.id!)!.cargoEditando ? 'Atualizar' : 'Criar' }}
                                  </button>
                                </div>
                              </div>
                            }

                            @if (!detalhe(c.id!)?.cargos?.length) {
                              <p class="empty">Nenhum cargo cadastrado.</p>
                            } @else {
                              <table class="inner-table">
                                <thead>
                                  <tr><th>Nome</th><th>Ações</th></tr>
                                </thead>
                                <tbody>
                                  @for (cargo of detalhe(c.id!)!.cargos; track cargo.id) {
                                    <tr>
                                      <td>{{ cargo.nome }}</td>
                                      <td class="actions-sm">
                                        <button class="btn-sm-edit" (click)="editarCargo(c.id!, cargo)">Editar</button>
                                        <button class="btn-sm-del" (click)="excluirCargo(c.id!, cargo)">Excluir</button>
                                      </td>
                                    </tr>
                                  }
                                </tbody>
                              </table>
                            }
                          </div>

                        </div>
                      }
                    </div>
                  </td>
                </tr>
              }
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
    .loading-sm { color: #94a3b8; font-size: .8rem; margin: .5rem 0; }
    .section-label { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #64748b; margin: 0 0 .7rem; }
    .form-card { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .form-card h2 { margin: 0 0 1rem; font-size: 1rem; color: #1e293b; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .9rem; margin-bottom: 1rem; }
    .field label { display: block; font-size: .75rem; color: #64748b; text-transform: uppercase; letter-spacing: .05em; margin-bottom: .3rem; font-weight: 600; }
    .field input { width: 100%; padding: .55rem .8rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: .875rem; outline: none; box-sizing: border-box; }
    .field input:focus { border-color: #3b82f6; }
    .form-actions { display: flex; gap: .75rem; justify-content: flex-end; margin-top: .5rem; }
    .erro { color: #dc2626; font-size: .85rem; margin: .5rem 0; }
    .erro-sm { color: #dc2626; font-size: .78rem; margin: .3rem 0; }
    .btn-primary { background: #3b82f6; color: white; border: none; border-radius: 8px; padding: .5rem 1.1rem; font-size: .875rem; font-weight: 600; cursor: pointer; }
    .btn-primary:hover:not(:disabled) { background: #2563eb; }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
    .btn-secondary { background: white; color: #475569; border: 1px solid #e2e8f0; border-radius: 8px; padding: .5rem 1rem; font-size: .875rem; cursor: pointer; }
    .btn-secondary:hover { background: #f8fafc; }
    .table-wrap { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.08); border: 1px solid #e2e8f0; overflow: auto; }
    table { width: 100%; border-collapse: collapse; font-size: .875rem; }
    th { background: #f1f5f9; color: #475569; font-weight: 600; padding: .75rem 1rem; text-align: left; white-space: nowrap; }
    td { padding: .65rem 1rem; border-top: 1px solid #f1f5f9; color: #334155; }
    .main-row { cursor: default; }
    .main-row:hover td { background: #f8fafc; }
    .main-row.expanded td { background: #f0f9ff; border-bottom: none; }
    .toggle-cell { padding: .65rem .5rem; }
    .toggle-btn { background: none; border: none; color: #64748b; cursor: pointer; font-size: .75rem; padding: .2rem .4rem; border-radius: 4px; }
    .toggle-btn:hover { background: #e2e8f0; color: #1e293b; }
    .id { color: #94a3b8; font-size: .8rem; }
    .center { text-align: center; }
    .count-badge { display: inline-block; border-radius: 999px; padding: .15rem .55rem; font-size: .75rem; font-weight: 700; }
    .count-badge.blue { background: #dbeafe; color: #1d4ed8; }
    .count-badge.purple { background: #ede9fe; color: #6d28d9; }
    .actions { white-space: nowrap; }
    .btn-edit { background: #f1f5f9; color: #1e293b; border: none; border-radius: 6px; padding: .3rem .7rem; font-size: .78rem; cursor: pointer; margin-right: .4rem; }
    .btn-edit:hover { background: #e2e8f0; }
    .btn-del { background: #fee2e2; color: #991b1b; border: none; border-radius: 6px; padding: .3rem .7rem; font-size: .78rem; cursor: pointer; }
    .btn-del:hover { background: #fecaca; }
    .detail-row td { padding: 0; border-top: none; background: #f0f9ff; }
    .detail-panel { padding: 1rem 1.5rem 1.25rem; border-top: 1px solid #bae6fd; }
    .detail-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .detail-section { background: white; border-radius: 10px; border: 1px solid #e2e8f0; padding: 1rem; }
    .detail-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: .75rem; }
    .detail-title { font-size: .8rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #475569; }
    .empty { color: #94a3b8; font-size: .82rem; margin: .25rem 0; }
    .inner-table { width: 100%; border-collapse: collapse; font-size: .82rem; }
    .inner-table th { background: #f8fafc; color: #64748b; font-weight: 600; padding: .4rem .7rem; font-size: .75rem; }
    .inner-table td { padding: .45rem .7rem; border-top: 1px solid #f1f5f9; color: #334155; }
    .inner-table tr:hover td { background: #f8fafc; }
    .cargo-form { background: #f8fafc; border-radius: 8px; padding: .75rem; margin-bottom: .75rem; border: 1px solid #e2e8f0; }
    .cargo-input { width: 100%; padding: .45rem .7rem; border: 1px solid #e2e8f0; border-radius: 6px; font-size: .85rem; outline: none; box-sizing: border-box; margin-bottom: .5rem; }
    .cargo-input:focus { border-color: #3b82f6; }
    .cargo-form-actions { display: flex; gap: .5rem; justify-content: flex-end; }
    .actions-sm { white-space: nowrap; }
    .btn-sm-primary { background: #3b82f6; color: white; border: none; border-radius: 6px; padding: .3rem .7rem; font-size: .78rem; font-weight: 600; cursor: pointer; }
    .btn-sm-primary:hover { background: #2563eb; }
    .btn-sm-secondary { background: white; color: #475569; border: 1px solid #e2e8f0; border-radius: 6px; padding: .3rem .7rem; font-size: .78rem; cursor: pointer; }
    .btn-sm-secondary:hover { background: #f1f5f9; }
    .btn-sm-edit { background: #f1f5f9; color: #1e293b; border: none; border-radius: 4px; padding: .2rem .55rem; font-size: .75rem; cursor: pointer; margin-right: .3rem; }
    .btn-sm-edit:hover { background: #e2e8f0; }
    .btn-sm-del { background: #fee2e2; color: #991b1b; border: none; border-radius: 4px; padding: .2rem .55rem; font-size: .75rem; cursor: pointer; }
    .btn-sm-del:hover { background: #fecaca; }
  `]
})
export class AdminCondominios implements OnInit {
  private readonly service = inject(AdminPainelService);

  carregando  = signal(true);
  salvando    = signal(false);
  mostrarForm = signal(false);
  editando    = signal<Condominio | null>(null);
  formErro    = signal('');
  expandido   = signal<number | null>(null);
  items       = signal<Condominio[]>([]);

  private detalhes = new Map<number, CondominioDetalhe>();
  private todosmoradores: Morador[] = [];
  private todosCargos: Cargo[] = [];

  form = emptyForm();

  ngOnInit() {
    forkJoin({ c: this.service.condominios(), m: this.service.moradores(), g: this.service.cargos() }).subscribe({
      next: r => {
        this.items.set(r.c);
        this.todosmoradores = r.m;
        this.todosCargos = r.g;
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  contarMoradores(condominioId: number) {
    return this.todosmoradores.filter(m => m.condominio?.id === condominioId).length;
  }

  contarCargos(condominioId: number) {
    return this.todosCargos.filter(c => c.condominio?.id === condominioId).length;
  }

  detalhe(condominioId: number): CondominioDetalhe | undefined {
    return this.detalhes.get(condominioId);
  }

  toggleExpand(c: Condominio) {
    if (this.expandido() === c.id) {
      this.expandido.set(null);
      return;
    }
    this.expandido.set(c.id!);
    if (!this.detalhes.has(c.id!)) {
      this.detalhes.set(c.id!, { moradores: [], cargos: [], carregando: true, cargoForm: { nome: '' }, cargoEditando: null, cargoErro: '' });
      forkJoin({ m: this.service.moradoresDeCondominio(c.id!), g: this.service.cargosDeCondominio(c.id!) }).subscribe({
        next: r => {
          const d = this.detalhes.get(c.id!)!;
          d.moradores = r.m;
          d.cargos = r.g;
          d.carregando = false;
          this.items.update(v => [...v]);
        },
        error: () => {
          const d = this.detalhes.get(c.id!)!;
          d.carregando = false;
          this.items.update(v => [...v]);
        }
      });
    }
  }

  // --- form condomínio ---
  abrirNovo() {
    if (this.mostrarForm() && !this.editando()) { this.fecharForm(); return; }
    this.editando.set(null); this.form = emptyForm(); this.formErro.set(''); this.mostrarForm.set(true);
  }

  editar(c: Condominio) {
    this.editando.set(c);
    this.form = { ...emptyForm(), nome: c.nome, cnpj: c.cnpj ?? '', endereco: c.endereco ?? '', telefone: c.telefone ?? '', email: c.email ?? '' };
    this.formErro.set(''); this.mostrarForm.set(true);
  }

  fecharForm() { this.mostrarForm.set(false); this.editando.set(null); this.formErro.set(''); }

  salvar() {
    if (!this.form.nome) { this.formErro.set('Nome é obrigatório.'); return; }
    const ed = this.editando();
    if (!ed && (!this.form.responsavelNome || !this.form.responsavelEmail || !this.form.responsavelApartamento || !this.form.responsavelBloco)) {
      this.formErro.set('Preencha todos os campos obrigatórios do síndico.'); return;
    }
    this.salvando.set(true); this.formErro.set('');
    const req$ = ed
      ? this.service.atualizarCondominio(ed.id!, { nome: this.form.nome, cnpj: this.form.cnpj, endereco: this.form.endereco, telefone: this.form.telefone, email: this.form.email })
      : this.service.criarCondominio(this.form);
    req$.subscribe({
      next: () => { this.salvando.set(false); this.fecharForm(); this.recarregarTudo(); },
      error: err => { this.salvando.set(false); this.formErro.set(err?.error?.message || 'Erro ao salvar.'); }
    });
  }

  deletar(c: Condominio) {
    if (!confirm(`Excluir condomínio "${c.nome}"? Esta ação removerá todos os dados associados.`)) return;
    this.service.deletarCondominio(c.id!).subscribe({
      next: () => this.recarregarTudo(),
      error: err => alert(err?.error?.message || 'Erro ao excluir.')
    });
  }

  // --- form cargo inline ---
  abrirFormCargo(condominioId: number) {
    const d = this.detalhes.get(condominioId);
    if (!d) return;
    d.cargoEditando = null;
    d.cargoForm.nome = d.cargoForm.nome ? '' : ' ';
    d.cargoForm.nome = '';
    d.cargoErro = '';
    this.items.update(v => [...v]);
  }

  editarCargo(condominioId: number, cargo: Cargo) {
    const d = this.detalhes.get(condominioId);
    if (!d) return;
    d.cargoEditando = cargo;
    d.cargoForm.nome = cargo.nome;
    d.cargoErro = '';
    this.items.update(v => [...v]);
  }

  cancelarFormCargo(condominioId: number) {
    const d = this.detalhes.get(condominioId);
    if (!d) return;
    d.cargoEditando = null;
    d.cargoForm.nome = '';
    d.cargoErro = '';
    this.items.update(v => [...v]);
  }

  salvarCargo(condominioId: number) {
    const d = this.detalhes.get(condominioId);
    if (!d || !d.cargoForm.nome.trim()) { if (d) d.cargoErro = 'Nome é obrigatório.'; this.items.update(v => [...v]); return; }
    const payload = { nome: d.cargoForm.nome.trim(), condominio: { id: condominioId } };
    const req$ = d.cargoEditando
      ? this.service.atualizarCargo(condominioId, d.cargoEditando.id!, payload)
      : this.service.criarCargo(condominioId, payload);
    req$.subscribe({
      next: () => {
        d.cargoEditando = null; d.cargoForm.nome = ''; d.cargoErro = '';
        this.recarregarDetalhe(condominioId);
      },
      error: err => { d.cargoErro = err?.error?.message || 'Erro ao salvar.'; this.items.update(v => [...v]); }
    });
  }

  excluirCargo(condominioId: number, cargo: Cargo) {
    if (!confirm(`Excluir cargo "${cargo.nome}"?`)) return;
    this.service.excluirCargo(condominioId, cargo.id!).subscribe({
      next: () => this.recarregarDetalhe(condominioId),
      error: err => alert(err?.error?.message || 'Erro ao excluir.')
    });
  }

  private recarregarDetalhe(condominioId: number) {
    forkJoin({ m: this.service.moradoresDeCondominio(condominioId), g: this.service.cargosDeCondominio(condominioId) }).subscribe({
      next: r => {
        const d = this.detalhes.get(condominioId);
        if (d) { d.moradores = r.m; d.cargos = r.g; }
        this.todosCargos = [...this.todosCargos.filter(c => c.condominio?.id !== condominioId), ...r.g];
        this.items.update(v => [...v]);
      }
    });
  }

  private recarregarTudo() {
    forkJoin({ c: this.service.condominios(), m: this.service.moradores(), g: this.service.cargos() }).subscribe({
      next: r => { this.items.set(r.c); this.todosmoradores = r.m; this.todosCargos = r.g; this.detalhes.clear(); }
    });
  }
}

function emptyForm() {
  return { nome: '', cnpj: '', endereco: '', telefone: '', email: '', responsavelNome: '', responsavelEmail: '', responsavelApartamento: '', responsavelBloco: '', responsavelTelefone: '' };
}
