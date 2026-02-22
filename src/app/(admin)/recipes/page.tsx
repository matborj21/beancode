import { api, HydrateClient } from "@/trpc/server";
import { RecipesScreen } from "./_components/RecipesScreen";

export default async function RecipesPage() {
  void api.product.getAll.prefetch({ category: "All" });
  void api.supply.getAll.prefetch();

  return (
    <HydrateClient>
      <RecipesScreen />
    </HydrateClient>
  );
}
