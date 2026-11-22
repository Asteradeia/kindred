"use client";

import { useState } from "react";
import type { ProductVariation } from "@/app/data/marketplace";

export default function ProductVariations({
  variations,
  onSelectionChange,
}: {
  variations: ProductVariation[];
  onSelectionChange: (selections: Record<string, string>) => void;
}) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const handleSelection = (variationName: string, option: string) => {
    const updatedSelections = {
      ...selectedOptions,
      [variationName]: option,
    };

    setSelectedOptions(updatedSelections);
    onSelectionChange(updatedSelections);
  };

  return (
    <div className="mt-6 space-y-5">
      {variations.map((variation) => (
        <div key={variation.name}>
          <p className="mb-2 text-sm font-medium text-[#59406f]">
            {variation.name}
          </p>

          <div className="flex flex-wrap gap-2">
            {variation.options.map((option) => {
              const isSelected = selectedOptions[variation.name] === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelection(variation.name, option)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    isSelected
                      ? "border-[#75558c] bg-[#75558c] text-white"
                      : "border-[#e5dce9] bg-white text-[#59406f] hover:border-[#9277a8] hover:bg-[#eee8f2]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}