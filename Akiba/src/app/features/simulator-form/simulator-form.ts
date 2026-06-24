import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  SIMULATOR_STEPS,
  getRouteForStep,
  getStepFromUrl,
  shouldShowStepper,
} from './simulator-steps.config';

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
  steps = SIMULATOR_STEPS;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.syncStepFromUrl();
    });
    this.syncStepFromUrl();
  }

  private syncStepFromUrl() {
    const tree = this.router.parseUrl(this.router.url);
    const url = this.router.url;

    this.showStepper.set(shouldShowStepper(url));
    this.step.set(getStepFromUrl(url, tree.fragment));
  }

  nextStep() {
    if (this.step() < this.steps.length) {
      this.goToStep(this.step() + 1);
    }
  }

  prevStep() {
    if (this.step() > 1) {
      this.goToStep(this.step() - 1);
    }
  }

  goToStep(stepId: number) {
    if (stepId < 1 || stepId > this.steps.length) {
      return;
    }

    this.step.set(stepId);
    this.router.navigate(['/votre-projet', getRouteForStep(stepId)]);
  }
}
