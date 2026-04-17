import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SolicitacaoService } from './solicitacao';

describe('SolicitacaoService', () => {
  let service: SolicitacaoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SolicitacaoService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(SolicitacaoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listarPendentes() deve chamar GET /api/solicitacoes', () => {
    service.listarPendentes().subscribe();
    http.expectOne('http://localhost:8080/api/solicitacoes').flush([]);
  });

  it('minhasSolicitacoes() deve chamar GET /api/solicitacoes/minhas', () => {
    service.minhasSolicitacoes().subscribe();
    http.expectOne('http://localhost:8080/api/solicitacoes/minhas').flush([]);
  });

  it('criarMinha() deve chamar POST /api/solicitacoes/minhas com payload correto', () => {
    const dados = { dataInicio: '2026-05-01', dataFim: '2026-05-05', observacao: 'Teste' };
    service.criarMinha(dados).subscribe();
    const req = http.expectOne('http://localhost:8080/api/solicitacoes/minhas');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dados);
    req.flush({ id: 1, ...dados, status: 'PENDENTE' });
  });

  it('cancelar() deve chamar PATCH /api/solicitacoes/1/cancelar', () => {
    service.cancelar(1).subscribe();
    const req = http.expectOne('http://localhost:8080/api/solicitacoes/1/cancelar');
    expect(req.request.method).toBe('PATCH');
    req.flush({ id: 1, status: 'CANCELADA' });
  });
});
