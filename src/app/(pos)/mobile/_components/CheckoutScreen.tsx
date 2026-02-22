"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/app/components/pos/CartItem";
import { OrderSummary } from "@/app/components/pos/OrderSummary";
import { useCart } from "@/context/CartContext";
import { api } from "@/trpc/react";
import Link from "next/link";

const PAYMENT_METHODS = ["CASH", "GCASH", "CARD"] as const;
type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export function CheckoutScreen() {
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
  const [isProcessing, setIsProcessing] = useState(false);

  console.log("Cart Items:", cartItems);

  const createOrder = api.order.create.useMutation({
    onSuccess: () => {
      clearCart();
      alert("Transaction processed successfully!");
      router.push("/mobile");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  function handleIncrease(productId: string) {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;
    updateItemQuantity(productId, item.quantity + 1);
  }

  function handleDecrease(productId: string) {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;
    updateItemQuantity(productId, item.quantity - 1);
  }

  function handleProcessTransaction() {
    if (cartItems.length === 0) return;
    setIsProcessing(true);
    createOrder.mutate({
      items: cartItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
      })),
      paymentMethod,
    });
    setIsProcessing(false);
  }

  function handleVoidTransaction() {
    if (confirm("Are you sure you want to void this transaction?")) {
      clearCart();
      router.push("/mobile");
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-amber-50">
        <p className="text-amber-700">Your cart is empty.</p>
        <Button
          onClick={() => router.push("/mobile")}
          className="bg-amber-900 text-amber-50 hover:bg-amber-800"
        >
          Back to Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      {/* Header */}
      <div className="bg-amber-900 px-4 pb-4 pt-12 text-amber-50">
        <div className="flex items-center gap-3">
          <Link href="/mobile">
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-xl font-bold">Order Checkout</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4 pb-48">
        {/* Cart Items */}
        <h2 className="font-semibold text-amber-900">
          Items ({cartItems.length})
        </h2>
        {cartItems.map((item) => (
          <CartItem
            key={item.productId}
            item={item}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={removeItem}
          />
        ))}

        {/* Order Summary */}
        <OrderSummary subtotal={subTotal} vat={vat} total={total} />

        {/* Payment Method */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-semibold text-amber-900">Payment Method</h3>
          <div className="flex gap-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-colors ${
                  paymentMethod === method
                    ? "bg-amber-900 text-amber-50"
                    : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 space-y-2 border-t border-amber-100 bg-white p-4">
        <Button
          onClick={handleProcessTransaction}
          disabled={isProcessing ?? createOrder.isPending}
          className="w-full bg-amber-900 py-6 text-base font-bold text-amber-50 hover:bg-amber-800"
        >
          {createOrder.isPending ? "Processing..." : `Pay ₱${total.toFixed(2)}`}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleVoidTransaction}
            className="flex-1 border-red-200 text-red-500 hover:bg-red-50"
          >
            Void Transaction
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/mobile")}
            className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
