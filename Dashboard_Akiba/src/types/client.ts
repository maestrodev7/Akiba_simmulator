export interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  numero_registre: string | null;
}

export interface ClientMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface ClientResponse {
  success: boolean;
  data: Client[];
  meta: ClientMeta;
}
