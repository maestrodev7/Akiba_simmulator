import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomSelect } from '../../../../shared/components/custom-select/custom-select';

import { ErrorMessage } from '../../../../shared/components/error-message/error-message';

@Component({
  selector: 'app-second-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomSelect, ErrorMessage],
  templateUrl: './second-step.html',
  styleUrl: './second-step.css',
})
export class SecondStep {
  @Output() next = new EventEmitter<FormGroup>();
  @Output() prev = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    budget_previsionnel: [null, [Validators.required]],
    adresse: ['', [Validators.required]],
    superficie: [null, [Validators.required]],
    statut_juridique: [null, [Validators.required]],
    etat_du_site: [null, [Validators.required]],
    topographie: [null, [Validators.required]],
    situation: [null, [Validators.required]],
    voie_existante: [null, [Validators.required]],
    documents_fournis: [[]],
    type_produit: [[]], 
    nature_travaux: [null, [Validators.required]],
    type_construction: [[]],
    type_architecture: [[]],
    materiaux: [[]],
    style_construction: [[]],
    espace_annexe: [[]],
    nombre_etages: [0],
    nombre_sous_sol: [0],
    type_toiture: [[]],
    habillage_facade: [[]],
    menuiserie: [[]],
    securisation_ouvertures: [[]],
  });

  options = {
    statutJuridique: [
      { label: 'Titre foncier', value: 'Titre foncier' },
      { label: 'Bail', value: 'Bail' },
      { label: 'Bail emphytéotique', value: 'Bail emphytéotique' },
      { label: 'Sans titre foncier', value: 'Sans titre foncier' }
    ],
    etatSite: [
      { label: 'Nu viabilisé', value: 'Nu viabilisé' },
      { label: 'Nu non viabilisé', value: 'Nu non viabilisé' },
      { label: 'Avec bâti à réhabiliter', value: 'Avec bâti à réhabiliter' },
      { label: 'Avec bâti à démolir', value: 'Avec bâti à démolir' }
    ],
    topographie: [
      { label: 'Plat', value: 'Plat' },
      { label: 'Pente douce', value: 'Pente douce' },
      { label: 'Forte pente / Escarpé', value: 'Forte pente / Escarpé' }
    ],
    situation: [
      { label: 'Lotissement', value: 'Lotissement' },
      { label: 'Terrain isolé', value: 'Terrain isolé' },
      { label: 'Milieu urbain', value: 'Milieu urbain' },
      { label: 'Milieu rural', value: 'Milieu rural' }
    ],
    voieExistante: [
      { label: 'Oui', value: 'oui' },
      { label: 'Non', value: 'non' }
    ],
    documentsFournis: [
      { label: 'Relevé de géomètre', value: 'Relevé de géomètre' },
      { label: 'Étude de sol', value: 'Étude de sol' },
      { label: 'Plan de situation', value: 'Plan de situation' }
    ],
    typeProduit: [
      { label: 'Construction neuve', value: 'Construction neuve' },
      { label: 'Travaux sur maison existante', value: 'Travaux sur maison existante' },
      { label: 'Autres', value: 'Autres' }
    ],
    natureTravaux: [
      { label: 'Maison individuelle', value: 'Maison individuelle' },
      { label: 'Maison jumelée', value: 'Maison jumelée' },
      { label: 'Immeuble', value: 'Immeuble' },
      { label: 'Villa', value: 'Villa' },
      { label: 'Dépendance', value: 'Dépendance' },
      { label: 'Piscine', value: 'Piscine' },
      { label: 'Autre équipement', value: 'Autre équipement' }
    ],
    typeConstruction: [
      { label: 'Classique', value: 'Classique' },
      { label: 'Contemporaine', value: 'Contemporaine' },
      { label: 'Duplex', value: 'Duplex' },
      { label: 'Moderne', value: 'Moderne' },
      { label: 'Traditionnelle', value: 'Traditionnelle' },
      { label: 'Futuriste', value: 'Futuriste' }
    ],
    materiaux: [
      { label: 'Bois', value: 'Bois' },
      { label: 'Béton', value: 'Béton' },
      { label: 'Parpaings', value: 'Parpaings' },
      { label: 'Brique de terre cuite', value: 'Brique de terre cuite' },
      { label: 'Brique de terre crue', value: 'Brique de terre crue' },
      { label: 'Pisier', value: 'Pisier' }
    ],
    styleConstruction: [
      { label: 'Villa classique', value: 'Villa classique' },
      { label: 'Villa traditionnelle', value: 'Villa traditionnelle' },
      { label: 'Villa moderne', value: 'Villa moderne' },
      { label: 'Villa contemporaine', value: 'Villa contemporaine' }
    ],
    espaceAnnexe: [
      { label: 'Véranda', value: 'Véranda' },
      { label: 'Balcon', value: 'Balcon' },
      { label: 'Garage', value: 'Garage' }
    ],
    typeToiture: [
      { label: 'Tuiles en terre cuite', value: 'Tuiles en terre cuite' },
      { label: 'Tuiles en bois', value: 'Tuiles en bois' },
      { label: 'Tôles ondulée', value: 'Tôles ondulée' },
      { label: 'Tôles bac', value: 'Tôles bac' },
      { label: 'Toiture terrasse en béton', value: 'Toiture terrasse en béton' }
    ],
    habillageFacade: [
      { label: 'Carrelage', value: 'Carrelage' },
      { label: 'Béton brute', value: 'Béton brute' },
      { label: 'Enduit de ciment et chaux', value: 'Enduit de ciment et chaux' },
      { label: 'Bardage métallique', value: 'Bardage métallique' }
    ],
    menuiserie: [
      { label: 'Bois', value: 'Bois' },
      { label: 'PVC', value: 'PVC' },
      { label: 'Métalique', value: 'Métalique' },
      { label: 'Aluminium', value: 'Aluminium' }
    ],
    securisationOuvertures: [
      { label: 'Grilles métalliques', value: 'Grilles métalliques' },
      { label: 'Claustras', value: 'Claustras' },
      { label: 'Autres', value: 'Autres' }
    ]
  };

  submitted = false;

  isArchitectureSelected(value: string): boolean {
    const selected = this.form.get('type_architecture')?.value || [];
    return selected.includes(value);
  }

  toggleArchitecture(value: string) {
    const control = this.form.get('type_architecture');
    const selected = control?.value || [];
    if (selected.includes(value)) {
      control?.setValue(selected.filter((v: string) => v !== value));
    } else {
      control?.setValue([...selected, value]);
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
       this.form.markAllAsTouched();
       return;
    }
    this.next.emit(this.form);
  }
}
