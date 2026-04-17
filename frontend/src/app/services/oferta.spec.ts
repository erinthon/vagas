import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { OfertaService } from './oferta';

describe('OfertaService', () => {
  let service: OfertaService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OfertaService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(OfertaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listar() deve chamar GET /api/ofertas (sem filtro)', () => {
    service.listar().subscribe();
    http.expectOne('http://localhost:8080/api/ofertas').flush([]);
  });

  it('minhasOfertas() deve chamar GET /api/ofertas/minhas', () => {
    service.minhasOfertas().subscribe();
    http.expectOne('http://localhost:8080/api/ofertas/minhas').flush([]);
  });

  it('criarMinha() deve chamar POST /api/ofertas/minhas com payload correto', () => {
    const dados = { vaga: { id: 10 }, dataInicio: '2026-05-01', dataFim: '2026-05-10' };
    service.criarMinha(dados).subscribe();
    const req = http.expectOne('http://localhost:8080/api/ofertas/minhas');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dados);
    req.flush({ id: 1, ...dados, status: 'ATIVA' });
  });

  it('encerrar() deve chamar PATCH /api/ofertas/1/encerrar', () => {
    service.encerrar(1).subscribe();
    const req = http.expectOne('http://localhost:8080/api/ofertas/1/encerrar');
    expect(req.request.method).toBe('PATCH');
    req.flush({ id: 1, status: 'ENCERRADA' });
  });
});
