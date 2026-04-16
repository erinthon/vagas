import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vaga } from '../models/vaga.model';

const BASE = 'http://localhost:8080/api/vagas';

@Injectable({ providedIn: 'root' })
export class VagaService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Vaga[]> {
    return this.http.get<Vaga[]>(BASE);
  }

  listarPorMorador(moradorId: number): Observable<Vaga[]> {
    return this.http.get<Vaga[]>(`${BASE}?proprietarioId=${moradorId}`);
  }

  criar(vaga: Vaga): Observable<Vaga> {
    return this.http.post<Vaga>(BASE, vaga);
  }

  atualizar(id: number, vaga: Vaga): Observable<Vaga> {
    return this.http.put<Vaga>(`${BASE}/${id}`, vaga);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/${id}`);
  }
}
