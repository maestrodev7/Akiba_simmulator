export type CurrencyCode = 'XAF' | 'EUR' | 'USD';

export interface CurrencyConfig {
  base: string;
  rates: Record<string, number>;
  labels: Record<string, string>;
}
