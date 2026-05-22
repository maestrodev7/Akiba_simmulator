export type CurrencyCode = "XAF" | "EUR" | "USD";

const FALLBACK_RATES: Record<CurrencyCode, number> = {
  XAF: 1,
  EUR: 655.957,
  USD: 600,
};

const FALLBACK_LABELS: Record<CurrencyCode, string> = {
  XAF: "FCFA (XAF)",
  EUR: "Euro (€)",
  USD: "Dollar ($)",
};

let rates: Record<string, number> = { ...FALLBACK_RATES };
let labels: Record<string, string> = { ...FALLBACK_LABELS };

export function setCurrencyRates(
  nextRates: Record<string, number>,
  nextLabels?: Record<string, string>
): void {
  rates = { ...FALLBACK_RATES, ...nextRates };
  if (nextLabels) {
    labels = { ...FALLBACK_LABELS, ...nextLabels };
  }
}

export function getCurrencyOptions(): { code: CurrencyCode; label: string }[] {
  return (Object.keys(rates) as CurrencyCode[]).map((code) => ({
    code,
    label: labels[code] ?? code,
  }));
}

export function toXaf(amount: number, from: CurrencyCode): number {
  const rate = rates[from] ?? 1;
  return Math.round(amount * rate * 100) / 100;
}

export function fromXaf(amountXaf: number, to: CurrencyCode): number {
  const rate = rates[to] ?? 1;
  if (rate <= 0) return amountXaf;
  return Math.round((amountXaf / rate) * 100) / 100;
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  const formatted = Number(amount).toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  switch (currency) {
    case "EUR":
      return `${formatted} €`;
    case "USD":
      return `${formatted} $`;
    default:
      return `${formatted} FCFA`;
  }
}
