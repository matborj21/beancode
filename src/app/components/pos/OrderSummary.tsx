"use client";

type Props = {
  subtotal: number;
  vat: number;
  total: number;
};

export function OrderSummary({ subtotal, vat, total }: Props) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-semibold text-amber-900">Order Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-amber-700">
          <span>Subtotal</span>
          <span>₱{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-amber-700">
          <span>VAT (12%)</span>
          <span>₱{vat.toFixed(2)}</span>
        </div>
        <div className="mt-2 border-t border-amber-100 pt-2">
          <div className="flex justify-between font-bold text-amber-900">
            <span>Total</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
