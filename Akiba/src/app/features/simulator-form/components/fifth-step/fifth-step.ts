import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectData } from '../../../../services/project-data/project-data';
import { FirstStep } from '../first-step/first-step';
import { SecondStep } from '../second-step/second-step';
import { ThirdStep } from '../third-step/third-step';
import { YourProject } from '../../../../services/project/your-project';
import { ProjectRecapData, stepTwoForm } from '../../../../interfaces/project-interface';
import { formatSuperficie } from '../../../../core/area/area.util';
import { CurrencyService } from '../../../../core/currency/currency.service';
import { finalize, timeout, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

type StandingOption = 'standard' | 'moyen' | 'haut';

@Component({
  selector: 'app-fifth-step',
  standalone: true,
  imports: [CommonModule, FormsModule, FirstStep, SecondStep, ThirdStep],
  templateUrl: './fifth-step.html',
  styleUrl: './fifth-step.css',
})
export class FifthStep implements OnInit {
  private router = inject(Router);
  private projectDataService = inject(ProjectData);
  private projectService = inject(YourProject);
  readonly currencyService = inject(CurrencyService);

  readonly standingOptions: { value: StandingOption; label: string }[] = [
    { value: 'standard', label: 'Finition standard' },
    { value: 'moyen', label: 'Finition moyen standing' },
    { value: 'haut', label: 'Finition haut standing' },
  ];

  projectData: any;
  recap = signal<ProjectRecapData | null>(null);
  isLoading = signal<boolean>(false);
  errorMsg = signal<string | null>(null);
  selectedStanding = signal<StandingOption>('standard');
  isUpdatingStanding = signal<boolean>(false);

  estimatedCostXaf = computed(() => {
    const estimateEur = this.recap()?.cout_total_estime;
    return estimateEur != null ? this.currencyService.toXaf(Number(estimateEur), 'EUR') : 0;
  });
  estimatedCostLabel = computed(() => this.currencyService.format(this.estimatedCostXaf(), 'XAF'));
  budgetLabel = computed(() =>
    this.currencyService.format(Number(this.recap()?.budget_previsionnel ?? 0), 'XAF')
  );
  isBudgetSufficient = computed(
    () => this.estimatedCostXaf() <= Number(this.recap()?.budget_previsionnel ?? 0)
  );
  budgetDeltaLabel = computed(() => {
    const delta = Math.abs(Number(this.recap()?.budget_previsionnel ?? 0) - this.estimatedCostXaf());
    return this.currencyService.format(delta, 'XAF');
  });

  ngOnInit() {
    this.projectData = this.projectDataService.getProjectData();
    this.selectedStanding.set(this.readStoredStanding());
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
            if (response.data.standing) {
              this.selectedStanding.set(response.data.standing);
            }
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

  onStandingChange(nextStanding: StandingOption) {
    if (this.selectedStanding() === nextStanding) {
      return;
    }
    this.selectedStanding.set(nextStanding);
    this.persistStandingAndRefresh();
  }

  private persistStandingAndRefresh() {
    const projectData = this.projectDataService.getProjectData();
    const stepTwo = projectData.stepTwo;
    if (!stepTwo) {
      this.errorMsg.set("Impossible de mettre à jour l'estimation.");
      return;
    }

    const payload: stepTwoForm = {
      ...stepTwo,
      data: {
        ...stepTwo.data,
        standing: this.selectedStanding(),
      },
    };

    this.isUpdatingStanding.set(true);
    this.projectService
      .saveStepTwoDraft(payload)
      .pipe(
        timeout(10000),
        catchError((error) => {
          console.error('Error updating standing', error);
          this.errorMsg.set("Impossible de recalculer l'estimation.");
          return of(null);
        }),
        switchMap((response) => {
          if (response?.success) {
            this.projectDataService.setProjectData({
              ...projectData,
              terrain_id: response.data.terrain_id,
              produit_id: response.data.produit_id,
              stepTwo: payload,
            });
            this.projectData = this.projectDataService.getProjectData();
          }
          return of(response);
        }),
        finalize(() => this.isUpdatingStanding.set(false))
      )
      .subscribe({
        next: (response) => {
          if (response?.success) {
            this.loadRecap();
            return;
          }
          if (!this.errorMsg()) {
            this.errorMsg.set("Impossible de recalculer l'estimation.");
          }
        },
      });
  }

  private readStoredStanding(): StandingOption {
    const standing = this.projectDataService.getProjectData().stepTwo?.data?.standing;
    if (standing === 'moyen' || standing === 'haut') {
      return standing;
    }
    return 'standard';
  }

  budgetMessage(): string {
    const budget = Number(this.recap()?.budget_previsionnel ?? 0);
    if (!budget) {
      return '';
    }
    if (this.isBudgetSufficient()) {
      return `${this.estimatedCostLabel()} inférieur à votre budget de ${this.budgetLabel()}`;
    }
    return `${this.estimatedCostLabel()} supérieur à votre budget de ${this.budgetLabel()}`;
  }

  nextStep() {
    const projectData = this.projectDataService.getProjectData();
    this.projectDataService.setProjectData({
      ...projectData,
      stepSix: {
        step: 6,
        data: {
          selected_standing: this.selectedStanding(),
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
