import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../../core/currency/currency.service';
import { CurrencyCode } from '../../../core/currency/currency.types';

@Component({
  selector: 'app-currency-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-2">
      <label *ngIf="label" class="font-medium text-gray-700">{{ label }}</label>
      <select
        [disabled]="disabled"
        [value]="currencyService.selectedCurrency()"
        (change)="onChange($event)"
        class="w-full p-3 bg-[#F5F5F5] border-2 border-gray-100 rounded-lg focus:border-[#56CB4E] outline-none transition-all"
      >
        <option *ngFor="let opt of currencyService.getOptions()" [value]="opt.code">
          {{ opt.label }}
        </option>
      </select>
      <p *ngIf="hint" class="text-xs text-gray-500">{{ hint }}</p>
    </div>
  `,
})
export class CurrencySelect {
  @Input() label = 'Devise';
  @Input() hint = 'Les montants sont enregistrés en FCFA (XAF) côté serveur.';
  @Input() disabled = false;
  @Output() currencyChange = new EventEmitter<{ previous: CurrencyCode; next: CurrencyCode }>();

  currencyService = inject(CurrencyService);

  onChange(event: Event): void {
    const next = (event.target as HTMLSelectElement).value as CurrencyCode;
    const previous = this.currencyService.selectedCurrency();
    if (previous === next) {
      return;
    }
    this.currencyChange.emit({ previous, next });
    this.currencyService.setCurrency(next);
  }
}
