import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { YourProject } from '../../../../services/project/your-project';
import { ProjectData } from '../../../../services/project-data/project-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-third-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './third-step.html',
  styleUrl: './third-step.css',
})
export class ThirdStep implements OnInit {
  @Input() isReadOnly = false;
  private projectService = inject(YourProject);
  private projectDataService = inject(ProjectData);
  private router = inject(Router);

  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    date_debut_travaux: ['', [Validators.required]],
    date_fin_travaux: ['', [Validators.required]],
  });

  ngOnInit() {
    const savedData = this.projectDataService.getProjectData();
    if (savedData.stepThree?.data) {
      this.form.patchValue(savedData.stepThree.data);
    }
    if (this.isReadOnly) {
      this.form.disable();
    }
  }

  submitted = false;

  openDatePicker(input: HTMLInputElement): void {
    if (this.isReadOnly || input.disabled) {
      return;
    }
    input.focus();
    if (typeof input.showPicker === 'function') {
      try {
        input.showPicker();
      } catch {
        // showPicker peut échouer hors interaction utilisateur directe
      }
    }
  }

  prevStep() {
    this.router.navigate(['/votre-projet/second-step']);
  }

  onSubmit() {
    this.submitted = true;
    if (!this.form || this.form.invalid) {
      this.form?.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const projectData = this.projectDataService.getProjectData();

    const payload: any = {
      step: 3,
      produit_id: projectData?.produit_id,
      data: {
        date_debut_travaux: val.date_debut_travaux,
        date_fin_travaux: val.date_fin_travaux,
        budget_previsionnel: projectData?.stepTwo?.data?.budget_previsionnel || 0
      }
    };

    this.projectService.saveStepDraft(payload).subscribe({
      next: (response) => {
        if (response.success) {
          this.projectDataService.setProjectData({
            ...projectData,
            // client_id: response.data.client_id,
            terrain_id: response.data.terrain_id,
            produit_id: response.data.produit_id,
            stepThree: payload as any
          });
          console.log("Step 3 saved successfully", response);
          console.log("project data", this.projectDataService.getProjectData());
          this.router.navigate(['/votre-projet/fourth-step']);
        }
      },
      error: (err) => {
        console.error('Error saving step 3', err);
      }
    });

  }
}
