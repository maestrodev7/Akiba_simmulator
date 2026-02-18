import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-simulator-form',
  imports: [CommonModule],
  templateUrl: './simulator-form.html',
  styleUrl: './simulator-form.css',
})
export class SimulatorForm {
  step = signal<number>(1);

  steps = [
    { id: 1, label: 'fiche de renseignements' },
    { id: 2, label: 'fiche des contraintes et besoins - elements de programmation' },
    { id: 3, label: 'Calendrier prévisionnel des travaux' },
    { id: 4, label: 'Détermination du programme' },
    { id: 5, label: 'Gestion des types de pièces (catalogue)' },
    { id: 6, label: 'Gestion des types de pièces (catalogue)' },
  ];

  nextStep() {
    if (this.step() < 6) {
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

  submitForm() {
    console.log('Form submitted');
  }
}
