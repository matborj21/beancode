"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type CartItem as CartItemType } from "@/context/CartContext";

type Props = {
  item: CartItemType;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
};

export function CartItem({ item, onIncrease, onDecrease, onRemove }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
      <div className="flex-1">
        <p className="text-sm font-semibold text-amber-900">{item.name}</p>
        <p className="text-xs text-amber-600">
          ₱{(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full border-amber-200"
          onClick={() => onDecrease(item.productId)}
        >
          <Minus size={12} />
        </Button>
        <span className="w-5 text-center text-sm font-semibold text-amber-900">
          {item.quantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full border-amber-200"
          onClick={() => onIncrease(item.productId)}
        >
          <Plus size={12} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-400 hover:text-red-600"
          onClick={() => onRemove(item.productId)}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
