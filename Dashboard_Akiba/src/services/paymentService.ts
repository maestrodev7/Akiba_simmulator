import api from "./config/axios.config";
import { setCurrencyRates } from "../lib/currency";

export async function fetchCurrencies(): Promise<void> {
  const res = await api.get("/currencies");
  if (res.data?.success && res.data?.data?.rates) {
    setCurrencyRates(res.data.data.rates, res.data.data.labels);
  }
}

export async function getPaymentAmount(): Promise<number | null> {
  const res = await api.get("/payments/amount");
  const amount = res.data?.data?.amount;
  return amount != null ? Number(amount) : null;
}

/** Montant toujours envoyé en XAF. */
export async function updatePaymentAmount(amountXaf: number): Promise<number> {
  const res = await api.put("/payments/amount", { amount: amountXaf });
  return Number(res.data?.data?.amount ?? amountXaf);
}
