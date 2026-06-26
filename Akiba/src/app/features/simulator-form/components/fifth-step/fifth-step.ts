import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectData } from '../../../../services/project-data/project-data';
import { FirstStep } from '../first-step/first-step';
import { SecondStep } from '../second-step/second-step';
import { ThirdStep } from '../third-step/third-step';
import { YourProject } from '../../../../services/project/your-project';
import { ProjectRecapData } from '../../../../interfaces/project-interface';
import { formatSuperficie } from '../../../../core/area/area.util';
import { finalize, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-fifth-step',
  standalone: true,
  imports: [CommonModule, FirstStep, SecondStep, ThirdStep],
  templateUrl: './fifth-step.html',
  styleUrl: './fifth-step.css',
})
export class FifthStep implements OnInit {
  private router = inject(Router);
  private projectDataService = inject(ProjectData);
  private projectService = inject(YourProject);

  projectData: any;
  recap = signal<ProjectRecapData | null>(null);
  isLoading = signal<boolean>(false);
  errorMsg = signal<string | null>(null);

  ngOnInit() {
    this.projectData = this.projectDataService.getProjectData();
    this.loadRecap();
  }

  loadRecap() {
    const produitId = this.projectDataService.getProjectData()?.produit_id;
    if (!produitId) {
      this.recap.set(null);
      this.errorMsg.set(
        "Impossible de calculer l'estimation tant que les informations du projet ne sont pas complètes."
      );
      return;
    }

    this.recap.set(null);
    this.errorMsg.set(null);
    this.isLoading.set(true);
    this.projectService
      .getProjectRecap(produitId)
      .pipe(
        timeout(10000),
        catchError((error) => {
          console.error('Error fetching recap in step 5:', error);
          this.recap.set(null);
          this.errorMsg.set(
            "Une erreur est survenue lors du calcul de la surface et de l'estimation."
          );
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          if (response?.success && response.data) {
            this.recap.set(response.data);
            return;
          }
          if (!this.errorMsg()) {
            this.errorMsg.set("Le récapitulatif détaillé n'a pas pu être chargé.");
          }
        },
      });
  }

  get stepOne() { return this.projectData?.stepOne?.data; }
  get stepTwo() { return this.projectData?.stepTwo?.data; }
  get stepThree() { return this.projectData?.stepThree?.data; }
  get stepFour() { return this.projectData?.stepFour?.data; }
  get lignes() { return this.recap()?.lignes ?? []; }

  formatArea(valueM2?: number | null): string {
    if (valueM2 == null) {
      return '--';
    }
    return formatSuperficie(Number(valueM2), 'm2');
  }

  get projectAreaLabel(): string {
    return this.formatArea(this.recap()?.superficie_totale_m2);
  }

  nextStep() {
    const projectData = this.projectDataService.getProjectData();
    this.projectDataService.setProjectData({
      ...projectData,
      stepSix: {
        step: 6,
        data: {
          selected_standing: projectData.stepTwo?.data?.standing ?? 'standard',
          approved: true,
          approved_at: new Date().toISOString(),
        },
      },
    });
    this.router.navigate(['/votre-projet/payment-step']);
  }

  canContinue(): boolean {
    return !!this.recap() && !this.isLoading();
  }

  prevStep() {
    this.router.navigate(['/votre-projet/third-step']);
  }
}
