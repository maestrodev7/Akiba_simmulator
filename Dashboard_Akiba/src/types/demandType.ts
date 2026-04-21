export interface ProjectData {
    client_id?: string;
    terrain_id?: string;
    produit_id?: string;
    stepOne?: StepOneForm;
    stepTwo?: StepTwoForm;
    stepThree?: StepThreeForm;
    stepFour?: StepFourForm;
}

export interface StepOneForm {
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

export interface StepTwoForm {
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

export interface StepThreeForm {
    step: 3;
    produit_id: string;
    data: {
        date_debut_travaux: string;
        date_fin_travaux: string;
        budget_previsionnel: number;
    }
}

export interface StepFourForm {
    step: 4;
    produit_id: string;
    data: {
        lignes: {
            piece_id: string;
            nombre: number;
        }[];
    }
}
