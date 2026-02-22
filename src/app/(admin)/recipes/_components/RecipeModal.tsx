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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
};

const UNIT_LABELS: Record<string, string> = {
  GRAMS: "g",
  ML: "ml",
  UNITS: "pcs",
};

export function RecipeModal({ open, onClose, productId, productName }: Props) {
  const [supplyId, setSupplyId] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{ supplyId?: string; amount?: string }>(
    {},
  );

  const { data: recipes = [], refetch } = api.recipe.getByProduct.useQuery(
    { productId },
    { enabled: open && !!productId },
  );

  const { data: supplies = [] } = api.supply.getAll.useQuery();

  const upsertRecipe = api.recipe.upsert.useMutation({
    onSuccess: () => {
      toast.success("Ingredient saved!");
      setSupplyId("");
      setAmount("");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteRecipe = api.recipe.delete.useMutation({
    onSuccess: () => {
      toast.success("Ingredient removed!");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  useEffect(() => {
    setSupplyId("");
    setAmount("");
    setErrors({});
  }, [open]);

  // Filter out supplies already in the recipe
  const availableSupplies = supplies.filter(
    (s) => !recipes.some((r) => r.supplyId === s.id),
  );

  function handleAdd() {
    const newErrors: { supplyId?: string; amount?: string } = {};
    if (!supplyId) newErrors.supplyId = "Select a supply.";
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      newErrors.amount = "Enter a valid amount.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    upsertRecipe.mutate({
      productId,
      supplyId,
      amount: Number(amount),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-amber-900">
            Recipe — {productName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Ingredients */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-amber-500">
              Current Ingredients
            </p>
            {recipes.length === 0 ? (
              <p className="rounded-xl bg-amber-50 py-4 text-center text-sm text-amber-400">
                No ingredients set yet
              </p>
            ) : (
              <div className="space-y-2">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        {recipe.supply.name}
                      </p>
                      <p className="text-xs text-amber-500">
                        {recipe.amount}{" "}
                        {UNIT_LABELS[recipe.supply.unit] ?? recipe.supply.unit}{" "}
                        per serving
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        toast(`Remove ${recipe.supply.name}?`, {
                          action: {
                            label: "Remove",
                            onClick: () =>
                              deleteRecipe.mutate({
                                productId,
                                supplyId: recipe.supplyId,
                              }),
                          },
                          cancel: {
                            label: "Cancel",
                            onClick: () => null,
                          },
                        })
                      }
                      className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Ingredient */}
          {availableSupplies.length > 0 && (
            <div className="rounded-xl border border-amber-100 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-amber-500">
                Add Ingredient
              </p>
              <div className="flex gap-2">
                {/* Supply Select */}
                <div className="flex-1">
                  <Select
                    value={supplyId}
                    onValueChange={(val) => {
                      setSupplyId(val);
                      setErrors((p) => ({ ...p, supplyId: undefined }));
                    }}
                  >
                    <SelectTrigger
                      className={errors.supplyId ? "border-red-400" : ""}
                    >
                      <SelectValue placeholder="Select supply" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {availableSupplies.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} ({UNIT_LABELS[s.unit] ?? s.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.supplyId && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.supplyId}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div className="w-28">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setErrors((p) => ({ ...p, amount: undefined }));
                    }}
                    placeholder="Amount"
                    min={0}
                    className={errors.amount ? "border-red-400" : ""}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
                  )}
                </div>

                {/* Add Button */}
                <Button
                  onClick={handleAdd}
                  disabled={upsertRecipe.isPending}
                  className="bg-amber-900 text-amber-50 hover:bg-amber-800"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-amber-200 text-amber-700"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
