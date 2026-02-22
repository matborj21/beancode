"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  variant?: "icon" | "full";
};

export function SignOutButton({ variant = "full" }: Props) {
  async function handleSignOut() {
    await signOut({ callbackUrl: "/login" });
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleSignOut}
        className="flex flex-col items-center gap-1 px-3 py-2 text-amber-600 hover:text-red-400"
      >
        <LogOut size={22} />
        <span className="text-xs">Sign Out</span>
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
      className="w-full justify-start gap-2 text-red-400 hover:bg-red-50 hover:text-red-600"
    >
      <LogOut size={16} />
      Sign Out
    </Button>
  );
}
