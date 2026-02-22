import { api, HydrateClient } from "@/trpc/server";
import { ProductsScreen } from "./_components/ProductsScreen";

export default async function ProductsPage() {
  void api.product.getAll.prefetch({ category: "All" });
  void api.product.getCategories.prefetch();

  return (
    <HydrateClient>
      <ProductsScreen />
    </HydrateClient>
  );
}
