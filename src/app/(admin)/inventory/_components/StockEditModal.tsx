"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId: string;
  productName: string;
  currentStock: number;
};

export function StockEditModal({
  open,
  onClose,
  onSuccess,
  productId,
  productName,
  currentStock,
}: Props) {
  const [stock, setStock] = useState(String(currentStock));
  const [error, setError] = useState("");

  useEffect(() => {
    setStock(String(currentStock));
    setError("");
  }, [currentStock, open]);

  const updateStock = api.inventory.updateStock.useMutation({
    onSuccess: () => {
      toast.success(`Stock updated for ${productName}!`);
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  function handleSubmit() {
    if (stock === "" || isNaN(Number(stock)) || Number(stock) < 0) {
      setError("Stock must be 0 or more.");
      return;
    }
    updateStock.mutate({
      productId,
      stock: Number(stock),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-amber-900">Update Stock</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-amber-600">
              Product: <span className="font-semibold">{productName}</span>
            </p>
            <p className="text-xs text-amber-600">
              Current stock: {currentStock} units
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-amber-700">
              New Stock Amount
            </label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => {
                setStock(e.target.value);
                setError("");
              }}
              min={0}
              className={error ? "border-red-400" : ""}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          {/* Quick set buttons */}
          <div>
            <p className="mb-2 text-xs text-amber-600">Quick set:</p>
            <div className="flex gap-2">
              {[10, 25, 50, 100].map((val) => (
                <button
                  key={val}
                  onClick={() => setStock(String(val))}
                  className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-200"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-amber-200 text-amber-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={updateStock.isPending}
              className="flex-1 bg-amber-900 text-amber-50 hover:bg-amber-800"
            >
              {updateStock.isPending ? "Saving..." : "Update Stock"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
