import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-simulator-form',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './simulator-form.html',
  styleUrl: './simulator-form.css',
})
export class SimulatorForm {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

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
    this.showStepper.set(!url.includes('payment-step'));
    if (url.includes('second-step')) this.step.set(2);
    else if (url.includes('third-step')) this.step.set(3);
    else if (url.includes('fourth-step')) this.step.set(4);
    else if (url.includes('fifth-step')) this.step.set(5);
    else if (url.includes('sixth-step')) this.step.set(6);
    else if (url.includes('payment-step')) this.step.set(6);
    else if (url.includes('first-step')) this.step.set(1);
    else this.step.set(1);
  }

  steps = [
    { id: 1, label: 'fiche de renseignements' },
    { id: 2, label: 'fiche des contraintes et besoins - elements de programmation' },
    { id: 3, label: 'Calendrier prévisionnel des travaux' },
    { id: 4, label: 'Détermination du programme' },
    { id: 5, label: 'Récapitulatif' },
    { id: 6, label: "Estimation financière de votre projet" },
  ];


  nextStep() {
    if (this.step() < 6) {
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
      3: 'third-step',
      4: 'fourth-step',
      5: 'fifth-step',
      6: 'sixth-step'
    };
    this.router.navigate(['/votre-projet', stepRoutes[step]]);
  }

}
