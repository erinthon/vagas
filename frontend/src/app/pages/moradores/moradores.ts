import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MoradorService } from '../../services/morador';
import { VagaService } from '../../services/api';
import { Morador } from '../../models/morador.model';
import { Vaga } from '../../models/vaga.model';

@Component({
  selector: 'app-moradores',
  imports: [FormsModule],
  templateUrl: './moradores.html',
  styleUrl: './moradores.scss',
})
export class Moradores implements OnInit {
  moradores: Morador[] = [];
  vagas: Vaga[] = [];
  erro = '';

  showFormMorador = false;
  editandoMoradorId: number | null = null;
  formMorador: Morador = this.moradorVazio();

  showFormVaga = false;
  editandoVagaId: number | null = null;
  formVaga: Vaga = this.vagaVazia();

  constructor(
    private moradorService: MoradorService,
    private vagaService: VagaService
  ) {}

  ngOnInit(): void {
    this.carregarMoradores();
    this.carregarVagas();
  }

  carregarMoradores(): void {
    this.moradorService.listar().subscribe({
      next: (data) => this.moradores = data,
      error: () => this.erro = 'Erro ao carregar moradores.'
    });
  }

  carregarVagas(): void {
    this.vagaService.listar().subscribe({
      next: (data) => this.vagas = data,
      error: () => {}
    });
  }

  editarMorador(m: Morador): void {
    this.formMorador = { ...m };
    this.editandoMoradorId = m.id!;
    this.showFormMorador = true;
  }

  salvarMorador(): void {
    if (this.editandoMoradorId) {
      this.moradorService.atualizar(this.editandoMoradorId, this.formMorador).subscribe({
        next: () => { this.carregarMoradores(); this.cancelarFormMorador(); },
        error: () => this.erro = 'Erro ao atualizar morador.'
      });
    } else {
      this.moradorService.criar(this.formMorador).subscribe({
        next: () => { this.carregarMoradores(); this.cancelarFormMorador(); },
        error: () => this.erro = 'Erro ao criar morador.'
      });
    }
  }

  excluirMorador(id: number): void {
    if (!confirm('Excluir morador?')) return;
    this.moradorService.excluir(id).subscribe({
      next: () => this.carregarMoradores(),
      error: () => this.erro = 'Erro ao excluir morador.'
    });
  }

  cancelarFormMorador(): void {
    this.showFormMorador = false;
    this.editandoMoradorId = null;
    this.formMorador = this.moradorVazio();
    this.erro = '';
  }

  editarVaga(v: Vaga): void {
    this.formVaga = { ...v, proprietario: v.proprietario };
    this.editandoVagaId = v.id!;
    this.showFormVaga = true;
  }

  salvarVaga(): void {
    const payload: Vaga = {
      ...this.formVaga,
      proprietario: this.moradores.find(m => m.id === Number(this.formVaga.proprietario?.id)) || undefined
    };
    if (this.editandoVagaId) {
      this.vagaService.atualizar(this.editandoVagaId, payload).subscribe({
        next: () => { this.carregarVagas(); this.cancelarFormVaga(); },
        error: () => this.erro = 'Erro ao atualizar vaga.'
      });
    } else {
      this.vagaService.criar(payload).subscribe({
        next: () => { this.carregarVagas(); this.cancelarFormVaga(); },
        error: () => this.erro = 'Erro ao criar vaga.'
      });
    }
  }

  excluirVaga(id: number): void {
    if (!confirm('Excluir vaga?')) return;
    this.vagaService.excluir(id).subscribe({
      next: () => this.carregarVagas(),
      error: () => this.erro = 'Erro ao excluir vaga.'
    });
  }

  cancelarFormVaga(): void {
    this.showFormVaga = false;
    this.editandoVagaId = null;
    this.formVaga = this.vagaVazia();
    this.erro = '';
  }

  private moradorVazio(): Morador {
    return { nome: '', apartamento: '', bloco: '', email: '', telefone: '' };
  }

  private vagaVazia(): Vaga {
    return { numero: 0, tipo: 'DESCOBERTA' };
  }
}
