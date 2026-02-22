"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Boxes,
} from "lucide-react";
import { SignOutButton } from "@/components/pos/SignOutButton";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Products", icon: Package, href: "/admin/products" },
  { label: "Sales", icon: ShoppingBag, href: "/admin/sales" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Supplies", icon: Boxes, href: "/admin/supplies" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 flex-col border-r border-amber-100 bg-white">
      {/* Logo */}
      <div className="border-b border-amber-100 p-6">
        <h1 className="text-lg font-bold text-amber-900">BeanCode</h1>
        <p className="text-xs text-amber-400">Admin Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-900 text-amber-50"
                  : "text-amber-700 hover:bg-amber-100"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-2 border-t border-amber-100 p-4">
        <Link
          href="/desktop"
          className="flex items-center gap-2 text-xs text-amber-400 hover:text-amber-700"
        >
          ← Back to POS
        </Link>
        <SignOutButton variant="full" />
      </div>
    </aside>
  );
}
