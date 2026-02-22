import { api, HydrateClient } from "@/trpc/server";
import { AdminDashboard } from "./_components/AdminDashboard";

export default async function AdminPage() {
  void api.report.dailySales.prefetch({});

  return (
    <HydrateClient>
      <AdminDashboard />
    </HydrateClient>
  );
}
