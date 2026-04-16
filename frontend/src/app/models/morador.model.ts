import { Condominio } from './condominio.model';
import { Cargo } from './cargo.model';

export interface Morador {
  id?: number;
  nome: string;
  apartamento: string;
  bloco: string;
  email: string;
  telefone?: string;
  googleId?: string;
  fotoPerfil?: string;
  condominio?: Condominio;
  cargo?: Cargo;
}
