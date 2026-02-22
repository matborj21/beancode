import { api, HydrateClient } from "@/trpc/server";
import { SuppliesScreen } from "./_components/SuppliesScreen";

export default async function SuppliesPage() {
  void api.supply.getAll.prefetch();

  return (
    <HydrateClient>
      <SuppliesScreen />
    </HydrateClient>
  );
}
