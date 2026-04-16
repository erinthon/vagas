import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SolicitacaoService } from '../../services/solicitacao';
import { MoradorService } from '../../services/morador';
import { OfertaService } from '../../services/oferta';
import { Solicitacao } from '../../models/solicitacao.model';
import { Morador } from '../../models/morador.model';
import { Oferta } from '../../models/oferta.model';

@Component({
  selector: 'app-solicitacoes',
  imports: [FormsModule, DatePipe],
  templateUrl: './solicitacoes.html',
  styleUrl: './solicitacoes.scss',
})
export class Solicitacoes implements OnInit {
  solicitacoes: Solicitacao[] = [];
  moradores: Morador[] = [];
  ofertasAtivas: Oferta[] = [];
  erro = '';

  showForm = false;
  formSolicitacao = this.solicitacaoVazia();
  moradorSelecionadoId: number | null = null;

  atendendoId: number | null = null;
  ofertaSelecionadaId: number | null = null;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private moradorService: MoradorService,
    private ofertaService: OfertaService
  ) {}

  ngOnInit(): void {
    this.carregarSolicitacoes();
    this.moradorService.listar().subscribe(d => this.moradores = d);
    this.ofertaService.listar().subscribe(d => this.ofertasAtivas = d);
  }

  carregarSolicitacoes(): void {
    this.solicitacaoService.listarPendentes().subscribe({
      next: (data) => this.solicitacoes = data,
      error: () => this.erro = 'Erro ao carregar solicitações.'
    });
  }

  onMoradorChange(): void {
    const m = this.moradores.find(m => m.id === Number(this.moradorSelecionadoId));
    this.formSolicitacao.morador = m ?? { nome: '', apartamento: '', bloco: '', email: '' };
  }

  salvarSolicitacao(): void {
    const payload: Solicitacao = {
      ...this.formSolicitacao,
      morador: this.moradores.find(m => m.id === Number(this.moradorSelecionadoId))!,
    };
    this.solicitacaoService.criar(payload).subscribe({
      next: () => { this.carregarSolicitacoes(); this.cancelarForm(); },
      error: () => this.erro = 'Erro ao criar solicitação.'
    });
  }

  iniciarAtendimento(id: number): void {
    this.atendendoId = id;
    this.ofertaSelecionadaId = null;
  }

  confirmarAtendimento(): void {
    if (!this.atendendoId || !this.ofertaSelecionadaId) return;
    this.solicitacaoService.atender(this.atendendoId, this.ofertaSelecionadaId).subscribe({
      next: () => {
        this.carregarSolicitacoes();
        this.ofertaService.listar().subscribe(d => this.ofertasAtivas = d);
        this.cancelarAtendimento();
      },
      error: () => this.erro = 'Erro ao atender solicitação.'
    });
  }

  cancelarAtendimento(): void {
    this.atendendoId = null;
    this.ofertaSelecionadaId = null;
  }

  cancelarSolicitacao(id: number): void {
    if (!confirm('Cancelar esta solicitação?')) return;
    this.solicitacaoService.cancelar(id).subscribe({
      next: () => this.carregarSolicitacoes(),
      error: () => this.erro = 'Erro ao cancelar solicitação.'
    });
  }

  cancelarForm(): void {
    this.showForm = false;
    this.formSolicitacao = this.solicitacaoVazia();
    this.moradorSelecionadoId = null;
    this.erro = '';
  }

  private solicitacaoVazia(): Solicitacao {
    return {
      morador: { nome: '', apartamento: '', bloco: '', email: '' },
      dataInicio: '',
      dataFim: '',
      observacao: ''
    };
  }
}
