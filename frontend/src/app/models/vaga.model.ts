import { Morador } from './morador.model';

export type TipoVaga = 'COBERTA' | 'DESCOBERTA';

export interface Vaga {
  id?: number;
  numero: number;
  tipo: TipoVaga;
  proprietario?: Morador;
}
