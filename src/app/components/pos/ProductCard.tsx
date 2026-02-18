"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  onAdd: (productId: string) => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  imageUrl,
  onAdd,
}) => {
  return (
    <Button onClick={() => onAdd(id)}>
      <div className="relative h-40 w-full overflow-hidden rounded-md bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            ☕
          </div>
        )}
      </div>
      <div className="p-3 text-left">
        <p className="text-sm font-semibold text-amber-900">{name}</p>
        <p className="text-xs text-amber-600">₱{price.toFixed(2)}</p>
      </div>
    </Button>
  );
};
