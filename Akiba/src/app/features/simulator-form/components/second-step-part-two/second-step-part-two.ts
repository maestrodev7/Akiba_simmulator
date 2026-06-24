import { Component, Input, OnInit, effect, inject } from '@angular/core';
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
import { CurrencyService } from '../../../../core/currency/currency.service';
import { CurrencyCode } from '../../../../core/currency/currency.types';
import {
  fromSquareMeters,
  SuperficieUnite,
  toSquareMeters,
} from '../../../../core/area/area.util';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message';
import { YourProject } from '../../../../services/project/your-project';
import { ProjectData } from '../../../../services/project-data/project-data';
import { Router } from '@angular/router';
import {
  normalizeMultiChoice,
  normalizeSingleChoice,
  STEP_TWO_SINGLE_CHOICE_FIELDS,
} from '../second-step/step-two-single-choice';

function singleChoiceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (Array.isArray(value) && value.length > 1) {
      return { singleChoice: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-second-step-part-two',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomSelect, ErrorMessage],
  templateUrl: './second-step-part-two.html',
  styleUrl: './second-step-part-two.css',
})
export class SecondStepPartTwo implements OnInit {
  @Input() isReadOnly = false;
  private projectService = inject(YourProject);
  private projectDataService = inject(ProjectData);
  private router = inject(Router);
  readonly currencyService = inject(CurrencyService);

  private fb = inject(FormBuilder);
  private budgetXafStored: number | null = null;
  private superficieM2Stored: number | null = null;
  private lastSuperficieUnite: SuperficieUnite = 'm2';
  private lastCurrency: CurrencyCode = 'XAF';
  readonly superficieUnites: { value: SuperficieUnite; label: string }[] = [
    { value: 'm2', label: 'm²' },
    { value: 'ha', label: 'Hectare' },
  ];

  constructor() {
    effect(() => {
      const next = this.currencyService.selectedCurrency();
      if (this.lastCurrency === next) {
        return;
      }
      const display = this.form.get('budget_previsionnel')?.value;
      if (display != null && display !== '') {
        const xaf = this.currencyService.toXaf(Number(display), this.lastCurrency);
        this.budgetXafStored = xaf;
        this.form.patchValue({
          budget_previsionnel: this.currencyService.fromXaf(xaf, next),
        });
      }
      this.lastCurrency = next;
    });
  }

  form: FormGroup = this.fb.group({
    type_produit: [null, [singleChoiceValidator()]],
    nature_travaux: [null, [Validators.required, singleChoiceValidator()]],
    type_construction: [null, [singleChoiceValidator()]],
    type_architecture: [[]],
    materiaux: [null, [singleChoiceValidator()]],
    style_construction: [null, [singleChoiceValidator()]],
    espace_annexe: [[]],
    nombre_etages: [0],
    nombre_sous_sol: [0],
    type_toiture: [null, [singleChoiceValidator()]],
    habillage_facade: [null, [singleChoiceValidator()]],
    menuiserie: [null, [singleChoiceValidator()]],
    securisation_ouvertures: [null, [singleChoiceValidator()]],
  });

  ngOnInit() {
    const savedData = this.projectDataService.getProjectData();
    if (savedData.stepTwo?.data) {
      const raw = savedData.stepTwo.data;
      const architecture = this.normalizeArchitecture(raw.type_architecture);
      const singleChoicePatch = this.patchSingleChoiceFieldsFromRaw(raw);
      this.form.patchValue({
        ...raw,
        ...singleChoicePatch,
        type_architecture: architecture,
        espace_annexe: normalizeMultiChoice(raw.espace_annexe),
      });
    }
    if (this.isReadOnly) {
      this.form.disable();
    }
  }

  options = {
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
    return this.getSelectedArchitecture() === value;
  }

  selectArchitecture(value: string): void {
    if (this.isReadOnly) {
      return;
    }
    this.form.get('type_architecture')?.setValue([value]);
  }

  private getSelectedArchitecture(): string | null {
    const selected = this.form.get('type_architecture')?.value;
    if (Array.isArray(selected)) {
      return selected.length > 0 ? String(selected[0]) : null;
    }
    return selected ? String(selected) : null;
  }

  private normalizeArchitecture(value: unknown): string[] {
    if (Array.isArray(value)) {
      const first = value.find((item) => item != null && String(item).trim() !== '');
      return first != null ? [String(first)] : [];
    }
    if (value != null && String(value).trim() !== '') {
      return [String(value)];
    }
    return [];
  }

  private patchSingleChoiceFieldsFromRaw(
    raw: Record<string, unknown>
  ): Partial<Record<(typeof STEP_TWO_SINGLE_CHOICE_FIELDS)[number], string | null>> {
    const patch: Partial<
      Record<(typeof STEP_TWO_SINGLE_CHOICE_FIELDS)[number], string | null>
    > = {};
    for (const field of STEP_TWO_SINGLE_CHOICE_FIELDS) {
      patch[field] = normalizeSingleChoice(raw[field]);
    }
    return patch;
  }

  private applySingleChoiceFieldsToPayload(
    payload: Record<string, unknown>
  ): void {
    for (const field of STEP_TWO_SINGLE_CHOICE_FIELDS) {
      payload[field] = normalizeSingleChoice(payload[field]);
    }
  }

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
    val.type_architecture = this.normalizeArchitecture(val.type_architecture);
    this.applySingleChoiceFieldsToPayload(val);
    val.espace_annexe = normalizeMultiChoice(val.espace_annexe);

    const projectData = this.projectDataService.getProjectData();
    const existingData = projectData.stepTwo?.data || {};

    const payload: any = {
      step: 2,
      client_id: projectData?.client_id,
      terrain_id: projectData?.terrain_id,
      produit_id: projectData?.produit_id,
      data: { ...existingData, ...val },
    };

    this.projectService.saveStepTwoDraft(payload).subscribe({
      next: (response) => {
        if (response.success) {
          this.projectDataService.setProjectData({
            ...projectData,
            terrain_id: response.data.terrain_id,
            produit_id: response.data.produit_id,
            stepTwo: payload as any,
            stepFive: {
              step: 5,
              data: {
                approved: false,
                decision: null,
                approved_at: null,
              },
            },
            stepSix: {
              step: 6,
              data: {
                selected_standing: null,
                approved: false,
                approved_at: null,
              },
            },
          });
          console.log("Step 3 (Project) saved successfully", response);
          console.log("project data", this.projectDataService.getProjectData());
          this.router.navigate(['/'], { fragment: 'step-4' });
        }
      },
      error: (err) => {
        console.error('Error saving step 2', err);
      }
    });
  }
}
