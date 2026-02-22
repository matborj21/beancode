"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { AdminSidebar } from "@/app/(admin)/dashboard/_components/AdminSidebar";
import { ProductFormModal } from "./ProductFormModal";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, PackageX } from "lucide-react";

type ProductRow = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  imageUrl: string | null;
  stock: number;
};

export function ProductsScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(
    null,
  );

  const { data: products = [], refetch } = api.product.getAll.useQuery({
    category: "All",
  });

  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => refetch(),
  });

  function handleEdit(product: (typeof products)[0]) {
    setSelectedProduct({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      categoryId: product.categoryId,
      imageUrl: product.imageUrl ?? null,
      stock: product.inventory?.stock ?? 0,
    });
    setModalOpen(true);
  }

  function handleAdd() {
    setSelectedProduct(null);
    setModalOpen(true);
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct.mutate({ id });
    }
  }

  return (
    <div className="flex h-screen bg-amber-50">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-amber-900">Products</h2>
            <p className="text-sm text-amber-500">
              {products.length} active products
            </p>
          </div>
          <Button
            onClick={handleAdd}
            className="gap-2 bg-amber-900 text-amber-50 hover:bg-amber-800"
          >
            <Plus size={16} />
            Add Product
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-100 bg-amber-50 text-left text-xs font-semibold uppercase tracking-wide text-amber-500">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-amber-300">
                      <PackageX size={36} />
                      <p>No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
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
                    <td className="px-4 py-3 text-right text-amber-700">
                      ₱{Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          (product.inventory?.stock ?? 0) <= 5
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.inventory?.stock ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                          className="h-8 w-8 text-amber-600 hover:bg-amber-100"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id, product.name)}
                          className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => refetch()}
        product={selectedProduct}
      />
    </div>
  );
}
