import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectData } from '../../../../services/project-data/project-data';
import { FirstStep } from '../first-step/first-step';
import { SecondStep } from '../second-step/second-step';
import { ThirdStep } from '../third-step/third-step';
import { YourProject } from '../../../../services/project/your-project';
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
  lignes: any[] = [];
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.projectData = this.projectDataService.getProjectData();
    this.fetchPiecesAndMap();
  }

  fetchPiecesAndMap() {
    const savedLignes = this.projectDataService.getProjectData()?.stepFour?.data?.lignes || [];

    // Initialize with saved data using fallback designation
    this.lignes = savedLignes.map((l: any) => ({
      ...l,
      designation: l.designation || 'Pièce'
    }));

    if (savedLignes.length === 0) return;

    this.isLoading.set(true);
    this.projectService.getPieces()
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Error fetching pieces in recap:', error);
          return of({ success: false, data: [] });
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            console.log("response alpha alpha", response);
            console.log("project data", this.projectDataService.getProjectData());
            this.lignes = savedLignes.map((saved: any) => {
              const piece = response.data.find((p: any) => String(p.id) === String(saved.piece_id));
              return {
                ...saved,
                designation: piece ? piece.designation : (saved.designation || 'Pièce personnalisée')
              };
            });
            console.log("Step 5 saved successfully", response);
            console.log("project data", this.projectDataService.getProjectData());
          }
        }
      });
  }

  get stepOne() { return this.projectData?.stepOne?.data; }
  get stepTwo() { return this.projectData?.stepTwo?.data; }
  get stepThree() { return this.projectData?.stepThree?.data; }
  get stepFour() { return this.projectData?.stepFour?.data; }

  nextStep() {
    this.router.navigate(['/votre-projet/sixth-step']);
  }

  prevStep() {
    this.router.navigate(['/votre-projet/fourth-step']);
  }
}
