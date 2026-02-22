"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/app/components/pos/ProductCard";
import { DesktopOrderPanel } from "./DesktopOrderPanel";
import { SignOutButton } from "@/components/pos/SignOutButton";

export function DesktopPOSScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addItem } = useCart();

  const { data: categories = [] } = api.product.getCategories.useQuery();
  const { data: products = [], isLoading } = api.product.getAll.useQuery({
    category: selectedCategory,
  });

  const { data: lowStockProductIds = [] } =
    api.product.getLowStockProductIds.useQuery();

  function handleAddToCart(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl ?? null,
    });
  }

  return (
    <div className="flex h-screen bg-amber-50">
      {/* Left: Category Tabs */}
      <div className="flex h-full w-48 flex-col gap-2 border-r border-amber-100 bg-white p-4">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-600">
          Categories
        </h2>
        <div className="mt-4 flex flex-1 flex-col gap-2 overflow-y-auto">
          {["All", ...categories.map((c) => c.name)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                selectedCategory === cat
                  ? "bg-amber-900 text-amber-50"
                  : "text-amber-800 hover:bg-amber-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <SignOutButton variant="full" />
      </div>

      {/* Center: Product Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-900">BeanCode POS ☕</h1>
          <p className="text-sm text-amber-500">
            {new Date().toLocaleDateString("en-PH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-4 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-52 animate-pulse rounded-2xl bg-amber-100"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={Number(product.price)}
                imageUrl={product.imageUrl ?? null}
                onAdd={handleAddToCart}
                isLowStock={lowStockProductIds.includes(product.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: Order Summary Panel */}
      <DesktopOrderPanel />
    </div>
  );
}
