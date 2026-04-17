import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OfertaService } from '../../services/oferta';
import { VagaService } from '../../services/api';
import { Oferta } from '../../models/oferta.model';
import { Vaga } from '../../models/vaga.model';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './ofertas.html',
  styleUrl: './ofertas.scss',
})
export class Ofertas implements OnInit {

  ofertas = signal<Oferta[]>([]);
  minhasVagas = signal<Vaga[]>([]);
  carregando = signal(true);
  salvando = signal(false);
  erro = signal<string | null>(null);
  showForm = signal(false);
  encerrandoId = signal<number | null>(null);

  ofertasAtivas = computed(() => this.ofertas().filter(o => o.status === 'ATIVA'));
  ofertasEncerradas = computed(() => this.ofertas().filter(o => o.status === 'ENCERRADA'));

  form: { vagaId: number | null; dataInicio: string; dataFim: string; observacao: string } = {
    vagaId: null,
    dataInicio: '',
    dataFim: '',
    observacao: ''
  };

  constructor(
    private ofertaService: OfertaService,
    private vagaService: VagaService
  ) {}

  ngOnInit(): void {
    this.carregar();
    this.vagaService.minhasVagas().subscribe(v => this.minhasVagas.set(v));
  }

  private carregar(): void {
    this.carregando.set(true);
    this.ofertaService.minhasOfertas().subscribe({
      next: data => { this.ofertas.set(data); this.carregando.set(false); },
      error: () => this.carregando.set(false)
    });
  }

  abrirForm(): void {
    this.form = { vagaId: null, dataInicio: '', dataFim: '', observacao: '' };
    this.erro.set(null);
    this.showForm.set(true);
  }

  cancelarForm(): void {
    this.showForm.set(false);
    this.erro.set(null);
  }

  salvar(): void {
    if (!this.form.vagaId || !this.form.dataInicio || !this.form.dataFim) return;
    this.salvando.set(true);
    this.erro.set(null);

    this.ofertaService.criarMinha({
      vaga: { id: this.form.vagaId },
      dataInicio: this.form.dataInicio,
      dataFim: this.form.dataFim,
      observacao: this.form.observacao || undefined
    }).subscribe({
      next: () => {
        this.carregar();
        this.showForm.set(false);
        this.salvando.set(false);
      },
      error: (err) => {
        this.erro.set(err.error?.message ?? 'Erro ao criar oferta.');
        this.salvando.set(false);
      }
    });
  }

  confirmarEncerrar(id: number): void {
    this.encerrandoId.set(id);
  }

  encerrar(): void {
    const id = this.encerrandoId()!;
    this.salvando.set(true);
    this.ofertaService.encerrar(id).subscribe({
      next: () => {
        this.carregar();
        this.encerrandoId.set(null);
        this.salvando.set(false);
      },
      error: () => {
        this.erro.set('Erro ao encerrar oferta.');
        this.encerrandoId.set(null);
        this.salvando.set(false);
      }
    });
  }

  cancelarEncerrar(): void {
    this.encerrandoId.set(null);
  }

  hoje(): string {
    return new Date().toISOString().split('T')[0];
  }
}
