import { Morador } from './morador.model';
import { Vaga } from './vaga.model';

export type StatusOferta = 'ATIVA' | 'ENCERRADA';

export interface Oferta {
  id?: number;
  morador: Morador;
  vaga: Vaga;
  dataInicio: string;
  dataFim: string;
  observacao?: string;
  status?: StatusOferta;
}
