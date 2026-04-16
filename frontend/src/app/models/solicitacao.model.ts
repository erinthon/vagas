import { Morador } from './morador.model';
import { Oferta } from './oferta.model';

export type StatusSolicitacao = 'PENDENTE' | 'ATENDIDA' | 'CANCELADA';

export interface Solicitacao {
  id?: number;
  morador: Morador;
  dataInicio: string;
  dataFim: string;
  observacao?: string;
  status?: StatusSolicitacao;
  ofertaAtendida?: Oferta;
}
