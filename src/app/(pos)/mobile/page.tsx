import { api, HydrateClient } from "@/trpc/server";
import { MobileMenuScreen } from "./_components/MobileMenuScreen";

export default async function MobilePage() {
  void api.product.getAll.prefetch({ category: "All" });
  void api.product.getCategories.prefetch();

  return (
    <HydrateClient>
      <MobileMenuScreen />
    </HydrateClient>
  );
}
