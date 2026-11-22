"use client";

import { useState } from "react";
import type { MarketplaceProduct } from "@/app/data/marketplace";
import { useBasket } from "@/app/data/BasketContext";

export default function ProductPurchaseControls({
  product,
  selectedVariations,
}: {
  product: MarketplaceProduct;
  selectedVariations: Record<string, string>;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [variationError, setVariationError] = useState("");
  const { addToBasket } = useBasket();

  const maxQuantity =
    product.type === "Pre-order"
      ? (product.preOrderLimit ?? 0) - (product.preOrdersReserved ?? 0)
      : product.type === "Digital"
        ? 99
        : product.quantityAvailable;

  const handleAddToBasket = () => {
    addToBasket({
  product,
  quantity,
  selectedVariations,
});

    setAdded(true);
  };

  return (
    <div className="mt-6">
      <p className="mb-2 text-sm font-medium text-[#59406f]">
        Quantity
      </p>

      <div className="flex w-fit items-center rounded-full border border-[#e5dce9] bg-white">
        <button
          type="button"
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          disabled={quantity <= 1}
          className="px-4 py-2 text-[#75558c] transition hover:bg-[#eee8f2] disabled:opacity-40"
        >
          −
        </button>

        <span className="min-w-10 text-center text-sm text-[#59406f]">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() =>
            setQuantity((current) => Math.min(maxQuantity, current + 1))
          }
          disabled={quantity >= maxQuantity}
          className="px-4 py-2 text-[#75558c] transition hover:bg-[#eee8f2] disabled:opacity-40"
        >
          +
        </button>
      </div>

      {maxQuantity <= 0 && (
        <p className="mt-2 text-xs text-[#9277a8]">
          Currently unavailable
        </p>
      )}

      <button
        type="button"
        onClick={handleAddToBasket}
        disabled={maxQuantity <= 0}
        className="mt-6 block w-full rounded-full bg-[#75558c] px-5 py-3 text-center text-sm text-white transition hover:bg-[#59406f] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {added ? "Added to basket ✓" : "Add to basket"}
      </button>
    </div>
  );
}