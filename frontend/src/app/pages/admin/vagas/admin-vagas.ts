import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminPainelService } from '../../../services/admin-painel.service';
import { Vaga } from '../../../models/vaga.model';

@Component({
  selector: 'app-admin-vagas',
  standalone: true,
  template: `
    <div class="page-header">
      <h1>🅿 Vagas</h1>
      <span class="badge">{{ items().length }}</span>
    </div>

    @if (carregando()) {
      <p class="loading">Carregando...</p>
    } @else {
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Número</th><th>Tipo</th><th>Proprietário</th><th>Condomínio</th></tr>
          </thead>
          <tbody>
            @for (v of items(); track v.id) {
              <tr>
                <td class="id">{{ v.id }}</td>
                <td><strong>{{ v.numero }}</strong></td>
                <td><span class="tag" [class.coberta]="v.tipo === 'COBERTA'">{{ v.tipo }}</span></td>
                <td>{{ v.proprietario?.nome || '—' }}</td>
                <td>{{ v.proprietario?.condominio?.nome || '—' }}</td>
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
    th { background: #f1f5f9; color: #475569; font-weight: 600; padding: .75rem 1rem; text-align: left; }
    td { padding: .7rem 1rem; border-top: 1px solid #f1f5f9; color: #334155; }
    tr:hover td { background: #f8fafc; }
    .id { color: #94a3b8; font-size: .8rem; }
    .tag { padding: .2rem .6rem; border-radius: 999px; font-size: .75rem; font-weight: 600; background: #f1f5f9; color: #475569; }
    .tag.coberta { background: #dbeafe; color: #1d4ed8; }
  `]
})
export class AdminVagas implements OnInit {
  private readonly service = inject(AdminPainelService);
  carregando = signal(true);
  items = signal<Vaga[]>([]);

  ngOnInit() {
    this.service.vagas().subscribe({ next: d => { this.items.set(d); this.carregando.set(false); }, error: () => this.carregando.set(false) });
  }
}
