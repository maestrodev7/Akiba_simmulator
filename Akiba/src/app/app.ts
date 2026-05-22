import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrencyFab } from './shared/components/currency-fab/currency-fab';
import { CurrencyService } from './core/currency/currency.service';
import AOS from 'aos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CurrencyFab],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Akiba');

  private platformId = inject(PLATFORM_ID);
  private currencyService = inject(CurrencyService);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.currencyService.loadRates().subscribe();
      AOS.init({
        duration: 600,
      });
    }
  }
  
}
