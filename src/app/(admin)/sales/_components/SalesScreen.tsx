"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { AdminSidebar } from "@/app/(admin)/dashboard/_components/AdminSidebar";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type Filters = {
  from: string;
  to: string;
  paymentMethod: string;
  status: string;
};

export function SalesScreen() {
  const [filters, setFilters] = useState<Filters>({
    from: "",
    to: "",
    paymentMethod: "ALL",
    status: "ALL",
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: transactions = [], isLoading } = api.order.list.useQuery({
    from: filters.from ? new Date(filters.from) : undefined,
    to: filters.to ? new Date(filters.to + "T23:59:59") : undefined,
    paymentMethod:
      filters.paymentMethod !== "ALL"
        ? (filters.paymentMethod as "CASH" | "GCASH" | "CARD")
        : undefined,
    status:
      filters.status !== "ALL"
        ? (filters.status as "PENDING" | "PAID" | "VOIDED" | "REFUNDED")
        : undefined,
  });

  // Summary totals
  const totalSales = transactions
    .filter((t) => t.status === "PAID")
    .reduce((sum, t) => sum + Number(t.total), 0);
  const totalOrders = transactions.filter((t) => t.status === "PAID").length;
  const totalVoided = transactions.filter((t) => t.status === "VOIDED").length;

  function clearFilters() {
    setFilters({ from: "", to: "", paymentMethod: "ALL", status: "ALL" });
  }

  return (
    <div className="flex h-screen bg-amber-50">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-amber-900">Sales</h2>
          <p className="text-sm text-amber-500">All transaction records</p>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-amber-600">Total Sales</p>
            <p className="text-2xl font-bold text-amber-900">
              ₱{totalSales.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-amber-600">Paid Orders</p>
            <p className="text-2xl font-bold text-green-600">{totalOrders}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-amber-600">Voided Orders</p>
            <p className="text-2xl font-bold text-red-500">{totalVoided}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl bg-white p-4 shadow-sm">
          <Filter size={16} className="mt-1 text-amber-600" />

          {/* Date From */}
          <div>
            <label className="mb-1 block text-xs font-medium text-amber-600">
              From
            </label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) =>
                setFilters((p) => ({ ...p, from: e.target.value }))
              }
              className="rounded-lg border border-amber-200 px-3 py-2 text-sm text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="mb-1 block text-xs font-medium text-amber-600">
              To
            </label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) =>
                setFilters((p) => ({ ...p, to: e.target.value }))
              }
              className="rounded-lg border border-amber-200 px-3 py-2 text-sm text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="mb-1 block text-xs font-medium text-amber-600">
              Payment
            </label>
            <Select
              value={filters.paymentMethod}
              onValueChange={(val) =>
                setFilters((p) => ({ ...p, paymentMethod: val }))
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="ALL">All Methods</SelectItem>
                <SelectItem value="CASH">💵 Cash</SelectItem>
                <SelectItem value="GCASH">📱 GCash</SelectItem>
                <SelectItem value="CARD">💳 Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-xs font-medium text-amber-600">
              Status
            </label>
            <Select
              value={filters.status}
              onValueChange={(val) =>
                setFilters((p) => ({ ...p, status: val }))
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="VOIDED">Voided</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={clearFilters}
            className="border-amber-200 text-amber-600 hover:bg-amber-50"
          >
            Clear
          </Button>
        </div>

        {/* Transactions Count */}
        <p className="mb-3 text-xs text-amber-600">
          {transactions.length} transaction
          {transactions.length !== 1 ? "s" : ""} found
        </p>

        {/* Transactions Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-xl bg-amber-100"
                />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-amber-300">
              No transactions found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-100 bg-amber-50 text-left text-xs font-semibold uppercase tracking-wide text-amber-500">
                  <th className="px-4 py-3">Order #</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3 text-center">Payment</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50">
                {transactions.map((tx) => (
                  <>
                    <tr
                      key={tx.id}
                      className="transition-colors hover:bg-amber-50"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-amber-900">
                        {tx.orderNumber}
                      </td>
                      <td className="px-4 py-3 text-amber-600">
                        {new Date(tx.createdAt).toLocaleString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-center text-amber-600">
                        {PAYMENT_LABELS[tx.paymentMethod] ?? tx.paymentMethod}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            STATUS_STYLES[tx.status] ??
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-amber-900">
                        ₱{Number(tx.total).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            setExpandedId(expandedId === tx.id ? null : tx.id)
                          }
                          className="text-amber-600 hover:text-amber-700"
                        >
                          {expandedId === tx.id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row — Order Items */}
                    {expandedId === tx.id && (
                      <tr key={`${tx.id}-expanded`}>
                        <td colSpan={6} className="bg-amber-50 px-8 py-4">
                          <div className="space-y-1">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-500">
                              Order Items
                            </p>
                            {tx.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between text-xs text-amber-700"
                              >
                                <span>
                                  {item.product.name} × {item.quantity}
                                </span>
                                <span>
                                  ₱
                                  {(Number(item.price) * item.quantity).toFixed(
                                    2,
                                  )}
                                </span>
                              </div>
                            ))}
                            <div className="mt-2 border-t border-amber-200 pt-2">
                              <div className="flex justify-between text-xs text-amber-500">
                                <span>Subtotal</span>
                                <span>₱{Number(tx.subtotal).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-xs text-amber-500">
                                <span>VAT (12%)</span>
                                <span>₱{Number(tx.vat).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm font-bold text-amber-900">
                                <span>Total</span>
                                <span>₱{Number(tx.total).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
