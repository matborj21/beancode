"use client";

import { BottomNav } from "@/app/components/pos/BottomNav";
import { api } from "@/trpc/react";
import { ArrowLeft, Receipt } from "lucide-react";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  VOIDED: "bg-red-100 text-red-600",
  PENDING: "bg-amber-100 text-amber-700",
  REFUNDED: "bg-gray-100 text-gray-600",
};

const PAYMENT_LABELS: Record<string, string> = {
  CASH: "💵 Cash",
  GCASH: "📱 GCash",
  CARD: "💳 Card",
};

export function HistoryScreen() {
  const { data: transactions = [], isLoading } = api.order.list.useQuery({});

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      {/* Header */}
      <div className="bg-amber-900 px-4 pb-4 pt-12 text-amber-50">
        <div className="flex items-center gap-3">
          <Link href="/mobile">
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-xl font-bold">Transaction History</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-amber-100"
              />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 pt-20 text-amber-300">
            <Receipt size={48} />
            <p className="text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="rounded-2xl bg-white p-4 shadow-sm">
                {/* Transaction Header */}
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-amber-900">
                      {tx.orderNumber}
                    </p>
                    <p className="text-xs text-amber-400">
                      {new Date(tx.createdAt).toLocaleString("en-PH", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        STATUS_STYLES[tx.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tx.status}
                    </span>
                    <span className="text-xs text-amber-500">
                      {PAYMENT_LABELS[tx.paymentMethod] ?? tx.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-3 space-y-1 border-t border-amber-50 pt-3">
                  {tx.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-xs text-amber-700"
                    >
                      <span>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span>
                        ₱{(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-amber-50 pt-3">
                  <div className="flex justify-between text-xs text-amber-500">
                    <span>Subtotal</span>
                    <span>₱{Number(tx.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-amber-500">
                    <span>VAT (12%)</span>
                    <span>₱{Number(tx.vat).toFixed(2)}</span>
                  </div>
                  <div className="mt-1 flex justify-between font-bold text-amber-900">
                    <span className="text-sm">Total</span>
                    <span className="text-sm">
                      ₱{Number(tx.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="/mobile/history" />
    </div>
  );
}
