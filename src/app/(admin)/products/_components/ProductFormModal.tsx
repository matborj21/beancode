"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
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
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  imageUrl: string | null;
  stock: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
};

type FormErrors = {
  name?: string;
  price?: string;
  categoryId?: string;
  stock?: string;
};

export function ProductFormModal({ open, onClose, onSuccess, product }: Props) {
  const isEdit = !!product;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState("0");
  const [errors, setErrors] = useState<FormErrors>({});

  const { data: categories = [] } = api.product.getCategories.useQuery();

  const createProduct = api.product.create.useMutation({
    onSuccess: () => {
      toast.success("Product added successfully!");
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateProduct = api.product.update.useMutation({
    onSuccess: () => {
      toast.success("Product updated successfully!");
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(String(product.price));
      setCategoryId(product.categoryId);
      setImageUrl(product.imageUrl ?? "");
      setStock(String(product.stock));
    } else {
      setName("");
      setPrice("");
      setCategoryId("");
      setImageUrl("");
      setStock("0");
    }
    setErrors({});
  }, [product, open]);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Product name is required.";
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Enter a valid price greater than 0.";
    }

    if (!categoryId) {
      newErrors.categoryId = "Please select a category.";
    }

    if (stock === "" || isNaN(Number(stock)) || Number(stock) < 0) {
      newErrors.stock = "Stock must be 0 or more.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    if (isEdit && product) {
      updateProduct.mutate({
        id: product.id,
        name,
        price: Number(price),
        categoryId,
        imageUrl: imageUrl || undefined,
        stock: Number(stock),
      });
    } else {
      createProduct.mutate({
        name,
        price: Number(price),
        categoryId,
        imageUrl: imageUrl || undefined,
        stock: Number(stock),
      });
    }
  }

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-900">
            {isEdit ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-amber-700">
              Product Name
            </label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name)
                  setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g. Espresso"
              className={errors.name ? "border-red-400 focus:ring-red-400" : ""}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="mb-1 block text-xs font-medium text-amber-700">
              Price (₱)
            </label>
            <Input
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (errors.price)
                  setErrors((prev) => ({ ...prev, price: undefined }));
              }}
              placeholder="e.g. 90"
              min={0}
              className={
                errors.price ? "border-red-400 focus:ring-red-400" : ""
              }
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-500">{errors.price}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-xs font-medium text-amber-700">
              Category
            </label>
            <Select
              value={categoryId}
              onValueChange={(value: string) => {
                setCategoryId(value);
                if (errors.categoryId)
                  setErrors((prev) => ({ ...prev, categoryId: undefined }));
              }}
            >
              <SelectTrigger
                className={
                  errors.categoryId ? "border-red-400 focus:ring-red-400" : ""
                }
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="mb-1 block text-xs font-medium text-amber-700">
              Image URL{" "}
              <span className="font-normal text-amber-400">(optional)</span>
            </label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Stock */}
          <div>
            <label className="mb-1 block text-xs font-medium text-amber-700">
              Stock
            </label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => {
                setStock(e.target.value);
                if (errors.stock)
                  setErrors((prev) => ({ ...prev, stock: undefined }));
              }}
              placeholder="0"
              min={0}
              className={
                errors.stock ? "border-red-400 focus:ring-red-400" : ""
              }
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-red-500">{errors.stock}</p>
            )}
          </div>

          {/* Actions */}
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
              disabled={isPending}
              className="flex-1 bg-amber-900 text-amber-50 hover:bg-amber-800"
            >
              {isPending
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Add Product"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
