"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { AdminSidebar } from "@/app/(admin)/dashboard/_components/AdminSidebar";
import { RecipeModal } from "./RecipeModal";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";

type SelectedProduct = {
  id: string;
  name: string;
};

export function RecipesScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedProduct | null>(null);

  const { data: products = [] } = api.product.getAll.useQuery({
    category: "All",
  });

  function handleManage(product: (typeof products)[0]) {
    setSelected({ id: product.id, name: product.name });
    setModalOpen(true);
  }

  return (
    <div className="flex h-screen bg-amber-50">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-amber-900">
            Recipe Management
          </h2>
          <p className="text-sm text-amber-500">
            Set supply ingredients per product
          </p>
        </div>

        {/* Products Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-100 bg-amber-50 text-left text-xs font-semibold uppercase tracking-wide text-amber-500">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-center">Ingredients</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-amber-50"
                >
                  <td className="px-4 py-3 font-medium text-amber-900">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-amber-500">
                    {product.category.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        (product.recipes?.length ?? 0) > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {product.recipes?.length ?? 0} ingredient
                      {(product.recipes?.length ?? 0) !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleManage(product)}
                      className="gap-2 text-amber-700 hover:bg-amber-100"
                    >
                      <ChefHat size={14} />
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {selected && (
        <RecipeModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          productId={selected.id}
          productName={selected.name}
        />
      )}
    </div>
  );
}
