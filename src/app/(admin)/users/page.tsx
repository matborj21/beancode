import { api, HydrateClient } from "@/trpc/server";
import { UsersScreen } from "./_components/UsersScreen";

export default async function UsersPage() {
  void api.user.getAll.prefetch();

  return (
    <HydrateClient>
      <UsersScreen />
    </HydrateClient>
  );
}
