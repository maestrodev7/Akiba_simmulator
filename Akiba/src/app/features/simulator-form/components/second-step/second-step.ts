import { Component, Input, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomSelect } from '../../../../shared/components/custom-select/custom-select';
import {
  fromSquareMeters,
  SuperficieUnite,
  toSquareMeters,
} from '../../../../core/area/area.util';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message';
import { YourProject } from '../../../../services/project/your-project';
import { ProjectData } from '../../../../services/project-data/project-data';
import { Router } from '@angular/router';


@Component({
  selector: 'app-second-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomSelect, ErrorMessage],
  templateUrl: './second-step.html',
  styleUrl: './second-step.css',
})
export class SecondStep implements OnInit {
  @Input() isReadOnly = false;
  private projectService = inject(YourProject);
  private projectDataService = inject(ProjectData);
  private router = inject(Router);

  private fb = inject(FormBuilder);
  private superficieM2Stored: number | null = null;
  private lastSuperficieUnite: SuperficieUnite = 'm2';
  readonly superficieUnites: { value: SuperficieUnite; label: string }[] = [
    { value: 'm2', label: 'm²' },
    { value: 'ha', label: 'Hectare' },
  ];

  form: FormGroup = this.fb.group({
    adresse: ['', [Validators.required]],
    superficie: [null, [Validators.required]],
    superficie_unite: ['m2' as SuperficieUnite, [Validators.required]],
    statut_juridique: [null, [Validators.required]],
    etat_du_site: [null, [Validators.required]],
    topographie: [null, [Validators.required]],
    situation: [null, [Validators.required]],
    voie_existante: [null, [Validators.required]],
    documents_fournis: [[]],
  });

  ngOnInit() {
    const savedData = this.projectDataService.getProjectData();
    if (savedData.stepTwo?.data) {
      const raw = savedData.stepTwo.data;
      const unite: SuperficieUnite =
        raw.superficie_unite === 'ha' ? 'ha' : 'm2';
      this.superficieM2Stored =
        raw.superficie != null ? Number(raw.superficie) : null;
      const displaySuperficie =
        this.superficieM2Stored != null
          ? fromSquareMeters(this.superficieM2Stored, unite)
          : null;
      this.form.patchValue({
        ...raw,
        superficie: displaySuperficie,
        superficie_unite: unite,
      });
    }
    this.lastSuperficieUnite =
      (this.form.get('superficie_unite')?.value as SuperficieUnite) ?? 'm2';
    if (this.isReadOnly) {
      this.form.disable();
    }
  }

  onSuperficieUniteChange(): void {
    const next = this.form.get('superficie_unite')?.value as SuperficieUnite;
    if (this.lastSuperficieUnite === next) {
      return;
    }
    const display = this.form.get('superficie')?.value;
    if (display != null && display !== '') {
      const m2 = toSquareMeters(Number(display), this.lastSuperficieUnite);
      this.superficieM2Stored = m2;
      this.form.patchValue({
        superficie: fromSquareMeters(m2, next),
      });
    }
    this.lastSuperficieUnite = next;
  }

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

  prevStep() {
    this.router.navigate(['/votre-projet']);
  }

  onSubmit() {
    this.submitted = true;
    if (!this.form || this.form.invalid) {
      this.form?.markAllAsTouched();
      return;
    }

    const val = { ...this.form.value };

    const unite = (val.superficie_unite as SuperficieUnite) ?? 'm2';
    const superficieM2 = toSquareMeters(Number(val.superficie), unite);
    val.superficie = superficieM2;
    val.superficie_unite = unite;
    this.superficieM2Stored = superficieM2;

    const projectData = this.projectDataService.getProjectData();
    const existingData = projectData.stepTwo?.data || {};

    const payload: any = {
      step: 2,
      client_id: projectData?.client_id,
      terrain_id: projectData?.terrain_id,
      produit_id: projectData?.produit_id,
      data: { ...existingData, ...val },
    };

    this.projectDataService.setProjectData({
      ...projectData,
      stepTwo: payload as any,
    });
    
    console.log("Step 2 (Part 1) saved locally", val);
    this.router.navigate(['/'], { fragment: 'step-3' });
  }
}
