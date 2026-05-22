import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CurrencyCode, CurrencyConfig } from './currency.types';
import { ProjectData } from '../../services/project-data/project-data';

const FALLBACK_RATES: Record<CurrencyCode, number> = {
  XAF: 1,
  EUR: 655.957,
  USD: 600,
};

const FALLBACK_LABELS: Record<CurrencyCode, string> = {
  XAF: 'FCFA (XAF)',
  EUR: 'Euro (€)',
  USD: 'Dollar ($)',
};

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private http = inject(HttpClient);
  private projectData = inject(ProjectData);

  readonly selectedCurrency = signal<CurrencyCode>('XAF');
  private rates: Record<string, number> = { ...FALLBACK_RATES };
  private labels: Record<string, string> = { ...FALLBACK_LABELS };

  constructor() {
    const saved = this.projectData.getProjectData().display_currency as CurrencyCode | undefined;
    if (saved && this.isSupported(saved)) {
      this.selectedCurrency.set(saved);
    }
  }

  loadRates(): Observable<{ success: boolean; data: CurrencyConfig }> {
    return this.http
      .get<{ success: boolean; data: CurrencyConfig }>(`${environment.apiUrl}/currencies`)
      .pipe(
        tap((res) => {
          if (res.success && res.data?.rates) {
            this.rates = res.data.rates;
            this.labels = res.data.labels ?? this.labels;
          }
        })
      );
  }

  getOptions(): { code: CurrencyCode; label: string }[] {
    return (Object.keys(this.rates) as CurrencyCode[]).map((code) => ({
      code,
      label: this.labels[code] ?? code,
    }));
  }

  setCurrency(code: CurrencyCode): void {
    if (!this.isSupported(code)) {
      return;
    }
    this.selectedCurrency.set(code);
    this.projectData.setProjectData({
      ...this.projectData.getProjectData(),
      display_currency: code,
    });
  }

  /** Montant saisi par l'utilisateur → XAF (envoi API). */
  toXaf(amount: number, from?: CurrencyCode): number {
    const code = from ?? this.selectedCurrency();
    const rate = this.rates[code] ?? 1;
    return Math.round(amount * rate * 100) / 100;
  }

  /** Montant XAF (backend) → affichage. */
  fromXaf(amountXaf: number, to?: CurrencyCode): number {
    const code = to ?? this.selectedCurrency();
    const rate = this.rates[code] ?? 1;
    if (rate <= 0) {
      return amountXaf;
    }
    return Math.round((amountXaf / rate) * 100) / 100;
  }

  format(amount: number, currency?: CurrencyCode): string {
    const code = currency ?? this.selectedCurrency();
    const formatted = Number(amount).toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    switch (code) {
      case 'EUR':
        return `${formatted} €`;
      case 'USD':
        return `${formatted} $`;
      default:
        return `${formatted} FCFA`;
    }
  }

  private isSupported(code: string): code is CurrencyCode {
    return code in this.rates;
  }
}
