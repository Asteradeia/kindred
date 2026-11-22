"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { BasketItem } from "./basket";

interface BasketContextType {
  items: BasketItem[];
  addToBasket: (item: BasketItem) => void;
  removeFromBasket: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load saved basket when the app starts
  useEffect(() => {
    try {
      const savedBasket = localStorage.getItem("kindred-basket");

      if (savedBasket) {
        setItems(JSON.parse(savedBasket));
      }
    } catch (error) {
      console.error("Failed to load basket:", error);
    }

    setHydrated(true);
  }, []);

  // Save basket whenever it changes
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem("kindred-basket", JSON.stringify(items));
  }, [items, hydrated]);

  const addToBasket = (item: BasketItem) => {
    setItems((current) => [...current, item]);
  };
const removeFromBasket = (index: number) => {
  setItems((current) => current.filter((_, i) => i !== index));
};
  const updateQuantity = (index: number, quantity: number) => {
    setItems((current) =>
      current.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };
  return (
    <BasketContext.Provider
      value={{ items, addToBasket, removeFromBasket, updateQuantity }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);

  if (!context) {
    throw new Error("useBasket must be used within a BasketProvider");
  }

  return context;
}