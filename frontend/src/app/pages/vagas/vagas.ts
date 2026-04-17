import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VagaService } from '../../services/api';
import { Vaga, TipoVaga } from '../../models/vaga.model';

type Modo = 'view' | 'cadastrar' | 'editar';

@Component({
  selector: 'app-vagas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vagas.html',
  styleUrl: './vagas.scss'
})
export class Vagas implements OnInit {

  vaga = signal<Vaga | null>(null);
  carregando = signal(true);
  salvando = signal(false);
  erro = signal<string | null>(null);
  modo = signal<Modo>('view');
  confirmandoExclusao = signal(false);

  form: { numero: number | null; tipo: TipoVaga } = { numero: null, tipo: 'DESCOBERTA' };

  constructor(private vagaService: VagaService) {}

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.vagaService.minhasVagas().subscribe({
      next: vagas => {
        this.vaga.set(vagas[0] ?? null);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  iniciarCadastro(): void {
    this.form = { numero: null, tipo: 'DESCOBERTA' };
    this.erro.set(null);
    this.modo.set('cadastrar');
  }

  iniciarEdicao(): void {
    const v = this.vaga()!;
    this.form = { numero: v.numero, tipo: v.tipo };
    this.erro.set(null);
    this.modo.set('editar');
  }

  cancelar(): void {
    this.modo.set('view');
    this.erro.set(null);
    this.confirmandoExclusao.set(false);
  }

  salvar(): void {
    if (this.form.numero == null) return;
    this.salvando.set(true);
    this.erro.set(null);

    const dados = { numero: this.form.numero, tipo: this.form.tipo };

    if (this.modo() === 'cadastrar') {
      this.vagaService.criarMinha(dados).subscribe({
        next: vaga => {
          this.vaga.set(vaga);
          this.modo.set('view');
          this.salvando.set(false);
        },
        error: (err) => {
          this.erro.set(err.error?.message ?? 'Erro ao cadastrar vaga.');
          this.salvando.set(false);
        }
      });
    } else {
      const id = this.vaga()!.id!;
      this.vagaService.atualizar(id, { ...dados, proprietario: this.vaga()!.proprietario }).subscribe({
        next: vaga => {
          this.vaga.set(vaga);
          this.modo.set('view');
          this.salvando.set(false);
        },
        error: (err) => {
          this.erro.set(err.error?.message ?? 'Erro ao atualizar vaga.');
          this.salvando.set(false);
        }
      });
    }
  }

  excluir(): void {
    this.salvando.set(true);
    this.vagaService.excluir(this.vaga()!.id!).subscribe({
      next: () => {
        this.vaga.set(null);
        this.confirmandoExclusao.set(false);
        this.salvando.set(false);
        this.modo.set('view');
      },
      error: (err) => {
        this.erro.set(err.error?.message ?? 'Erro ao excluir vaga.');
        this.confirmandoExclusao.set(false);
        this.salvando.set(false);
      }
    });
  }
}
