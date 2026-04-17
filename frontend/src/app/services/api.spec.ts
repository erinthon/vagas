import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { VagaService } from './api';

describe('VagaService', () => {
  let service: VagaService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VagaService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(VagaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listar() deve chamar GET /api/vagas', () => {
    service.listar().subscribe();
    http.expectOne('http://localhost:8080/api/vagas').flush([]);
  });

  it('minhasVagas() deve chamar GET /api/vagas/minhas', () => {
    service.minhasVagas().subscribe();
    http.expectOne('http://localhost:8080/api/vagas/minhas').flush([]);
  });

  it('criarMinha() deve chamar POST /api/vagas/minhas', () => {
    service.criarMinha({ numero: 5, tipo: 'COBERTA' }).subscribe();
    const req = http.expectOne('http://localhost:8080/api/vagas/minhas');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ numero: 5, tipo: 'COBERTA' });
    req.flush({ id: 1, numero: 5, tipo: 'COBERTA' });
  });

  it('excluir() deve chamar DELETE /api/vagas/1', () => {
    service.excluir(1).subscribe();
    const req = http.expectOne('http://localhost:8080/api/vagas/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
