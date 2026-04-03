import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { YourProject } from '../../../../services/project/your-project';
import { ProjectData } from '../../../../services/project-data/project-data';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Question {
  label: string;
  value: number;
  key: string;
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

  questions: Question[] = [];
  currentQuestionIndex = 0;
  isLoading = signal<boolean>(false);

  // For custom piece creation
  isAddingPiece = false;
  newPieceName = '';
  newPieceSurface: number | null = null;
  isCreatingPiece = false;

  ngOnInit() {
    this.fetchPieces();
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
                label: `Combien de ${piece.designation} voulez-vous ?`,
                value: savedPiece ? savedPiece.nombre : 1,
                key: piece_id
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

  get currentQuestion() {
    return (this.isAddingPiece || this.questions.length === 0) ? null : this.questions[this.currentQuestionIndex];
  }

  get allQuestionsAnswered() {
    return this.questions.length > 0 && this.currentQuestionIndex === this.questions.length - 1;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.isAddingPiece = true;
    }
  }

  prevQuestion() {
    if (this.isAddingPiece) {
      this.isAddingPiece = false;
    } else if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  updateValue(amount: number) {
    if (this.currentQuestion) {
      const newValue = this.currentQuestion.value + amount;
      if (newValue >= 0) {
        this.currentQuestion.value = newValue;
      }
    }
  }

  createCustomPiece() {
    if (!this.newPieceName || !this.newPieceSurface) return;

    this.isCreatingPiece = true;
    this.projectService.createPiece({
      designation: this.newPieceName,
      surface_standard: this.newPieceSurface
    })
      .pipe(finalize(() => this.isCreatingPiece = false))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const newPiece = response.data;
            this.questions.push({
              label: `Combien de ${newPiece.designation} voulez-vous ?`,
              value: 1,
              key: newPiece.id
            });
            // Reset custom piece form and go to that new question
            this.newPieceName = '';
            this.newPieceSurface = null;
            this.isAddingPiece = false;
            this.currentQuestionIndex = this.questions.length - 1;
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
            // Save to local storage for recap
            this.projectDataService.setProjectData({
              stepFour: payload
            });
            this.router.navigate(['/votre-projet/fifth-step']);
          }
        },
        error: (error) => {
          console.error('Error saving step draft:', error);
          this.isLoading.set(false);
        }
      });
  }

  prevStep() {
    this.router.navigate(['/votre-projet/third-step']);
  }
}
