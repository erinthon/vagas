import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitacao } from '../models/solicitacao.model';

const BASE = 'http://localhost:8080/api/solicitacoes';

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {
  constructor(private http: HttpClient) {}

  listarPendentes(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(BASE);
  }

  listarPorMorador(moradorId: number): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${BASE}/morador/${moradorId}`);
  }

  buscar(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${BASE}/${id}`);
  }

  criar(solicitacao: Solicitacao): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(BASE, solicitacao);
  }

  atender(id: number, ofertaId: number): Observable<Solicitacao> {
    const params = new HttpParams().set('ofertaId', ofertaId.toString());
    return this.http.patch<Solicitacao>(`${BASE}/${id}/atender`, {}, { params });
  }

  cancelar(id: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${BASE}/${id}/cancelar`, {});
  }

  minhasSolicitacoes(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${BASE}/minhas`);
  }

  criarMinha(dados: { dataInicio: string; dataFim: string; observacao?: string }): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(`${BASE}/minhas`, dados);
  }
}
