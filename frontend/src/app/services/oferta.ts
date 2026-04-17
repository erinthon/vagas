import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Oferta } from '../models/oferta.model';

const BASE = 'http://localhost:8080/api/ofertas';

@Injectable({ providedIn: 'root' })
export class OfertaService {
  constructor(private http: HttpClient) {}

  listar(dataInicio?: string, dataFim?: string): Observable<Oferta[]> {
    let params = new HttpParams();
    if (dataInicio) params = params.set('dataInicio', dataInicio);
    if (dataFim) params = params.set('dataFim', dataFim);
    return this.http.get<Oferta[]>(BASE, { params });
  }

  buscar(id: number): Observable<Oferta> {
    return this.http.get<Oferta>(`${BASE}/${id}`);
  }

  criar(oferta: Oferta): Observable<Oferta> {
    return this.http.post<Oferta>(BASE, oferta);
  }

  encerrar(id: number): Observable<Oferta> {
    return this.http.patch<Oferta>(`${BASE}/${id}/encerrar`, {});
  }

  minhasOfertas(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${BASE}/minhas`);
  }

  criarMinha(dados: { vaga: { id: number }; dataInicio: string; dataFim: string; observacao?: string }): Observable<Oferta> {
    return this.http.post<Oferta>(`${BASE}/minhas`, dados);
  }
}
