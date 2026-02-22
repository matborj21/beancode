"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { AdminSidebar } from "@/app/(admin)/dashboard/_components/AdminSidebar";
import { StockEditModal } from "./StockEditModal";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, Pencil } from "lucide-react";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";

type InventoryRow = {
  productId: string;
  productName: string;
  currentStock: number;
};

export function InventoryScreen() {
  const [selectedItem, setSelectedItem] = useState<InventoryRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: inventory = [], refetch } = api.inventory.getAll.useQuery();

  const restockAll = api.inventory.restockAll.useMutation({
    onSuccess: () => {
      toast.success("All products restocked to 50!");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const lowStockItems = inventory.filter((i) => i.stock <= LOW_STOCK_THRESHOLD);

  function handleEdit(item: (typeof inventory)[0]) {
    setSelectedItem({
      productId: item.productId,
      productName: item.product.name,
      currentStock: item.stock,
    });
    setModalOpen(true);
  }

  return (
    <div className="flex h-screen bg-amber-50">
      <AdminSidebar />
      {/* Inventory screen content goes here */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-amber-900">Inventory</h2>
            <p className="text-sm text-amber-500">
              {inventory.length} products tracked
            </p>
          </div>
          <Button
            onClick={() => {
              toast("Restock all products to 50 units?", {
                action: {
                  label: "Confirm",
                  onClick: () => restockAll.mutate({ stock: 50 }),
                },
                cancel: {
                  label: "Cancel",
                  onClick: () => null,
                },
              });
            }}
            disabled={restockAll.isPending}
            variant="outline"
            className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-100"
          >
            <RefreshCw size={16} />
            Restock All
          </Button>
        </div>

        {/* Low Stock Warning */}
        {lowStockItems.length > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                {lowStockItems.length} item
                {lowStockItems.length > 1 ? "s" : ""} running low on stock
              </p>
              <p className="text-xs text-red-500">
                {lowStockItems.map((i) => i.product.name).join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-100 bg-amber-50 text-left text-xs font-semibold uppercase tracking-wide text-amber-500">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {inventory.map((item) => {
                const isLow = item.stock <= LOW_STOCK_THRESHOLD;
                const isOut = item.stock === 0;

                return (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-amber-50"
                  >
                    <td className="px-4 py-3 font-medium text-amber-900">
                      {item.product.name}
                    </td>
                    <td className="px-4 py-3 text-amber-500">
                      {item.product.category.name}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-amber-900">
                      {item.stock}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isOut
                            ? "bg-red-100 text-red-600"
                            : isLow
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {isOut
                          ? "Out of Stock"
                          : isLow
                            ? "Low Stock"
                            : "In Stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                        className="h-8 w-8 text-amber-600 hover:bg-amber-100"
                      >
                        <Pencil size={14} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      <StockEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => void refetch()}
        productId={selectedItem?.productId ?? ""}
        productName={selectedItem?.productName ?? ""}
        currentStock={selectedItem?.currentStock ?? 0}
      />
    </div>
  );
}
