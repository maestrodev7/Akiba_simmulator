import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { YourProject } from '../../../../services/project/your-project';
import { ProjectData } from '../../../../services/project-data/project-data';
import { CurrencyService } from '../../../../core/currency/currency.service';

@Component({
  selector: 'app-sixth-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sixth-step.html',
  styleUrl: './sixth-step.css',
})
export class SixthStep implements OnInit {
  private router = inject(Router);
  private projectService = inject(YourProject);
  private projectDataService = inject(ProjectData);
  private currencyService = inject(CurrencyService);

  pay_method: "CARD" | "MOBILE" = "CARD";
  mobile_operator: "MTN" | "ORANGE" = "MTN";
  errorMsg = "";

  enablePayment = true;
  account_number: string = '';
  /** Montant de simulation en XAF (référence backend). */
  amountXaf = signal<number>(100);
  displayAmount = computed(() =>
    this.currencyService.fromXaf(this.amountXaf())
  );
  displayAmountLabel = computed(() =>
    this.currencyService.format(this.displayAmount())
  );
  loading: boolean = false;
  transactionStatus = signal<string | null>(null);

  ngOnInit() {
    this.currencyService.loadRates().subscribe();
    this.projectService.getAmount().subscribe({
      next: (res) => {
        if (res.success && res.data?.amount) {
          this.amountXaf.set(Number(res.data.amount));
        }
      },
      error: (err) => {
        console.error('Error fetching amount', err);
      }
    });
  }

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
        if ((statut === 'EN_ATTENTE' || statut === "pending") && this.transactionStatus()) {
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
      const rawNumber = this.account_number.replace(/\s/g, '');
      if (!rawNumber || rawNumber.length < 9) {
        this.errorMsg = "Veuillez renseigner un numéro de téléphone valide (9 chiffres)";
        this.loading = false;
        return;
      }
      
      const payload = {
        client_id: this.projectDataService.getProjectData().client_id,
        account_number: rawNumber // Send without spaces
      };
      console.log("mobile play load", payload)

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
              this.enablePayment = false;
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
          this.errorMsg = `une erreur s'est produite ${err.error.message}`
          console.error('Payment error', err);
        }
      });
    } else {
      const payload = {
        client_id: this.projectDataService.getProjectData().client_id,
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
          this.errorMsg = `une erreur s'est produite ${err.error.message}`
          console.error('Payment error', err);
        }
      });
    }
  }

  closeStatusModal() {
    this.transactionStatus.set(null);
    this.loading = false;
  }

  onAccountNumberChange(event: any) {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length > 9) value = value.slice(0, 9); // Limit to 9 digits (standard for many regions)
    
    // Format: 000 000 000
    const parts = [];
    for (let i = 0; i < value.length; i += 3) {
      parts.push(value.substring(i, i + 3));
    }
    this.account_number = parts.join(' ');
  }
}
