import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Condominio } from '../models/condominio.model';
import { Morador } from '../models/morador.model';
import { Cargo } from '../models/cargo.model';
import { Vaga } from '../models/vaga.model';
import { Oferta } from '../models/oferta.model';
import { Solicitacao } from '../models/solicitacao.model';
import { AdminUser } from '../models/admin-user.model';

const BASE = 'http://localhost:8080/api/admin';

@Injectable({ providedIn: 'root' })
export class AdminPainelService {
  private readonly http = inject(HttpClient);

  condominios()   { return this.http.get<Condominio[]>(`${BASE}/painel/condominios`); }
  moradores()     { return this.http.get<Morador[]>(`${BASE}/painel/moradores`); }
  vagas()         { return this.http.get<Vaga[]>(`${BASE}/painel/vagas`); }
  cargos()        { return this.http.get<Cargo[]>(`${BASE}/painel/cargos`); }
  ofertas()       { return this.http.get<Oferta[]>(`${BASE}/painel/ofertas`); }
  solicitacoes()  { return this.http.get<Solicitacao[]>(`${BASE}/painel/solicitacoes`); }
  usuarios()      { return this.http.get<AdminUser[]>(`${BASE}/usuarios`); }

  criarUsuario(data: { username: string; nome: string; email: string; senha: string }) {
    return this.http.post<AdminUser>(`${BASE}/usuarios`, data);
  }
}
