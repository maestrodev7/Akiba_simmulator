import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { YourProject } from '../../../../services/project/your-project';

@Component({
  selector: 'app-sixth-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sixth-step.html',
  styleUrl: './sixth-step.css',
})
export class SixthStep {
  private router = inject(Router);
  private projectService = inject(YourProject);

  pay_method: "CARD" | "MOBILE" = "CARD";

  account_number: string = '';
  amount: number = 50;
  loading: boolean = false;

  prevStep() {
    this.router.navigate(['/votre-projet/fifth-step']);
  }

  onSubmit() {
    this.loading = true;
    if (this.pay_method === 'MOBILE') {
      const payload = {
        amount: this.amount,
        account_number: this.account_number
      };
      this.projectService.depositMobile(payload).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success && res.data?.payment_url) {
            window.location.href = res.data.payment_url;
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Payment error', err);
        }
      });
    } else {
      const payload = {
        amount: this.amount
      };
      this.projectService.depositCard(payload).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success && res.data?.payment_url) {
            window.location.href = res.data.payment_url;
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Payment error', err);
        }
      });
    }
  }
}
