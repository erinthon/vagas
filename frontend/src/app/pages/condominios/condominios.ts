import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CondominioService } from '../../services/condominio.service';
import { Condominio } from '../../models/condominio.model';
import { Cargo } from '../../models/cargo.model';

interface CondominioVM extends Condominio {
  cargos?: Cargo[];
  cargosExpanded?: boolean;
  cargosLoaded?: boolean;
  novoCargo?: string;
  cargoEditandoId?: number | null;
  cargoEditandoNome?: string;
}

@Component({
  selector: 'app-condominios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './condominios.html',
  styleUrl: './condominios.scss'
})
export class Condominios implements OnInit {

  condominios = signal<CondominioVM[]>([]);
  mostrarForm = signal(false);
  editando = signal<Condominio | null>(null);
  salvando = signal(false);

  form: Partial<Condominio> = {};

  constructor(private service: CondominioService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.listar().subscribe(lista =>
      this.condominios.set(lista.map(c => ({ ...c, cargos: [], cargosExpanded: false, cargosLoaded: false })))
    );
  }

  abrirForm(cond?: CondominioVM): void {
    this.editando.set(cond ?? null);
    this.form = cond ? { ...cond } : {};
    this.mostrarForm.set(true);
  }

  fecharForm(): void {
    this.mostrarForm.set(false);
    this.editando.set(null);
    this.form = {};
  }

  salvar(): void {
    if (!this.form.nome?.trim()) return;
    this.salvando.set(true);
    const ed = this.editando();
    const req = ed?.id
      ? this.service.atualizar(ed.id, this.form as Condominio)
      : this.service.criar(this.form as Condominio);

    req.subscribe({
      next: () => { this.carregar(); this.fecharForm(); this.salvando.set(false); },
      error: () => this.salvando.set(false)
    });
  }

  deletar(id: number): void {
    if (!confirm('Remover este condomínio?')) return;
    this.service.deletar(id).subscribe(() => this.carregar());
  }

  toggleCargos(cond: CondominioVM): void {
    cond.cargosExpanded = !cond.cargosExpanded;
    if (cond.cargosExpanded && !cond.cargosLoaded) {
      this.carregarCargos(cond);
    }
  }

  carregarCargos(cond: CondominioVM): void {
    this.service.listarCargos(cond.id!).subscribe(cargos => {
      cond.cargos = cargos;
      cond.cargosLoaded = true;
      this.condominios.update(l => [...l]);
    });
  }

  adicionarCargo(cond: CondominioVM): void {
    const nome = cond.novoCargo?.trim();
    if (!nome) return;
    this.service.criarCargo(cond.id!, { nome }).subscribe(cargo => {
      cond.cargos = [...(cond.cargos ?? []), cargo];
      cond.novoCargo = '';
      this.condominios.update(l => [...l]);
    });
  }

  iniciarEdicaoCargo(cond: CondominioVM, cargo: Cargo): void {
    cond.cargoEditandoId = cargo.id;
    cond.cargoEditandoNome = cargo.nome;
    this.condominios.update(l => [...l]);
  }

  salvarEdicaoCargo(cond: CondominioVM, cargo: Cargo): void {
    const nome = cond.cargoEditandoNome?.trim();
    if (!nome) return;
    this.service.atualizarCargo(cond.id!, cargo.id!, { nome }).subscribe(updated => {
      const idx = cond.cargos!.findIndex(c => c.id === cargo.id);
      if (idx !== -1) cond.cargos![idx] = updated;
      cond.cargoEditandoId = null;
      this.condominios.update(l => [...l]);
    });
  }

  cancelarEdicaoCargo(cond: CondominioVM): void {
    cond.cargoEditandoId = null;
    this.condominios.update(l => [...l]);
  }

  deletarCargo(cond: CondominioVM, cargo: Cargo): void {
    this.service.deletarCargo(cond.id!, cargo.id!).subscribe(() => {
      cond.cargos = cond.cargos!.filter(c => c.id !== cargo.id);
      this.condominios.update(l => [...l]);
    });
  }
}
