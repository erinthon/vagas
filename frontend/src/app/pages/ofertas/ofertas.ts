import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OfertaService } from '../../services/oferta';
import { MoradorService } from '../../services/morador';
import { VagaService } from '../../services/api';
import { Oferta } from '../../models/oferta.model';
import { Morador } from '../../models/morador.model';
import { Vaga } from '../../models/vaga.model';

@Component({
  selector: 'app-ofertas',
  imports: [FormsModule, DatePipe],
  templateUrl: './ofertas.html',
  styleUrl: './ofertas.scss',
})
export class Ofertas implements OnInit {
  ofertas: Oferta[] = [];
  moradores: Morador[] = [];
  vagas: Vaga[] = [];
  erro = '';

  showForm = false;
  formOferta = this.ofertaVazia();
  moradorSelecionadoId: number | null = null;

  filtroInicio = '';
  filtroFim = '';

  constructor(
    private ofertaService: OfertaService,
    private moradorService: MoradorService,
    private vagaService: VagaService
  ) {}

  ngOnInit(): void {
    this.carregarOfertas();
    this.moradorService.listar().subscribe(d => this.moradores = d);
    this.vagaService.listar().subscribe(d => this.vagas = d);
  }

  carregarOfertas(): void {
    this.ofertaService.listar(this.filtroInicio || undefined, this.filtroFim || undefined).subscribe({
      next: (data) => this.ofertas = data,
      error: () => this.erro = 'Erro ao carregar ofertas.'
    });
  }

  filtrar(): void { this.carregarOfertas(); }

  limparFiltro(): void {
    this.filtroInicio = '';
    this.filtroFim = '';
    this.carregarOfertas();
  }

  vagasDoMorador(): Vaga[] {
    if (!this.moradorSelecionadoId) return [];
    return this.vagas.filter(v => v.proprietario?.id === Number(this.moradorSelecionadoId));
  }

  onMoradorChange(): void {
    this.formOferta.vaga = { numero: 0, tipo: 'DESCOBERTA' };
    const m = this.moradores.find(m => m.id === Number(this.moradorSelecionadoId));
    this.formOferta.morador = m ?? { nome: '', apartamento: '', bloco: '', email: '' };
  }

  salvarOferta(): void {
    const payload: Oferta = {
      ...this.formOferta,
      morador: this.moradores.find(m => m.id === Number(this.moradorSelecionadoId))!,
    };
    this.ofertaService.criar(payload).subscribe({
      next: () => { this.carregarOfertas(); this.cancelarForm(); },
      error: () => this.erro = 'Erro ao criar oferta.'
    });
  }

  encerrar(id: number): void {
    if (!confirm('Encerrar esta oferta?')) return;
    this.ofertaService.encerrar(id).subscribe({
      next: () => this.carregarOfertas(),
      error: () => this.erro = 'Erro ao encerrar oferta.'
    });
  }

  cancelarForm(): void {
    this.showForm = false;
    this.formOferta = this.ofertaVazia();
    this.moradorSelecionadoId = null;
    this.erro = '';
  }

  private ofertaVazia(): Oferta {
    return {
      morador: { nome: '', apartamento: '', bloco: '', email: '' },
      vaga: { numero: 0, tipo: 'DESCOBERTA' },
      dataInicio: '',
      dataFim: '',
      observacao: ''
    };
  }
}
