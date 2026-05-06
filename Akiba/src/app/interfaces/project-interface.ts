export interface projectData {
  client_id?: string;
  terrain_id?: string;
  produit_id?: string;
  stepOne?: stepOneForm;
  stepTwo?: stepTwoForm;
  stepThree?: stepThreeForm;
  stepFour?: stepFourForm;
  stepFive?: stepFiveForm;
  stepSix?: stepSixForm;
  stepSeven?: stepSevenForm;
  stepEight?: stepEightForm;
  stepNine?: stepNineForm;
  stepTen?: stepTenForm;
}

export interface stepOneForm {
  step: 1,
  data: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    numero_registre: string;
  }
}

export interface stepTwoForm {
  step: 2,
  client_id: string,
  terrain_id?: string,
  produit_id?: string,
  data: {
    budget_previsionnel: number;
    adresse: string;
    superficie: number;

    statut_juridique: string[];
    etat_du_site: string[];
    topographie: string[];
    situation: string[];
    voie_existante: string[];
    documents_fournis: string[];

    type_produit: string;
    nature_travaux: string[];
    type_construction: string[];
    type_architecture: string[];

    materiaux: string[];
    style_construction: string[];
    espace_annexe: string[];

    nombre_etages: number;
    nombre_sous_sol: number;

    type_toiture: string[];
    habillage_facade: string[];
    menuiserie: string[];
    securisation_ouvertures: string[];
  }
}

export interface stepThreeForm {
  step: 3;
  produit_id: string;
  data: {
    date_debut_travaux: string;
    date_fin_travaux: string;
    budget_previsionnel: number;
  }
}

export interface stepFourForm {
  step: 4;
  produit_id: string;
  data: {
    lignes: {
      piece_id: string;
      nombre: number;
    }[];
  }
}

export interface stepFiveForm {

}

export interface stepSixForm {

}

export interface stepSevenForm {

}

export interface stepEightForm {

}

export interface stepNineForm {

}

export interface stepTenForm {

}

export interface TransactionContent {
  id: number;
  nom: string;
  date: string;
  amount: number;
  statut: string;
  wallet: number;
  userType: string;
  operation: string;
  reference: string;
  utilisateur: number;
  paymentMethod: string;
  numeroDeCompte: string;
}

export interface ProviderResponseDetail {
  data: any | null;
  message: string;
  success: boolean;
  reference: string;
  transaction: TransactionContent;
}

export interface ProviderResponseWrapper {
  content: TransactionContent;
  status: number;
  message: string | null;
}

export interface TransactionResponse {
  data: {
    transaction: {
      id: number;
      reference: string;
      session_id: string | null;
      amount: string;
      channel: string;
      status: string;
      provider_response: ProviderResponseDetail;
      last_status_payload: ProviderResponseWrapper;
      last_checked_at: string;
      created_at: string;
      updated_at: string;
    };
    provider_response: ProviderResponseWrapper;
    status_changed: boolean;
  }
}

export interface DepositData {
  success: boolean;
  data: any;
  message: string;
  reference?: string;
  transaction?: TransactionContent;
  payment_url?: string;
}

export interface DepositResponse {
  success: boolean;
  data: DepositData;
  message: string;
}
