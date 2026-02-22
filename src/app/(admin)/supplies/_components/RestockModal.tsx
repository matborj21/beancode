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
  supplyId: string;
  supplyName: string;
  unit: string;
  currentStock: number;
};

const UNIT_LABELS: Record<string, string> = {
  GRAMS: "g",
  ML: "ml",
  UNITS: "pcs",
};

const QUICK_AMOUNTS: Record<string, number[]> = {
  GRAMS: [250, 500, 1000, 2000],
  ML: [250, 500, 1000, 2000],
  UNITS: [50, 100, 200, 500],
};

export function RestockModal({
  open,
  onClose,
  onSuccess,
  supplyId,
  supplyName,
  unit,
  currentStock,
}: Props) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAmount("");
    setError("");
  }, [open]);

  const restock = api.supply.restock.useMutation({
    onSuccess: () => {
      toast.success(`${supplyName} restocked successfully!`);
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  function handleSubmit() {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }
    restock.mutate({ id: supplyId, amount: Number(amount) });
  }

  const unitLabel = UNIT_LABELS[unit] ?? unit;
  const quickAmounts = QUICK_AMOUNTS[unit] ?? [10, 25, 50, 100];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-amber-900">
            Restock {supplyName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-xs text-amber-500">Current Stock</p>
            <p className="text-xl font-bold text-amber-900">
              {currentStock.toLocaleString()} {unitLabel}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-amber-700">
              Add Amount ({unitLabel})
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              placeholder={`e.g. 1000`}
              min={0}
              className={error ? "border-red-400" : ""}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
              <p className="mt-1 text-xs text-amber-500">
                New total: {(currentStock + Number(amount)).toLocaleString()}{" "}
                {unitLabel}
              </p>
            )}
          </div>

          {/* Quick amounts */}
          <div>
            <p className="mb-2 text-xs text-amber-600">Quick add:</p>
            <div className="flex gap-2">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(String(val))}
                  className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-200"
                >
                  +{val}
                  {unitLabel}
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
              disabled={restock.isPending}
              className="flex-1 bg-amber-900 text-amber-50 hover:bg-amber-800"
            >
              {restock.isPending ? "Restocking..." : "Restock"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
