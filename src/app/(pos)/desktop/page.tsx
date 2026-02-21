import { api, HydrateClient } from "@/trpc/server";
import { DesktopPOSScreen } from "./_components/DesktopPOSScreen";

export default function DesktopPage() {
  void api.product.getAll.prefetch({ category: "all" });
  void api.product.getCategories.prefetch();

  return (
    <HydrateClient>
      <DesktopPOSScreen />
    </HydrateClient>
  );
}
