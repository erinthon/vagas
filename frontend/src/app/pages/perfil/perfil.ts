import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Morador } from '../../models/morador.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil implements OnInit {

  editando = signal(false);
  salvando = signal(false);
  form: Partial<Morador> = {};

  constructor(readonly auth: AuthService) {}

  ngOnInit(): void {
    if (!this.auth.currentUser()) {
      this.auth.loadCurrentUser().subscribe();
    }
  }

  startEdit(): void {
    const u = this.auth.currentUser()!;
    this.form = { apartamento: u.apartamento, bloco: u.bloco, telefone: u.telefone };
    this.editando.set(true);
  }

  save(): void {
    this.salvando.set(true);
    this.auth.updateProfile(this.form).subscribe({
      next: () => { this.editando.set(false); this.salvando.set(false); },
      error: () => this.salvando.set(false)
    });
  }

  cancel(): void {
    this.editando.set(false);
  }
}
