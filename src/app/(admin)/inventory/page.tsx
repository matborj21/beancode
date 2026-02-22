import { api, HydrateClient } from "@/trpc/server";
import { InventoryScreen } from "./_components/InventoryScreen";

export default function InventoryPage() {
  void api.inventory.getAll.prefetch();
  return (
    <HydrateClient>
      <InventoryScreen />
    </HydrateClient>
  );
}
