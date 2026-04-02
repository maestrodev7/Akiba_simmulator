import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectData } from '../../../../services/project-data/project-data';
import { FirstStep } from '../first-step/first-step';
import { SecondStep } from '../second-step/second-step';
import { ThirdStep } from '../third-step/third-step';
import { YourProject } from '../../../../services/project/your-project';

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

  ngOnInit() {
    this.projectData = this.projectDataService.getProjectData();
    this.fetchPiecesAndMap();
  }

  fetchPiecesAndMap() {
    const savedLignes = this.projectData?.stepFour?.data?.lignes || [];
    this.projectService.getPieces().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.lignes = savedLignes.map((saved: any) => {
            const piece = response.data.find((p: any) => p.id === saved.piece_id);
            return {
              ...saved,
              designation: piece ? piece.designation : 'Pièce personnalisée'
            };
          });
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
