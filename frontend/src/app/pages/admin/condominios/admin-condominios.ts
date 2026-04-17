import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminPainelService } from '../../../services/admin-painel.service';
import { Condominio } from '../../../models/condominio.model';

@Component({
  selector: 'app-admin-condominios',
  standalone: true,
  template: `
    <div class="page-header">
      <h1>🏢 Condomínios</h1>
      <span class="badge">{{ items().length }}</span>
    </div>

    @if (carregando()) {
      <p class="loading">Carregando...</p>
    } @else {
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Nome</th><th>CNPJ</th><th>Endereço</th><th>Telefone</th><th>E-mail</th>
            </tr>
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
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: [tableStyles()]
})
export class AdminCondominios implements OnInit {
  private readonly service = inject(AdminPainelService);
  carregando = signal(true);
  items = signal<Condominio[]>([]);

  ngOnInit() {
    this.service.condominios().subscribe({ next: d => { this.items.set(d); this.carregando.set(false); }, error: () => this.carregando.set(false) });
  }
}

function tableStyles(): string {
  return `
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
  `;
}
