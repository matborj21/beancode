export const VAT_RATE = 0.12;

export const PAYMENT_METHODS = ["CASH", "GCASH", "CARD"] as const;

export const ORDER_NUMBER = `ORD-${Date.now().toString().slice(-6)}`;

export const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  VOIDED: "bg-red-100 text-red-600",
  PENDING: "bg-amber-100 text-amber-700",
  REFUNDED: "bg-gray-100 text-gray-600",
};

export const PAYMENT_LABELS: Record<string, string> = {
  CASH: "💵 Cash",
  GCASH: "📱 GCash",
  CARD: "💳 Card",
};
