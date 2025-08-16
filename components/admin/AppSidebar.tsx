"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  ChevronDown,
  ChevronRight,
  Settings,
} from "lucide-react";

export default function AppSidebar() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const pathname = usePathname();

  // Utility function for active links
  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;
    return `flex text-primary items-center gap-2 p-2 rounded-lg transition-colors ${
      isActive
        ? "bg-primary text-primary-foreground"
        : "hover:muted-foreground text-primary-foreground"
    }`;
  };

  return (
    <aside className="w-64 bg-sidebar text-primary flex flex-col">
      {/* Header */}
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Admin Panel
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/admin" className={getLinkClasses("/admin")}>
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        {/* Collapsible Products Menu */}
        <div>
          <button
            onClick={() => setIsProductsOpen(!isProductsOpen)}
            className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors ${
              pathname.startsWith("/admin/products")
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <span>Products</span>
            </div>
            {isProductsOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isProductsOpen && (
            <div className="ml-6 mt-1 space-y-1">
              <Link
                href="/admin/products"
                className={getLinkClasses("/admin/products")}
              >
                All Products
              </Link>
              <Link
                href="/admin/products/add"
                className={getLinkClasses("/admin/products/add")}
              >
                Add Product
              </Link>
            </div>
          )}
        </div>

        <Link href="/admin/users" className={getLinkClasses("/admin/users")}>
          <Users className="h-5 w-5" />
          <span>Users</span>
        </Link>

        <Link
          href="/admin/settings"
          className={getLinkClasses("/admin/settings")}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
}
