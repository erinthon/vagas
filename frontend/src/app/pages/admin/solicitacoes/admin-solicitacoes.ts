import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminPainelService } from '../../../services/admin-painel.service';
import { Solicitacao } from '../../../models/solicitacao.model';

@Component({
  selector: 'app-admin-solicitacoes',
  standalone: true,
  template: `
    <div class="page-header">
      <h1>📩 Solicitações</h1>
      <span class="badge">{{ items().length }}</span>
    </div>

    @if (carregando()) {
      <p class="loading">Carregando...</p>
    } @else {
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Morador</th><th>Início</th><th>Fim</th><th>Observação</th><th>Status</th><th>Oferta Atendida</th></tr>
          </thead>
          <tbody>
            @for (s of items(); track s.id) {
              <tr>
                <td class="id">{{ s.id }}</td>
                <td>{{ s.morador?.nome || '—' }}</td>
                <td>{{ s.dataInicio }}</td>
                <td>{{ s.dataFim }}</td>
                <td>{{ s.observacao || '—' }}</td>
                <td><span class="tag" [class]="statusClass(s.status)">{{ s.status }}</span></td>
                <td>{{ s.ofertaAtendida ? '#' + s.ofertaAtendida.id : '—' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: [`
    .page-header { display: flex; align-items: center; gap: .75rem; margin-bottom: 1.5rem; }
    h1 { margin: 0; font-size: 1.4rem; color: #1e293b; }
    .badge { background: #3b82f6; color: white; border-radius: 999px; padding: .2rem .7rem; font-size: .8rem; font-weight: 700; }
    .loading { color: #64748b; }
    .table-wrap { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.08); border: 1px solid #e2e8f0; overflow: auto; }
    table { width: 100%; border-collapse: collapse; font-size: .875rem; }
    th { background: #f1f5f9; color: #475569; font-weight: 600; padding: .75rem 1rem; text-align: left; white-space: nowrap; }
    td { padding: .7rem 1rem; border-top: 1px solid #f1f5f9; color: #334155; }
    tr:hover td { background: #f8fafc; }
    .id { color: #94a3b8; font-size: .8rem; }
    .tag { padding: .2rem .6rem; border-radius: 999px; font-size: .75rem; font-weight: 600; background: #f1f5f9; color: #475569; }
    .PENDENTE  { background: #fef9c3; color: #854d0e; }
    .ATENDIDA  { background: #dcfce7; color: #166534; }
    .CANCELADA { background: #fee2e2; color: #991b1b; }
  `]
})
export class AdminSolicitacoes implements OnInit {
  private readonly service = inject(AdminPainelService);
  carregando = signal(true);
  items = signal<Solicitacao[]>([]);

  statusClass(status?: string) { return status ?? ''; }

  ngOnInit() {
    this.service.solicitacoes().subscribe({ next: d => { this.items.set(d); this.carregando.set(false); }, error: () => this.carregando.set(false) });
  }
}
