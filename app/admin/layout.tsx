import type { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">
        {children}
      </main>
    </div>
  );
}
