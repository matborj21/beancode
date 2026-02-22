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
import { toast } from "sonner";
import { ReceiptModal } from "@/app/components/pos/ReceiptModal";

const PAYMENT_METHODS = ["CASH", "GCASH", "CARD"] as const;
type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type ReceiptData = {
  orderNumber: string;
  items: { name: string; quantity: number; price: number }[];
  subTotal: number;
  vat: number;
  total: number;
  paymentMethod: string;
  createdAt: Date;
};

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
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashTendered, setCashTendered] = useState("");

  const createOrder = api.order.create.useMutation({
    onSuccess: (data) => {
      // Build receipt data before clearing cart
      setReceiptData({
        orderNumber: data.orderNumber,
        items: cartItems.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        subTotal,
        vat,
        total,
        paymentMethod,
        createdAt: new Date(),
      });
      clearCart();
      setReceiptOpen(true);
    },
    onError: (error) => {
      toast.error(error.message);
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
    toast("Void this transaction?", {
      action: {
        label: "Confirm",
        onClick: () => {
          clearCart();
          router.push("/mobile");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => null,
      },
    });
  }

  function handleReceiptClose() {
    setReceiptOpen(false);
    router.push("/mobile");
  }

  function handlePaymentMethodChange(method: PaymentMethod) {
    setPaymentMethod(method);
    setCashTendered("");
  }

  // Computed change
  const change = cashTendered
    ? Math.max(0, Number(cashTendered) - total)
    : null;

  const isInsufficientCash =
    paymentMethod === "CASH" &&
    cashTendered !== "" &&
    Number(cashTendered) < total;

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
                onClick={() => handlePaymentMethodChange(method)}
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

          {/* Cash Calculator — only show for CASH */}
          {paymentMethod === "CASH" && (
            <div className="mt-4 space-y-3">
              {/* Cash Tendered Input */}
              <div>
                <label className="mb-1 block text-xs font-medium text-amber-700">
                  Cash Tendered (₱)
                </label>
                <input
                  type="number"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  placeholder="Enter amount received"
                  min={0}
                  className={`w-full rounded-xl border px-4 py-3 text-lg font-bold outline-none transition-colors ${
                    isInsufficientCash
                      ? "border-red-400 bg-red-50 text-red-600 focus:ring-2 focus:ring-red-300"
                      : "border-amber-200 bg-amber-50 text-amber-900 focus:ring-2 focus:ring-amber-400"
                  }`}
                />
                {isInsufficientCash && (
                  <p className="mt-1 text-xs text-red-500">
                    Insufficient cash. Need ₱
                    {(total - Number(cashTendered)).toFixed(2)} more.
                  </p>
                )}
              </div>

              {/* Quick Cash Buttons */}
              <div>
                <p className="mb-2 text-xs text-amber-400">Quick amounts:</p>
                <div className="grid grid-cols-4 gap-2">
                  {[20, 50, 100, 200, 500, 1000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setCashTendered(String(amount))}
                      className={`rounded-xl py-2 text-sm font-semibold transition-colors ${
                        Number(cashTendered) === amount
                          ? "bg-amber-900 text-amber-50"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }`}
                    >
                      ₱{amount}
                    </button>
                  ))}
                  {/* Exact button */}
                  <button
                    onClick={() => setCashTendered(total.toFixed(2))}
                    className={`col-span-2 rounded-xl py-2 text-sm font-semibold transition-colors ${
                      Number(cashTendered) === Number(total.toFixed(2))
                        ? "bg-amber-900 text-amber-50"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    Exact ₱{total.toFixed(2)}
                  </button>
                </div>
              </div>

              {/* Change Display */}
              {cashTendered && !isInsufficientCash && change !== null && (
                <div className="rounded-xl bg-green-50 p-3 text-center">
                  <p className="text-xs text-green-600">Change</p>
                  <p className="text-3xl font-bold text-green-600">
                    ₱{change.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 space-y-2 border-t border-amber-100 bg-white p-4">
        <Button
          onClick={handleProcessTransaction}
          disabled={createOrder.isPending || isInsufficientCash}
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

      {/* Receipt Modal */}
      {receiptData && (
        <ReceiptModal
          open={receiptOpen}
          onClose={handleReceiptClose}
          orderNumber={receiptData.orderNumber}
          items={receiptData.items}
          subtotal={receiptData.subTotal}
          vat={receiptData.vat}
          total={receiptData.total}
          paymentMethod={receiptData.paymentMethod}
          createdAt={receiptData.createdAt}
        />
      )}
    </div>
  );
}
