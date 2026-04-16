import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Morador } from '../models/morador.model';

const BASE = 'http://localhost:8080/api/moradores';

@Injectable({ providedIn: 'root' })
export class MoradorService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Morador[]> {
    return this.http.get<Morador[]>(BASE);
  }

  buscar(id: number): Observable<Morador> {
    return this.http.get<Morador>(`${BASE}/${id}`);
  }

  criar(morador: Morador): Observable<Morador> {
    return this.http.post<Morador>(BASE, morador);
  }

  atualizar(id: number, morador: Morador): Observable<Morador> {
    return this.http.put<Morador>(`${BASE}/${id}`, morador);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/${id}`);
  }
}
