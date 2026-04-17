import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SolicitacaoService } from '../../services/solicitacao';
import { Solicitacao } from '../../models/solicitacao.model';

@Component({
  selector: 'app-solicitacoes',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './solicitacoes.html',
  styleUrl: './solicitacoes.scss',
})
export class Solicitacoes implements OnInit {

  solicitacoes = signal<Solicitacao[]>([]);
  carregando = signal(true);
  salvando = signal(false);
  erro = signal<string | null>(null);
  showForm = signal(false);
  cancelandoId = signal<number | null>(null);

  pendentes = computed(() => this.solicitacoes().filter(s => s.status === 'PENDENTE'));
  historico = computed(() => this.solicitacoes().filter(s => s.status !== 'PENDENTE'));

  form: { dataInicio: string; dataFim: string; observacao: string } = {
    dataInicio: '',
    dataFim: '',
    observacao: ''
  };

  constructor(private solicitacaoService: SolicitacaoService) {}

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.solicitacaoService.minhasSolicitacoes().subscribe({
      next: data => { this.solicitacoes.set(data); this.carregando.set(false); },
      error: () => this.carregando.set(false)
    });
  }

  abrirForm(): void {
    this.form = { dataInicio: '', dataFim: '', observacao: '' };
    this.erro.set(null);
    this.showForm.set(true);
  }

  cancelarForm(): void {
    this.showForm.set(false);
    this.erro.set(null);
  }

  salvar(): void {
    if (!this.form.dataInicio || !this.form.dataFim) return;
    this.salvando.set(true);
    this.erro.set(null);

    this.solicitacaoService.criarMinha({
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
        this.erro.set(err.error?.message ?? 'Erro ao criar solicitação.');
        this.salvando.set(false);
      }
    });
  }

  confirmarCancelar(id: number): void {
    this.cancelandoId.set(id);
  }

  cancelarSolicitacao(): void {
    const id = this.cancelandoId()!;
    this.salvando.set(true);
    this.solicitacaoService.cancelar(id).subscribe({
      next: () => {
        this.carregar();
        this.cancelandoId.set(null);
        this.salvando.set(false);
      },
      error: () => {
        this.erro.set('Erro ao cancelar solicitação.');
        this.cancelandoId.set(null);
        this.salvando.set(false);
      }
    });
  }

  descartarCancelamento(): void {
    this.cancelandoId.set(null);
  }

  hoje(): string {
    return new Date().toISOString().split('T')[0];
  }
}
