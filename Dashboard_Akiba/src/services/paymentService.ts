import api from "./config/axios.config";
import { setCurrencyRates } from "../lib/currency";
import type { PaymentAmountResponse } from "../types/payment";

export async function fetchCurrencies(): Promise<void> {
  const res = await api.get("/currencies");
  if (res.data?.success && res.data?.data?.rates) {
    setCurrencyRates(res.data.data.rates, res.data.data.labels);
  }
}

export const getPaymentAmount = async (): Promise<PaymentAmountResponse> => {
  const response = await api.get<PaymentAmountResponse>("/payments/amount");
  return response.data;
};

/** Montant toujours envoyé en XAF. */
export const updatePaymentAmount = async (amount: number): Promise<PaymentAmountResponse> => {
  const response = await api.put<PaymentAmountResponse>("/payments/amount", { amount });
  return response.data;
};
