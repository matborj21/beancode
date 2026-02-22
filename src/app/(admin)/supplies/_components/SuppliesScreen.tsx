"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { AdminSidebar } from "@/app/(admin)/dashboard/_components/AdminSidebar";
import { RestockModal } from "./RestockModal";
import { AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type SelectedSupply = {
  id: string;
  name: string;
  unit: string;
  stock: number;
};

const UNIT_LABELS: Record<string, string> = {
  GRAMS: "g",
  ML: "ml",
  UNITS: "pcs",
};

export function SuppliesScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedSupply | null>(null);

  const { data: supplies = [], refetch } = api.supply.getAll.useQuery();

  const lowStockSupplies = supplies.filter((s) => s.stock <= s.minStock);

  function handleRestock(supply: (typeof supplies)[0]) {
    setSelected({
      id: supply.id,
      name: supply.name,
      unit: supply.unit,
      stock: supply.stock,
    });
    setModalOpen(true);
  }

  return (
    <div className="flex h-screen bg-amber-50">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-amber-900">Supplies</h2>
            <p className="text-sm text-amber-500">
              {supplies.length} supplies tracked
            </p>
          </div>
        </div>

        {/* Low Stock Warning */}
        {lowStockSupplies.length > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                {lowStockSupplies.length} supply
                {lowStockSupplies.length > 1 ? " items are" : " is"} running low
              </p>
              <p className="text-xs text-red-500">
                {lowStockSupplies.map((s) => s.name).join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* Supplies Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {supplies.map((supply) => {
            const unitLabel = UNIT_LABELS[supply.unit] ?? supply.unit;
            const isLow = supply.stock <= supply.minStock;
            const isOut = supply.stock <= 0;
            const percentage = Math.min(
              100,
              Math.round((supply.stock / (supply.minStock * 5)) * 100),
            );

            return (
              <div
                key={supply.id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                {/* Supply Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-amber-900">{supply.name}</h3>
                    <p className="text-xs text-amber-600">
                      Min stock: {supply.minStock.toLocaleString()} {unitLabel}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      isOut
                        ? "bg-red-100 text-red-600"
                        : isLow
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {isOut ? "Out" : isLow ? "Low" : "OK"}
                  </span>
                </div>

                {/* Stock Amount */}
                <p className="mb-2 text-3xl font-bold text-amber-900">
                  {supply.stock.toLocaleString()}
                  <span className="ml-1 text-base font-normal text-amber-600">
                    {unitLabel}
                  </span>
                </p>

                {/* Progress Bar */}
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-amber-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOut
                        ? "bg-red-400"
                        : isLow
                          ? "bg-amber-400"
                          : "bg-green-400"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Used in products */}
                <p className="mb-4 text-xs text-amber-600">
                  Used in {supply.recipes.length} product
                  {supply.recipes.length !== 1 ? "s" : ""}
                </p>

                {/* Restock Button */}
                <Button
                  onClick={() => handleRestock(supply)}
                  variant="outline"
                  className="w-full gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  <Plus size={14} />
                  Restock
                </Button>
              </div>
            );
          })}
        </div>
      </main>

      <RestockModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => void refetch()}
        supplyId={selected?.id ?? ""}
        supplyName={selected?.name ?? ""}
        unit={selected?.unit ?? "UNITS"}
        currentStock={selected?.stock ?? 0}
      />
    </div>
  );
}
