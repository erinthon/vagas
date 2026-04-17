import { Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdminPainelService } from '../../../services/admin-painel.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1 class="title">Dashboard</h1>

    @if (carregando()) {
      <p class="loading">Carregando...</p>
    } @else {
      <div class="grid">
        <a routerLink="/admin/condominios" class="card">
          <div class="num">{{ stats.condominios }}</div>
          <div class="label">🏢 Condomínios</div>
        </a>
        <a routerLink="/admin/moradores" class="card">
          <div class="num">{{ stats.moradores }}</div>
          <div class="label">👥 Moradores</div>
        </a>
        <a routerLink="/admin/vagas" class="card">
          <div class="num">{{ stats.vagas }}</div>
          <div class="label">🅿 Vagas</div>
        </a>
        <a routerLink="/admin/cargos" class="card">
          <div class="num">{{ stats.cargos }}</div>
          <div class="label">🏅 Cargos</div>
        </a>
        <a routerLink="/admin/ofertas" class="card">
          <div class="num">{{ stats.ofertas }}</div>
          <div class="label">📋 Ofertas</div>
        </a>
        <a routerLink="/admin/solicitacoes" class="card">
          <div class="num">{{ stats.solicitacoes }}</div>
          <div class="label">📩 Solicitações</div>
        </a>
      </div>
    }
  `,
  styles: [`
    .title { margin: 0 0 1.5rem; font-size: 1.5rem; color: #1e293b; }
    .loading { color: #64748b; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
    .card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      text-decoration: none;
      box-shadow: 0 1px 3px rgba(0,0,0,.08);
      border: 1px solid #e2e8f0;
      transition: box-shadow .2s, transform .2s;
    }
    .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.12); transform: translateY(-2px); }
    .num   { font-size: 2.5rem; font-weight: 800; color: #3b82f6; line-height: 1; }
    .label { margin-top: .5rem; font-size: .85rem; color: #64748b; font-weight: 500; }
  `]
})
export class AdminDashboard implements OnInit {
  private readonly service = inject(AdminPainelService);

  carregando = signal(true);
  stats = { condominios: 0, moradores: 0, vagas: 0, cargos: 0, ofertas: 0, solicitacoes: 0 };

  ngOnInit() {
    forkJoin({
      condominios:  this.service.condominios(),
      moradores:    this.service.moradores(),
      vagas:        this.service.vagas(),
      cargos:       this.service.cargos(),
      ofertas:      this.service.ofertas(),
      solicitacoes: this.service.solicitacoes(),
    }).subscribe({
      next: data => {
        this.stats = {
          condominios:  data.condominios.length,
          moradores:    data.moradores.length,
          vagas:        data.vagas.length,
          cargos:       data.cargos.length,
          ofertas:      data.ofertas.length,
          solicitacoes: data.solicitacoes.length,
        };
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }
}
