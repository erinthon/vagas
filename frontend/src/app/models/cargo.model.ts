import { Condominio } from './condominio.model';

export interface Cargo {
  id?: number;
  nome: string;
  condominio?: Condominio;
}
