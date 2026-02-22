"use client";

import { api } from "@/trpc/react";

export function SalesReport() {
  const { data, isLoading } = api.report.dailySales.useQuery({});

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-amber-100" />
        ))}
      </div>
    );
  }

  if (!data || data.breakdown.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center text-amber-600 shadow-sm">
        No sales data yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs text-amber-600">Total Orders</p>
          <p className="text-2xl font-bold text-amber-900">
            {data?.totalOrders}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs text-amber-600">Total Items Sold</p>
          <p className="text-2xl font-bold text-amber-900">
            {data?.totalQuantity}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs text-amber-600">Total Sales</p>
          <p className="text-2xl font-bold text-amber-900">
            ₱{data?.totalSales.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Sales Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-amber-100 bg-amber-50 text-left text-xs font-semibold uppercase tracking-wide text-amber-500">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-center">Qty Sold</th>
              <th className="px-4 py-3 text-right">Unit Price</th>
              <th className="px-4 py-3 text-right">Sales Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-50">
            {data?.breakdown.map((row) => (
              <tr
                key={row.productId}
                className="transition-colors hover:bg-amber-50"
              >
                <td className="px-4 py-3 font-medium text-amber-900">
                  {row.name}
                </td>
                <td className="px-4 py-3 text-amber-500">{row.category}</td>
                <td className="px-4 py-3 text-center text-amber-700">
                  {row.quantity}
                </td>
                <td className="px-4 py-3 text-right text-amber-700">
                  ₱{row.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-amber-900">
                  ₱{row.salesTotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          {/* Footer totals */}
          <tfoot>
            <tr className="border-t-2 border-amber-200 bg-amber-50 font-bold text-amber-900">
              <td className="px-4 py-3" colSpan={2}>
                Total
              </td>
              <td className="px-4 py-3 text-center">{data?.totalQuantity}</td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-right">
                ₱{data?.totalSales.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
