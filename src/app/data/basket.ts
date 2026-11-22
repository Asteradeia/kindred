import type { MarketplaceProduct } from "./marketplace";

export interface BasketItem {
  product: MarketplaceProduct;
  quantity: number;
  selectedVariations: Record<string, string>;
}

export interface Basket {
  items: BasketItem[];
}