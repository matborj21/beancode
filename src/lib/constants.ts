export const VAT_RATE = 0.12;

export const PAYMENT_METHODS = ["CASH", "GCASH", "CARD"] as const;

export const ORDER_NUMBER = `ORD-${Date.now().toString().slice(-6)}`;
