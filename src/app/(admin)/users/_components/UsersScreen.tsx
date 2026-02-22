"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { AdminSidebar } from "@/app/(admin)/dashboard/_components/AdminSidebar";
import { UserFormModal } from "./UserFormModal";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Shield, Coffee, User } from "lucide-react";

type UserRow = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  role: "CASHIER" | "BARISTA" | "ADMIN";
  createdAt: Date;
};

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-amber-900 text-amber-50",
  CASHIER: "bg-blue-100 text-blue-700",
  BARISTA: "bg-green-100 text-green-700",
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  ADMIN: <Shield size={12} />,
  CASHIER: <User size={12} />,
  BARISTA: <Coffee size={12} />,
};

export function UsersScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const { data: users = [], refetch } = api.user.getAll.useQuery();

  const deleteUser = api.user.delete.useMutation({
    onSuccess: () => {
      toast.success("User deleted.");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  function handleEdit(user: UserRow) {
    setSelectedUser({
      ...user,
      name: user.name ?? "",
    });
    setModalOpen(true);
  }

  function handleAdd() {
    setSelectedUser(null);
    setModalOpen(true);
  }

  function handleDelete(id: string, name: string | null) {
    toast(`Delete "${name ?? "this user"}"?`, {
      action: {
        label: "Delete",
        onClick: () => deleteUser.mutate({ id }),
      },
      cancel: {
        label: "Cancel",
        onClick: () => null,
      },
    });
  }

  return (
    <div className="flex h-screen bg-amber-50">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-amber-900">Users</h2>
            <p className="text-sm text-amber-500">
              {users.length} user{users.length !== 1 ? "s" : ""} registered
            </p>
          </div>
          <Button
            onClick={handleAdd}
            className="gap-2 bg-amber-900 text-amber-50 hover:bg-amber-800"
          >
            <Plus size={16} />
            Add User
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-100 bg-amber-50 text-left text-xs font-semibold uppercase tracking-wide text-amber-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 text-center">Role</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-amber-300">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-amber-50"
                  >
                    <td className="px-4 py-3 font-medium text-amber-900">
                      {user.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-amber-600">
                      @{user.username ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-amber-500">
                      {user.email ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          ROLE_STYLES[user.role] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {ROLE_ICONS[user.role]}
                        {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          className="h-8 w-8 text-amber-600 hover:bg-amber-100"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id, user.name)}
                          className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <UserFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => void refetch()}
        user={selectedUser}
      />
    </div>
  );
}
