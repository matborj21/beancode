"use client";

import { Button } from "@/components/ui/button";

type CategoryFilterProps = {
  categories: string[];
  selected: string | null;
  onSelect: (category: string) => void;
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  onSelect,
}) => {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
      {["All", ...categories].map((category) => (
        <Button
          key={category}
          className={`rounded-full border px-4 py-2 ${
            selected === category
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-accent-foreground"
          }`}
          onClick={() => onSelect(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};
