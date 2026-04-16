import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MoradorService } from '../../services/morador';
import { VagaService } from '../../services/api';
import { OfertaService } from '../../services/oferta';
import { SolicitacaoService } from '../../services/solicitacao';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  stats = { moradores: 0, vagas: 0, ofertasAtivas: 0, solicitacoesPendentes: 0 };
  carregando = true;

  constructor(
    private moradorService: MoradorService,
    private vagaService: VagaService,
    private ofertaService: OfertaService,
    private solicitacaoService: SolicitacaoService
  ) {}

  ngOnInit(): void {
    forkJoin({
      moradores: this.moradorService.listar(),
      vagas: this.vagaService.listar(),
      ofertas: this.ofertaService.listar(),
      solicitacoes: this.solicitacaoService.listarPendentes(),
    }).subscribe({
      next: (data) => {
        this.stats.moradores = data.moradores.length;
        this.stats.vagas = data.vagas.length;
        this.stats.ofertasAtivas = data.ofertas.length;
        this.stats.solicitacoesPendentes = data.solicitacoes.length;
        this.carregando = false;
      },
      error: () => { this.carregando = false; }
    });
  }
}
