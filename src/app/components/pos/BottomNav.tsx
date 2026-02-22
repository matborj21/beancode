"use client";

import Link from "next/link";
import { Home, History, ShoppingCart, User } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { SignOutButton } from "@/components/pos/SignOutButton";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: Home, href: "/mobile" },
  { label: "History", icon: History, href: "/mobile/history" },
  { label: "Transaction", icon: ShoppingCart, href: "/mobile/checkout" },
];

type Props = {
  active: string;
};

export function BottomNav({ active }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-amber-100 bg-white px-4">
      <div className="flex justify-around py-2">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const isActive = active === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-2 ${
                isActive ? "text-amber-900" : "text-amber-600"
              }`}
            >
              <Icon size={22} />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
        {/* Sign Out replaces Profile tab */}
        <SignOutButton variant="icon" />
      </div>
    </nav>
  );
}
