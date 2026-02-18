"use client";

import { Home, History, ShoppingCart, User } from "lucide-react";
import { type LucideIcon } from "lucide-react";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: Home, href: "/mobile" },
  { label: "History", icon: History, href: "/mobile/history" },
  { label: "Transaction", icon: ShoppingCart, href: "/mobile/checkout" },
  { label: "Profile", icon: User, href: "/mobile/profile" },
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
            <a
              key={label}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-2 ${
                isActive ? "text-amber-900" : "text-amber-400"
              }`}
            >
              <Icon size={22} />
              <span className="text-xs">{label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
