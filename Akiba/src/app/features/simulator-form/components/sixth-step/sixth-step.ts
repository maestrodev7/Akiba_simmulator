import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sixth-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sixth-step.html',
  styleUrl: './sixth-step.css',
})
export class SixthStep {
  private router = inject(Router);
  pay_method: "CARD" | "MOBILE" = "CARD"

  prevStep() {
    this.router.navigate(['/votre-projet/fifth-step']);
  }
}
