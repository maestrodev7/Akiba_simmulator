import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { YourProject } from '../../../../services/project/your-project';
import { ProjectData } from '../../../../services/project-data/project-data';
import { CurrencyService } from '../../../../core/currency/currency.service';
import {
  ProjectRecapData,
  stepSixForm,
  stepTwoForm,
} from '../../../../interfaces/project-interface';
import { formatSuperficie } from '../../../../core/area/area.util';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { of } from 'rxjs';

type StandingOption = 'standard' | 'moyen' | 'haut';

@Component({
  selector: 'app-sixth-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sixth-step.html',
  styleUrl: './sixth-step.css',
})
export class SixthStep implements OnInit {
  private router = inject(Router);
  private projectService = inject(YourProject);
  private projectDataService = inject(ProjectData);
  private currencyService = inject(CurrencyService);

  readonly standingOptions: { value: StandingOption; label: string; pricePerM2: number }[] = [
    { value: 'standard', label: 'Finition standing standard', pricePerM2: 305 },
    { value: 'moyen', label: 'Finition standing moyenne gamme', pricePerM2: 475 },
    { value: 'haut', label: 'Finition standing haut de gamme', pricePerM2: 610 },
  ];

  selectedStanding = signal<StandingOption>('standard');
  recap = signal<ProjectRecapData | null>(null);
  isLoading = signal<boolean>(false);
  errorMsg = signal<string | null>(null);

  selectedOption = computed(
    () =>
      this.standingOptions.find((option) => option.value === this.selectedStanding()) ??
      this.standingOptions[0]
  );
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
    this.router.navigate(['/votre-projet/payment-step']);
  }

  prevStep() {
    this.router.navigate(['/votre-projet/fifth-step']);
  }

  loadEstimate() {
    const produitId = this.projectDataService.getProjectData()?.produit_id;
    if (!produitId) {
      this.recap.set(null);
      this.errorMsg.set("Impossible de calculer l'estimation.");
      return;
    }

    this.isLoading.set(true);
    this.errorMsg.set(null);
    this.projectService
      .getProjectRecap(produitId)
      .pipe(
        timeout(10000),
        catchError((error) => {
          console.error('Error loading estimate', error);
          this.recap.set(null);
          this.errorMsg.set("Impossible de charger l'estimation.");
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
            this.errorMsg.set("Impossible de charger l'estimation.");
          }
        },
      });
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

    this.isLoading.set(true);
    this.projectService
      .saveStepTwoDraft(payload)
      .pipe(
        timeout(10000),
        catchError((error) => {
          console.error('Error updating standing', error);
          this.errorMsg.set("Impossible de recalculer l'estimation.");
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          if (response?.success) {
            this.projectDataService.setProjectData({
              ...projectData,
              terrain_id: response.data.terrain_id,
              produit_id: response.data.produit_id,
              stepTwo: payload,
              stepSix: {
                step: 6,
                data: {
                  selected_standing: this.selectedStanding(),
                  approved: false,
                  approved_at: null,
                },
              },
            });
            this.loadEstimate();
            return;
          }
          if (!this.errorMsg()) {
            this.errorMsg.set("Impossible de recalculer l'estimation.");
          }
        }
      });
  }

  nextStep() {
    const payload: stepSixForm = {
      step: 6,
      data: {
        selected_standing: this.selectedStanding(),
        approved: true,
        approved_at: new Date().toISOString(),
      },
    };
    this.projectDataService.setProjectData({
      ...this.projectDataService.getProjectData(),
      stepSix: payload,
    });
    this.router.navigate(['/votre-projet/payment-step']);
  }

  private readStoredStanding(): StandingOption {
    const standing = this.projectDataService.getProjectData().stepTwo?.data?.standing;
    if (standing === 'moyen' || standing === 'haut') {
      return standing;
    }
    return 'standard';
  }

  formatArea(valueM2?: number | null): string {
    if (valueM2 == null) {
      return '--';
    }
    return formatSuperficie(Number(valueM2), 'm2');
  }

  budgetMessage(): string {
    const budget = Number(this.recap()?.budget_previsionnel ?? 0);
    if (!budget) {
      return '';
    }
    if (this.isBudgetSufficient()) {
      return `${this.estimatedCostLabel()} inferieur a votre budget de ${this.budgetLabel()}`;
    }
    return `${this.estimatedCostLabel()} superieur a votre budget de ${this.budgetLabel()}`;
  }
}
