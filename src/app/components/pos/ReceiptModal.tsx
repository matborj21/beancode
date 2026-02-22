"use client";

import { useRef } from "react";
import { CheckCircle, Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type ReceiptItem = {
  name: string;
  quantity: number;
  price: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  orderNumber: string;
  items: ReceiptItem[];
  subtotal: number;
  vat: number;
  total: number;
  paymentMethod: string;
  createdAt: Date;
};

const PAYMENT_LABELS: Record<string, string> = {
  CASH: "💵 Cash",
  GCASH: "📱 GCash",
  CARD: "💳 Card",
};

export function ReceiptModal({
  open,
  onClose,
  orderNumber,
  items,
  subtotal,
  vat,
  total,
  paymentMethod,
  createdAt,
}: Props) {
  const receiptRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const content = receiptRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${orderNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: monospace; font-size: 12px; width: 300px; margin: 0 auto; padding: 16px; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .row { display: flex; justify-content: space-between; margin: 2px 0; }
            .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; margin-top: 4px; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm overflow-hidden p-0">
        {/* Success Header */}
        <div className="bg-green-500 px-6 py-5 text-center text-white">
          <CheckCircle size={40} className="mx-auto mb-2" />
          <h2 className="text-lg font-bold">Order Complete!</h2>
          <p className="text-sm text-green-100">Transaction successful</p>
        </div>

        {/* Receipt Content */}
        <div className="p-4">
          <div ref={receiptRef} className="font-mono text-xs">
            {/* Header */}
            <div className="mb-3 text-center">
              <p className="text-base font-bold text-amber-900">BeanCode POS</p>
              <p className="text-amber-500">Official Receipt</p>
              <p className="mt-1 text-amber-400">
                {createdAt.toLocaleString("en-PH", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="font-semibold text-amber-700">{orderNumber}</p>
            </div>

            <div className="my-2 border-t border-dashed border-amber-200" />

            {/* Items */}
            <div className="space-y-1">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <div>
                    <span className="text-amber-900">{item.name}</span>
                    <span className="ml-1 text-amber-400">
                      ×{item.quantity}
                    </span>
                  </div>
                  <span className="text-amber-900">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-2 border-t border-dashed border-amber-200" />

            {/* Totals */}
            <div className="space-y-1">
              <div className="flex justify-between text-amber-600">
                <span>Subtotal</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-amber-600">
                <span>VAT (12%)</span>
                <span>₱{vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-amber-900">
                <span>TOTAL</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="my-2 border-t border-dashed border-amber-200" />

            {/* Payment */}
            <div className="flex justify-between text-amber-700">
              <span>Payment</span>
              <span>{PAYMENT_LABELS[paymentMethod] ?? paymentMethod}</span>
            </div>

            <div className="my-3 border-t border-dashed border-amber-200" />

            {/* Footer */}
            <p className="text-center text-amber-400">
              Thank you for your purchase!
            </p>
            <p className="text-center text-amber-400">Please come again ☕</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-amber-100 p-4">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex-1 gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
          >
            <Printer size={16} />
            Print
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 gap-2 bg-amber-900 text-amber-50 hover:bg-amber-800"
          >
            <X size={16} />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
