"use client";

import { AdminSidebar } from "./AdminSidebar";
import { SalesReport } from "./SalesReport";

export function AdminDashboard() {
  return (
    <div className="flex h-screen bg-amber-50">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-amber-900">Sales Report</h2>
          <p className="text-sm text-amber-500">All time sales summary</p>
        </div>

        <SalesReport />
      </main>
    </div>
  );
}
