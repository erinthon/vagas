import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Condominio } from '../models/condominio.model';
import { Morador } from '../models/morador.model';
import { Cargo } from '../models/cargo.model';
import { Vaga } from '../models/vaga.model';
import { Oferta } from '../models/oferta.model';
import { Solicitacao } from '../models/solicitacao.model';
import { AdminUser } from '../models/admin-user.model';

const ADMIN = 'http://localhost:8080/api/admin';
const API   = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class AdminPainelService {
  private readonly http = inject(HttpClient);

  // --- leitura painel ---
  condominios()  { return this.http.get<Condominio[]>(`${ADMIN}/painel/condominios`); }
  moradores()    { return this.http.get<Morador[]>(`${ADMIN}/painel/moradores`); }
  vagas()        { return this.http.get<Vaga[]>(`${ADMIN}/painel/vagas`); }
  cargos()       { return this.http.get<Cargo[]>(`${ADMIN}/painel/cargos`); }
  ofertas()      { return this.http.get<Oferta[]>(`${ADMIN}/painel/ofertas`); }
  solicitacoes() { return this.http.get<Solicitacao[]>(`${ADMIN}/painel/solicitacoes`); }
  usuarios()     { return this.http.get<AdminUser[]>(`${ADMIN}/usuarios`); }

  moradoresDeCondominio(id: number) { return this.http.get<Morador[]>(`${ADMIN}/painel/condominios/${id}/moradores`); }
  cargosDeCondominio(id: number)    { return this.http.get<Cargo[]>(`${ADMIN}/painel/condominios/${id}/cargos`); }

  // --- condominios ---
  criarCondominio(data: object)              { return this.http.post<Condominio>(`${API}/condominios`, data); }
  atualizarCondominio(id: number, d: object) { return this.http.put<Condominio>(`${API}/condominios/${id}`, d); }
  deletarCondominio(id: number)              { return this.http.delete<void>(`${API}/condominios/${id}`); }

  // --- moradores ---
  criarMorador(data: object)               { return this.http.post<Morador>(`${API}/moradores`, data); }
  atualizarMorador(id: number, d: object)  { return this.http.put<Morador>(`${API}/moradores/${id}`, d); }
  vincularCondominio(id: number, d: object) { return this.http.patch<Morador>(`${API}/moradores/${id}/condominio`, d); }
  excluirMorador(id: number)               { return this.http.delete<void>(`${API}/moradores/${id}`); }

  // --- vagas ---
  criarVaga(data: object)              { return this.http.post<Vaga>(`${API}/vagas`, data); }
  atualizarVaga(id: number, d: object) { return this.http.put<Vaga>(`${API}/vagas/${id}`, d); }
  excluirVaga(id: number)              { return this.http.delete<void>(`${API}/vagas/${id}`); }

  // --- cargos ---
  criarCargo(condominioId: number, d: object)               { return this.http.post<Cargo>(`${API}/condominios/${condominioId}/cargos`, d); }
  atualizarCargo(condominioId: number, id: number, d: object){ return this.http.put<Cargo>(`${API}/condominios/${condominioId}/cargos/${id}`, d); }
  excluirCargo(condominioId: number, id: number)             { return this.http.delete<void>(`${API}/condominios/${condominioId}/cargos/${id}`); }

  // --- ofertas ---
  criarOferta(data: object)  { return this.http.post<Oferta>(`${API}/ofertas`, data); }
  encerrarOferta(id: number) { return this.http.patch<Oferta>(`${API}/ofertas/${id}/encerrar`, {}); }

  // --- solicitacoes ---
  criarSolicitacao(data: object)                { return this.http.post<Solicitacao>(`${API}/solicitacoes`, data); }
  atenderSolicitacao(id: number, ofertaId: number) { return this.http.patch<Solicitacao>(`${API}/solicitacoes/${id}/atender?ofertaId=${ofertaId}`, {}); }
  cancelarSolicitacao(id: number)               { return this.http.patch<Solicitacao>(`${API}/solicitacoes/${id}/cancelar`, {}); }

  // --- admin users ---
  criarUsuario(data: { username: string; nome: string; email: string; senha: string }) {
    return this.http.post<AdminUser>(`${ADMIN}/usuarios`, data);
  }
  atualizarUsuario(id: number, data: { nome: string; email: string; senha?: string }) {
    return this.http.put<AdminUser>(`${ADMIN}/usuarios/${id}`, data);
  }
  excluirUsuario(id: number) {
    return this.http.delete<void>(`${ADMIN}/usuarios/${id}`);
  }
}
