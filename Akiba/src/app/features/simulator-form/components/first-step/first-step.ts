import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ErrorMessage } from '../../../../shared/components/error-message/error-message';
import { YourProject } from '../../../../services/project/your-project';
import { ProjectData } from '../../../../services/project-data/project-data';
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

  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, Validators.pattern('^[+0-9\\s]+$')]],
    adresse: ['', Validators.required],
    // numero_registre: ['', Validators.required],
  });

  ngOnInit() {
    const savedData = this.projectDataService.getProjectData();
    if (savedData.stepOne?.data) {
      this.form.patchValue(savedData.stepOne.data);
    }
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
    const payload: any = {
      step: 1,
      data: {
        nom: val.nom || "",
        prenom: val.prenom || "",
        email: val.email || "",
        telephone: val.telephone || "",
        adresse: val.adresse || "",
        // numero_registre: val.numero_registre || ""
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
          this.router.navigate(['/votre-projet/second-step']);
        }
      },
      error: (err) => {
        console.error('Error saving step 1', err);
      }
    });
  }
}
