import { api, HydrateClient } from "@/trpc/server";
import { HistoryScreen } from "./_components/HistoryScreen";

export default function HistoryPage() {
  void api.order.list.prefetch({});
  return (
    <HydrateClient>
      <HistoryScreen />
    </HydrateClient>
  );
}
