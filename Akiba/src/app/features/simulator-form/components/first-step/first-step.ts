import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ErrorMessage } from '../../../../shared/components/error-message/error-message';
import { YourProject } from '../../../../services/project/your-project';
import { ProjectData } from '../../../../services/project-data/project-data';
import { CurrencyService } from '../../../../core/currency/currency.service';
import { CurrencyCode } from '../../../../core/currency/currency.types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorMessage],
  templateUrl: './first-step.html',
  styleUrl: './first-step.css',
})

export class FirstStep implements OnInit {
  @Input() isReadOnly = false;
  private projectService = inject(YourProject);
  private projectDataService = inject(ProjectData);
  private router = inject(Router);
  readonly currencyService = inject(CurrencyService);

  private fb = inject(FormBuilder);
  private budgetXafStored: number | null = null;
  private lastCurrency: CurrencyCode = 'XAF';

  form: FormGroup = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, Validators.pattern('^[+0-9\\s]+$')]],
    adresse: ['', Validators.required],
    // numero_registre: ['', Validators.required],
    nombre_enfants: [null],
    budget_previsionnel: [null],
  });

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

  ngOnInit() {
    const savedData = this.projectDataService.getProjectData();
    if (savedData.stepOne?.data) {
      const raw = savedData.stepOne.data;
      this.budgetXafStored =
        raw.budget_previsionnel != null ? Number(raw.budget_previsionnel) : null;
      const displayBudget =
        this.budgetXafStored != null
          ? this.currencyService.fromXaf(this.budgetXafStored)
          : null;
      this.form.patchValue({
        ...raw,
        budget_previsionnel: displayBudget,
      });
    }
    this.lastCurrency = this.currencyService.selectedCurrency();
    if (this.isReadOnly) {
      this.form.disable();
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) return 'Ce champ est requis.';
      if (control.errors?.['email']) return 'Veuillez entrer une adresse e-mail valide.';
      if (control.errors?.['pattern']) return 'Veuillez entrer un format valide.';
    }
    return '';
  }

  onSubmit() {
    console.log("form value send from child component", this.form.value);
    if (!this.form || this.form.invalid) {
      this.form?.markAllAsTouched();
      return; // Stop if form is invalid!
    }

    const val = this.form.value;
    const budgetXaf =
      val.budget_previsionnel != null && val.budget_previsionnel !== ''
        ? this.currencyService.toXaf(Number(val.budget_previsionnel))
        : null;
    this.budgetXafStored = budgetXaf;

    const payload: any = {
      step: 1,
      data: {
        nom: val.nom || "",
        prenom: val.prenom || "",
        email: val.email || "",
        telephone: val.telephone || "",
        adresse: val.adresse || "",
        // numero_registre: val.numero_registre || ""
        nombre_enfants: val.nombre_enfants != null && val.nombre_enfants !== '' ? Number(val.nombre_enfants) : null,
        budget_previsionnel: budgetXaf,
      }
    };

    this.projectService.saveStepDraft(payload).subscribe({
      next: (response) => {
        if (response.success && response.data?.client_id) {
          console.log("response test alpha", response, "client id", response.data.client_id);
          this.projectDataService.setProjectData({
            client_id: response.data.client_id,
            stepOne: payload as any,
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
          console.log("project data", this.projectDataService.getProjectData());
          this.router.navigate(['/'], { fragment: 'step-2' });
        }
      },
      error: (err) => {
        console.error('Error saving step 1', err);
      }
    });
  }
}
