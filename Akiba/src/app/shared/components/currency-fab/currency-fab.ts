import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../../core/currency/currency.service';
import { CurrencyCode } from '../../../core/currency/currency.types';

@Component({
  selector: 'app-currency-fab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      @if (open()) {
        <div
          class="bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[160px] animate-in fade-in slide-in-from-bottom-2 duration-200"
          role="listbox"
          aria-label="Choisir une devise"
        >
          @for (opt of currencyService.getOptions(); track opt.code) {
            <button
              type="button"
              role="option"
              [attr.aria-selected]="currencyService.selectedCurrency() === opt.code"
              class="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#56CB4E]/10"
              [class.text-[#56CB4E]]="currencyService.selectedCurrency() === opt.code"
              [class.bg-[#56CB4E]/5]="currencyService.selectedCurrency() === opt.code"
              (click)="select(opt.code)"
            >
              {{ opt.label }}
            </button>
          }
        </div>
      }

      <button
        type="button"
        (click)="toggle()"
        class="w-14 h-14 rounded-full bg-[#56CB4E] text-white shadow-lg hover:bg-[#3FAE38] hover:shadow-xl transition-all flex items-center justify-center text-sm font-bold ring-4 ring-white"
        [attr.aria-expanded]="open()"
        aria-label="Changer de devise"
        title="Devise"
      >
        {{ symbol() }}
      </button>
    </div>
  `,
})
export class CurrencyFab {
  currencyService = inject(CurrencyService);
  open = signal(false);

  symbol(): string {
    const map: Record<CurrencyCode, string> = {
      XAF: 'FCFA',
      EUR: '€',
      USD: '$',
    };
    return map[this.currencyService.selectedCurrency()] ?? 'FCFA';
  }

  toggle(): void {
    this.open.update((v) => !v);
  }

  select(code: CurrencyCode): void {
    this.currencyService.setCurrency(code);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-currency-fab')) {
      this.open.set(false);
    }
  }
}
