"use client";

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
    <button
      onClick={() => onAdd(id)}
      className="flex w-full flex-col overflow-hidden rounded-2xl bg-secondary shadow-sm transition-transform hover:shadow-md active:scale-95"
    >
      <div className="relative h-32 w-full overflow-hidden bg-muted">
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
      <div className="w-full p-3 text-left">
        <p className="text-sm font-semibold text-amber-900">{name}</p>
        <p className="text-xs text-amber-600">₱{price.toFixed(2)}</p>
      </div>
    </button>
  );
};
