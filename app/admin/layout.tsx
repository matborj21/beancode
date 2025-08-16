import type { ReactNode } from "react";
import AppSidebar from "@/components/admin/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">
        {children}
      </main>
    </SidebarProvider>
  );
}
