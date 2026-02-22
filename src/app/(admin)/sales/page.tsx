import { api, HydrateClient } from "@/trpc/server";
import { SalesScreen } from "./_components/SalesScreen";

export default async function SalesPage() {
  void api.order.list.prefetch({});

  return (
    <HydrateClient>
      <SalesScreen />
    </HydrateClient>
  );
}
