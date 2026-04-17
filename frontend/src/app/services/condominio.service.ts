import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Condominio } from '../models/condominio.model';
import { Cargo } from '../models/cargo.model';

const API = 'http://localhost:8080/api/condominios';

@Injectable({ providedIn: 'root' })
export class CondominioService {

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Condominio[]>(API);
  }

  buscar(id: number) {
    return this.http.get<Condominio>(`${API}/${id}`);
  }

  criar(c: Condominio) {
    return this.http.post<Condominio>(API, c);
  }

  atualizar(id: number, c: Condominio) {
    return this.http.put<Condominio>(`${API}/${id}`, c);
  }

  deletar(id: number) {
    return this.http.delete<void>(`${API}/${id}`);
  }

  listarCargos(condominioId: number) {
    return this.http.get<Cargo[]>(`${API}/${condominioId}/cargos`);
  }

  criarCargo(condominioId: number, cargo: Cargo) {
    return this.http.post<Cargo>(`${API}/${condominioId}/cargos`, cargo);
  }

  atualizarCargo(condominioId: number, cargoId: number, cargo: Cargo) {
    return this.http.put<Cargo>(`${API}/${condominioId}/cargos/${cargoId}`, cargo);
  }

  deletarCargo(condominioId: number, cargoId: number) {
    return this.http.delete<void>(`${API}/${condominioId}/cargos/${cargoId}`);
  }
}
