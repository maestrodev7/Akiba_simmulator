export interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  numero_registre: string | null;
  simulation_payment_status: string;
  simulation_paid_at: string | null;
}




adresse: "rue,45"




created_at: "2026-05-05T09:52:00+00:00"




email: "cod2camp@gmail.com"




id: "ruwr1hzpruft"




nom: "ERIC"




numero_registre: null




prenom: "Franck"




simulation_paid_at: null









telephone: "696618559"

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
