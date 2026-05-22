export interface PaymentAmountResponse {
    success: boolean;
    data: {
        amount: number;
    };
    message?: string;
}

export interface UpdatePaymentAmountRequest {
    amount: number;
}
