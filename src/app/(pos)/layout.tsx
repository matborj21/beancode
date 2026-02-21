import { CartProvider } from "@/context/CartContext";
import type { ReactNode } from "react";

export default function POSLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CartProvider>{children}</CartProvider>;
}
