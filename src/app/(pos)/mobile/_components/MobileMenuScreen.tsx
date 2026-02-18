"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { api } from "@/trpc/react";

import { ProductCard } from "@/app/components/pos/ProductCard";
import { CategoryFilter } from "@/app/components/pos/CategoryFilter";
import { BottomNav } from "@/app/components/pos/BottomNav";

export function MobileMenuScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { data: categories = [] } = api.product.getCategories.useQuery();
  const { data: products = [], isLoading } = api.product.getAll.useQuery({
    category: selectedCategory,
    search,
  });

  function handleAddToCart(id: string) {
    // Cart logic coming in Phase 2
    console.log("Add to cart:", id);
  }

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      {/* Header */}
      <div className="bg-amber-900 px-4 pb-4 pt-12 text-amber-50">
        <h1 className="mb-4 text-xl font-bold">BeanCode POS ☕</h1>
        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl bg-amber-800 px-3 py-2">
          <Search size={18} className="text-amber-400" />
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-amber-50 placeholder-amber-400 outline-none"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
        {/* Category Filter */}
        <div className="sticky top-0 z-10 mb-4 bg-amber-50 py-2">
          <CategoryFilter
            categories={categories.map((c) => c.name)}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl bg-amber-100"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={Number(product.price)}
                imageUrl={product.imageUrl ?? null}
                onAdd={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav active="/mobile" />
    </div>
  );
}
