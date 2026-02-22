"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ORDER_NUMBER, PAYMENT_METHODS } from "@/lib/constants";
import { api } from "@/trpc/react";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useRouter } from "next/dist/client/components/navigation";
import { useState } from "react";

type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export function DesktopOrderPanel() {
  const router = useRouter();
  const {
    cartItems,
    updateItemQuantity,
    removeItem,
    clearCart,
    subTotal,
    vat,
    total,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");

  const createOrder = api.order.create.useMutation({
    onSuccess: () => {
      clearCart();
      alert("Transaction processed successfully!");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  function handleIncrease(productId: string) {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;
    if (item.quantity >= 99) return; // Max quantity limit
    updateItemQuantity(productId, item.quantity + 1);
  }

  function handleDecrease(productId: string) {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;
    if (item.quantity === 1) {
      removeItem(productId);
    } else {
      updateItemQuantity(productId, item.quantity - 1);
    }
  }

  return (
    <div className="flex w-80 flex-col border-amber-100 bg-white xl:w-96">
      {/* Header */}
      <div className="border-b border-amber-100 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-amber-900">Current Order</h2>
          <span className="text-sm text-amber-700">{ORDER_NUMBER}</span>
        </div>
        <p className="text-xs text-amber-600">
          {new Date().toLocaleDateString("en-PH", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto p-4">
        {cartItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-amber-300">
            <p className="text-4xl">🛒</p>
            <p className="text-sm">No items yet</p>
            <p className="text-xs">Click products to add</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-2 rounded-xl bg-amber-50 p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-amber-500">
                    ₱{item.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 rounded-full border-amber-200"
                    onClick={() => handleDecrease(item.productId)}
                  >
                    <Minus size={10} />
                  </Button>
                  <span className="w-5 text-center text-sm font-bold text-amber-900">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 rounded-full border-amber-200"
                    onClick={() => handleIncrease(item.productId)}
                  >
                    <Plus size={10} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-400 hover:text-red-600"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Summary + Actions */}
      <div className="space-y-3 border-t border-amber-100 p-4">
        {/* Totals */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-amber-600">
            <span>Subtotal</span>
            <span>₱{subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-amber-600">
            <span>VAT (12%)</span>
            <span>₱{vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-amber-900">
            <span>Total</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex gap-2">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-colors ${
                paymentMethod === method
                  ? "bg-amber-900 text-amber-50"
                  : "bg-amber-100 text-amber-900 hover:bg-amber-200"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Process Button */}
        <Button
          onClick={() =>
            createOrder.mutate({
              items: cartItems.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                price: i.price,
              })),
              paymentMethod,
            })
          }
          disabled={cartItems.length === 0 || createOrder.isPending}
          className="w-full bg-amber-900 py-6 text-base font-bold text-amber-50 hover:bg-amber-800"
        >
          {createOrder.isPending
            ? "Processing..."
            : `Process Order ₱${total.toFixed(2)}`}
        </Button>

        {/* Void */}
        <Button
          variant="outline"
          onClick={() => {
            if (confirm("Void this transaction?")) clearCart();
          }}
          disabled={cartItems.length === 0 || createOrder.isPending}
          className="w-full border-red-200 text-red-500 hover:bg-red-50"
        >
          Void Transaction
        </Button>
      </div>
    </div>
  );
}
