import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-simulator-form',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './simulator-form.html',
  styleUrl: './simulator-form.css',
})
export class SimulatorForm {
  private router = inject(Router);

  step = signal<number>(1);
  showStepper = signal<boolean>(true);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateStepFromUrl();
    });
    this.updateStepFromUrl();
  }

  private updateStepFromUrl() {
    const url = this.router.url;
    const tree = this.router.parseUrl(url);
    const fragment = tree.fragment;

    this.showStepper.set(!url.includes('payment-step'));
    if (url.includes('second-step-part-two') || fragment === 'step-3') this.step.set(3);
    else if (url.includes('second-step') || fragment === 'step-2') this.step.set(2);
    else if (url.includes('third-step') || fragment === 'step-4') this.step.set(4);
    else if (url.includes('fourth-step') || fragment === 'step-5') this.step.set(5);
    else if (url.includes('fifth-step') || fragment === 'step-6') this.step.set(6);
    else if (url.includes('sixth-step') || fragment === 'step-7') this.step.set(7);
    else if (url.includes('payment-step')) this.step.set(7);
    else if (url.includes('first-step') || fragment === 'step-1') this.step.set(1);
    else this.step.set(1);
  }

  steps = [
    { id: 1, label: 'fiche de renseignements' },
    { id: 2, label: 'Fiche de renseignement du terrain' },
    { id: 3, label: 'Fiche définition projet' },
    { id: 4, label: 'Calendrier prévisionnel des travaux' },
    { id: 5, label: 'Détermination du programme' },
    { id: 6, label: 'Récapitulatif' },
    { id: 7, label: "Estimation financière de votre projet" },
  ];


  nextStep() {
    if (this.step() < 7) {
      this.goToStep(this.step() + 1);
    }
  }

  prevStep() {
    if (this.step() > 1) {
      this.goToStep(this.step() - 1);
    }
  }

  goToStep(step: number) {
    const stepRoutes: { [key: number]: string } = {
      1: 'first-step',
      2: 'second-step',
      3: 'second-step-part-two',
      4: 'third-step',
      5: 'fourth-step',
      6: 'fifth-step',
      7: 'sixth-step'
    };
    this.router.navigate(['/votre-projet', stepRoutes[step]]);
  }

}
