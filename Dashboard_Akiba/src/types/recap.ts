export interface RecapData {
  ids: {
    client_id: string;
    terrain_id: string;
    produit_id: string;
  };
  client: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    numero_registre: string | null;
    created_at: string;
    updated_at: string;
  };
  terrain: {
    id: string;
    client_id: string;
    adresse: string;
    superficie: number;
    titre_foncier: string;
    site: string;
    situation: string;
    topographie: string;
    created_at: string;
    updated_at: string;
  };
  produit: {
    id: string;
    terrain_id: string;
    type_produit: string;
    materiaux: string;
    standing: string | null;
    budget_previsionnel: number;
    date_debut_travaux: string;
    date_fin_travaux: string;
    caracteristiques: Record<string, any>;
    created_at: string;
    updated_at: string;
  };
  programme: Array<{
    id: string;
    piece_id: string;
    nombre: number;
    surface_personnalisee: number | null;
  }>;
  step_completion: {
    step_1: boolean;
    step_2: boolean;
    step_3: boolean;
    step_4: boolean;
  };
}

export interface RecapResponse {
  success: boolean;
  data: RecapData;
}
