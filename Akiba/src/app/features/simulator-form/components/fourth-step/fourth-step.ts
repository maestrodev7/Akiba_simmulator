import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { YourProject } from '../../../../services/project/your-project';
import { ProjectData } from '../../../../services/project-data/project-data';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Piece {
  designation: string;
  value: number;
  key: string;
  surface_standard: number;
  isCustom?: boolean;
}

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

  questions: Piece[] = [];
  isLoading = signal<boolean>(false);

  // For custom piece creation
  showAddPieceForm = false;
  newPieceName = '';
  newPieceSurface: number | null = null;
  isCreatingPiece = signal<boolean>(false);

  ngOnInit() {
    this.fetchPieces();
  }

  get totalPieces(): number {
    return this.questions.reduce((sum, q) => sum + q.value, 0);
  }

  get totalSurface(): number {
    return this.questions.reduce((sum, q) => sum + (q.value * q.surface_standard), 0);
  }

  fetchPieces() {
    this.isLoading.set(true);
    const savedData = this.projectDataService.getProjectData();
    const savedLignes = savedData.stepFour?.data?.lignes || [];

    this.projectService.getPieces()
      .pipe(
        timeout(10000),
        catchError(error => {
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
                value: savedPiece ? savedPiece.nombre : 1,
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
        }
      });
  }

  updatePieceValue(index: number, delta: number) {
    const newValue = this.questions[index].value + delta;
    if (newValue >= 0) {
      this.questions[index].value = newValue;
    }
  }

  removePiece(index: number) {
    this.questions.splice(index, 1);
  }

  createCustomPiece() {
    if (!this.newPieceName || !this.newPieceSurface) return;

    this.isCreatingPiece.set(true);
    this.projectService.createPiece({
      designation: this.newPieceName,
      surface_standard: this.newPieceSurface
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
            this.showAddPieceForm = false;
          }
        },
        error: (error) => {
          console.error('Error creating piece:', error);
        }
      });
  }

  nextStep() {
    const projectData = this.projectDataService.getProjectData();
    const payload: any = {
      step: 4,
      produit_id: projectData.produit_id,
      data: {
        lignes: this.questions.map(q => ({
          piece_id: q.key,
          nombre: q.value
        }))
      }
    };

    this.isLoading.set(true);
    this.projectService.saveStepDraft(payload)
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Request timed out or failed in nextStep:', error);
          return of({ success: false });
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.projectDataService.setProjectData({
              stepFour: payload,
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
            console.log("Step 4 saved successfully", response);
            this.router.navigate(['/'], { fragment: 'step-5' });
          }
        },
        error: (error) => {
          console.error('Error saving step draft:', error);
          this.isLoading.set(false);
        }
      });
  }

  prevStep() {
    this.router.navigate(['/votre-projet/second-step-part-two']);
  }
}
