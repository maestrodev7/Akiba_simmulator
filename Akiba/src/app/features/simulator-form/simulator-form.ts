import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FirstStep } from "./components/first-step/first-step";
import { SecondStep } from "./components/second-step/second-step";
import { ThirdStep } from "./components/third-step/third-step";
import { FourthStep } from "./components/fourth-step/fourth-step";
import { FifthStep } from "./components/fifth-step/fifth-step";
import { SixthStep } from "./components/sixth-step/sixth-step";
import { YourProject } from '../../services/project/your-project';
import { ProjectData } from '../../services/project-data/project-data';

@Component({
  selector: 'app-simulator-form',
  imports: [CommonModule, FirstStep, SecondStep, ThirdStep, FourthStep, FifthStep, SixthStep],
  templateUrl: './simulator-form.html',
  styleUrl: './simulator-form.css',
})
export class SimulatorForm {
  step = signal<number>(1);
  private projectService = inject(YourProject);
  private projectDataService = inject(ProjectData);

  steps = [
    { id: 1, label: 'fiche de renseignements' },
    { id: 2, label: 'fiche des contraintes et besoins - elements de programmation' },
    { id: 3, label: 'Calendrier prévisionnel des travaux' },
    { id: 4, label: 'Détermination du programme' },
    { id: 5, label: 'Gestion des types de pièces (catalogue)' },
    { id: 6, label: 'Gestion des types de pièces (catalogue)' },
  ];


  nextStep(data?: any) {
    if (this.step() === 1) {
      this.handleStepOne(data as FormGroup);
    } else if (this.step() === 2) {
      this.handleStepTwo(data as FormGroup);
    } else if (this.step() < 7) {
      this.step.update((step) => step + 1);
    }
  }

  prevStep() {
    if (this.step() > 1) {
      this.step.update((step) => step - 1);
    }
  }

  goToStep(step: number) {
    this.step.set(step);
  }


  handleStepOne(formGroup: FormGroup){
    if (!formGroup || formGroup.invalid) {
      formGroup?.markAllAsTouched();
      return; // Stop if form is invalid!
    }

    const val = formGroup.value;
    const payload: any = {
      step: 1,
      data: {
        nom: val.nom || "",
        prenom: val.prenom || "",
        email: val.email || "",
        telephone: val.telephone || "",
        adresse: val.adresse || "",
        numero_registre: val.numero_registre || ""
      }
    };

    this.projectService.saveStepDraft(payload).subscribe({
      next: (response) => {
        if (response.success && response.data?.client_id) {
          this.projectDataService.setProjectData({
              client_id: response.data.client_id,
              stepOne: payload as any
          });
          console.log("project data",this.projectDataService.getProjectData());
          this.step.update((step) => step + 1);
        }
      },
      error: (err) => {
        console.error('Error saving step 1', err);
      }
    });
  }

  handleStepTwo(formGroup: FormGroup) {
    if (!formGroup || formGroup.invalid) {
      formGroup?.markAllAsTouched();
      return;
    }

    const val = formGroup.value;
    const projectData = this.projectDataService.getProjectData();
    
    const payload: any = {
      step: 2,
      client_id: projectData?.client_id,
      terrain_id: projectData?.terrain_id,
      produit_id: projectData?.produit_id,
      data: {
        ...val
      }
    };

    this.projectService.saveStepTwoDraft(payload).subscribe({
      next: (response) => {
        if (response.success) {
          this.projectDataService.setProjectData({
            ...projectData,
            terrain_id: response.data.terrain_id,
            produit_id: response.data.produit_id,
            stepTwo: payload as any
          });
          console.log("Step 2 saved successfully", response);
          this.step.update((step) => step + 1);
        }
      },
      error: (err) => {
        console.error('Error saving step 2', err);
      }
    });
  }


  submitForm() {
    console.log('Form submitted');
  }
}
