import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { YourProject } from '../../../../services/project/your-project';
import { ProjectData } from '../../../../services/project-data/project-data';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, switchMap, timeout } from 'rxjs/operators';
import { of } from 'rxjs';
import { stepTwoForm } from '../../../../interfaces/project-interface';
import { formatSuperficie } from '../../../../core/area/area.util';
import { CurrencyService } from '../../../../core/currency/currency.service';

interface Piece {
  designation: string;
  value: number;
  key: string;
  surface_standard: number;
  isCustom?: boolean;
}

type StandingOption = 'standard' | 'moyen' | 'haut';

@Component({
  selector: 'app-fourth-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fourth-step.html',
  styleUrl: './fourth-step.css',
})
export class FourthStep implements OnInit {
  @Input() isReadOnly = false;
  private router = inject(Router);
  private projectService = inject(YourProject);
  private projectDataService = inject(ProjectData);
  readonly currencyService = inject(CurrencyService);

  readonly standingOptions: { value: StandingOption; label: string; pricePerM2: number }[] = [
    { value: 'standard', label: 'Finition standard', pricePerM2: 305 },
    { value: 'moyen', label: 'Finition moyen standing', pricePerM2: 475 },
    { value: 'haut', label: 'Finition haut standing', pricePerM2: 610 },
  ];

  questions: Piece[] = [];
  isLoading = signal<boolean>(false);
  errorMsg = signal<string | null>(null);
  selectedStanding = signal<StandingOption>('standard');

  newPieceName = '';
  newPieceSurface: number | null = null;
  isCreatingPiece = signal<boolean>(false);

  ngOnInit() {
    this.selectedStanding.set(this.readStoredStanding());
    this.fetchPieces();
  }

  get totalPieces(): number {
    return this.questions.reduce((sum, q) => sum + q.value, 0);
  }

  get totalSurface(): number {
    return this.questions.reduce((sum, q) => sum + q.value * q.surface_standard, 0);
  }

  get formattedTotalSurface(): string {
    return formatSuperficie(this.totalSurface, 'm2');
  }

  get selectedStandingPricePerM2(): number {
    return (
      this.standingOptions.find((option) => option.value === this.selectedStanding())
        ?.pricePerM2 ?? 0
    );
  }

  get estimatedCostXaf(): number {
    return this.currencyService.toXaf(this.totalSurface * this.selectedStandingPricePerM2, 'EUR');
  }

  get estimatedCostLabel(): string {
    return this.currencyService.format(this.estimatedCostXaf, 'XAF');
  }

  fetchPieces() {
    this.isLoading.set(true);
    const savedData = this.projectDataService.getProjectData();
    const savedLignes = savedData.stepFour?.data?.lignes || [];

    this.projectService
      .getPieces()
      .pipe(
        timeout(10000),
        catchError((error) => {
          console.error('Request timed out or failed in fetchPieces:', error);
          return of({ success: false, data: [] });
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          if (response && response.success && Array.isArray(response.data)) {
            this.questions = response.data.map((piece: any) => {
              const piece_id = piece.id || piece.key;
              const savedPiece = savedLignes.find((l: any) => String(l.piece_id) === String(piece_id));
              return {
                designation: piece.designation,
                value: savedPiece ? savedPiece.nombre : 0,
                key: piece_id,
                surface_standard: piece.surface_standard || 0,
                isCustom: false,
              };
            });
          } else {
            console.warn('Invalid response from getPieces:', response);
          }
        },
        error: (error) => {
          console.error('Error fetching pieces:', error);
          this.isLoading.set(false);
        },
      });
  }

  updatePieceValue(index: number, delta: number) {
    const newValue = this.questions[index].value + delta;
    if (newValue >= 0) {
      this.questions[index].value = newValue;
    }
  }

  clampPieceValue(index: number) {
    const val = Number(this.questions[index].value);
    this.questions[index].value = isNaN(val) || val < 0 ? 0 : Math.floor(val);
  }

  onStandingChange(nextStanding: StandingOption) {
    this.selectedStanding.set(nextStanding);
  }

  createCustomPiece() {
    if (!this.newPieceName || !this.newPieceSurface) return;

    this.isCreatingPiece.set(true);
    this.projectService
      .createPiece({
        designation: this.newPieceName,
        surface_standard: this.newPieceSurface,
      })
      .pipe(finalize(() => this.isCreatingPiece.set(false)))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const newPiece = response.data;
            this.questions.push({
              designation: newPiece.designation,
              value: 1,
              key: newPiece.id,
              surface_standard: newPiece.surface_standard || this.newPieceSurface || 0,
              isCustom: true,
            });
            this.newPieceName = '';
            this.newPieceSurface = null;
          }
        },
        error: (error) => {
          console.error('Error creating piece:', error);
        },
      });
  }

  validate() {
    const projectData = this.projectDataService.getProjectData();
    const stepFourPayload: any = {
      step: 4,
      produit_id: projectData.produit_id,
      data: {
        lignes: this.questions
          .filter((q) => q.value > 0)
          .map((q) => ({
            piece_id: q.key,
            nombre: q.value,
          })),
      },
    };

    this.isLoading.set(true);
    this.errorMsg.set(null);

    this.persistStanding()
      .pipe(
        switchMap(() =>
          this.projectService.saveStepDraft(stepFourPayload).pipe(
            timeout(10000),
            catchError((error) => {
              console.error('Request timed out or failed in validate:', error);
              return of({ success: false });
            })
          )
        ),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          if (response?.success) {
            this.projectDataService.setProjectData({
              ...this.projectDataService.getProjectData(),
              stepFour: stepFourPayload,
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
                  selected_standing: this.selectedStanding(),
                  approved: false,
                  approved_at: null,
                },
              },
            });
            this.router.navigate(['/'], { fragment: 'step-5' });
            return;
          }
          this.errorMsg.set('Impossible de sauvegarder la configuration des pièces.');
        },
        error: (error) => {
          console.error('Error saving step draft:', error);
          this.errorMsg.set('Impossible de sauvegarder la configuration des pièces.');
        },
      });
  }

  private persistStanding() {
    const projectData = this.projectDataService.getProjectData();
    const stepTwo = projectData.stepTwo;
    if (!stepTwo) {
      return of(null);
    }

    const payload: stepTwoForm = {
      ...stepTwo,
      data: {
        ...stepTwo.data,
        standing: this.selectedStanding(),
      },
    };

    return this.projectService.saveStepTwoDraft(payload).pipe(
      timeout(10000),
      catchError((error) => {
        console.error('Error updating standing', error);
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
        }
        return of(response);
      })
    );
  }

  private readStoredStanding(): StandingOption {
    const standing = this.projectDataService.getProjectData().stepTwo?.data?.standing;
    if (standing === 'moyen' || standing === 'haut') {
      return standing;
    }
    return 'standard';
  }
}
