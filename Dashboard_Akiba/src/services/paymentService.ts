import api from "./config/axios.config";
import type { PaymentAmountResponse } from "../types/payment";

export const getPaymentAmount = async (): Promise<PaymentAmountResponse> => {
    const response = await api.get<PaymentAmountResponse>("/payments/amount");
    return response.data;
};

export const updatePaymentAmount = async (amount: number): Promise<PaymentAmountResponse> => {
    const response = await api.put<PaymentAmountResponse>("/payments/amount", { amount });
    return response.data;
};
