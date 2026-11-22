"use client";

import { useState } from "react";
import type { MarketplaceProduct } from "@/app/data/marketplace";
import ProductVariations from "./ProductVariations";
import ProductPurchaseControls from "./ProductPurchaseControls";

export default function ProductConfiguration({
  product,
}: {
  product: MarketplaceProduct;
}) {
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, string>
  >({});

  return (
    <>
      {product.variations && product.variations.length > 0 && (
        <ProductVariations
          variations={product.variations}
          onSelectionChange={setSelectedVariations}
        />
      )}

      <ProductPurchaseControls
        product={product}
        selectedVariations={selectedVariations}
      />
    </>
  );
}