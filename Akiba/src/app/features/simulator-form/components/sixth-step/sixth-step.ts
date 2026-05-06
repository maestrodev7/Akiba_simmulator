import { Component, inject, signal } from '@angular/core';
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
  amount: number = 100;
  loading: boolean = false;
  transactionStatus = signal<string | null>(null);

  prevStep() {
    this.router.navigate(['/votre-projet/fifth-step']);
  }

  checkPaymentStatus(reference: string) {
    this.projectService.checkTransactionStatus(reference).subscribe({
      next: (res) => {
        console.log("response du check statut", res)
        const statut = res.data?.transaction?.last_status_payload.content.statut;
        this.transactionStatus.set(statut ?? null);
        console.log("voici le statut du check", statut);
        if (statut === 'EN_ATTENTE' || statut === "pending") {
          setTimeout(() => {
            this.checkPaymentStatus(reference);
          }, 7000);
        } else {
          this.loading = false;
          if (statut === 'SUCCESS' || statut === 'VALIDE' || statut === 'TERMINE') {
            console.log('Payment successful');
          } else {
            console.error('Payment failed', statut, res);
          }
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error checking payment status', err);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.transactionStatus.set(null);
    if (this.pay_method === 'MOBILE') {
      const payload = {
        amount: this.amount,
        account_number: this.account_number
      };
      this.projectService.depositMobile(payload).subscribe({
        next: (res) => {
          const statut = res.data?.transaction?.statut;
          console.log("voici la res", res, "avec le statut", statut)
          if (statut) {
            this.transactionStatus.set(statut);
          }
          if (statut === 'EN_ATTENTE' || statut === "pending") {
            const reference = res.data.transaction?.reference || res.data.reference;
            if (reference) {
              setTimeout(() => {
                this.checkPaymentStatus(reference);
              }, 20000);
            } else {
              this.loading = false;
            }
          } else {
            this.loading = false;
            if (res.success && res.data?.payment_url) {
              window.location.href = res.data.payment_url;
            }
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
