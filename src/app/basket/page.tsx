"use client";

import Link from "next/link";
import { useBasket } from "../data/BasketContext";

export default function BasketPage() {
  const { items, removeFromBasket, updateQuantity } = useBasket();

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#46394f]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/archive"
          className="text-sm text-[#9277a8] transition hover:text-[#59406f]"
        >
          ← Continue shopping
        </Link>

        <h1 className="mt-6 font-serif text-4xl text-[#59406f]">
          Your basket
        </h1>

        <p className="mt-2 text-[#827a89]">
          Your little collection of creations.
        </p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-[#e5dce9] bg-white p-10 text-center">
            <h2 className="font-serif text-2xl text-[#59406f]">
              Your basket is empty
            </h2>

            <p className="mt-3 text-sm text-[#827a89]">
              You haven't found anything to take home just yet.
            </p>

            <Link
              href="/archive"
              className="mt-6 inline-block rounded-full bg-[#75558c] px-6 py-3 text-sm text-white transition hover:bg-[#59406f]"
            >
              Explore marketplace
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="flex gap-4 rounded-2xl border border-[#e5dce9] bg-white p-4"
                >
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#eee8f2]">
                    {item.product.images[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-lg text-[#59406f]">
                      {item.product.title}
                    </h2>

                    <p className="mt-1 text-sm text-[#827a89]">
                      by {item.product.creator}
                    </p>

                    {Object.entries(item.selectedVariations).map(
                      ([name, value]) => (
                        <p key={name} className="mt-1 text-xs text-[#9277a8]">
                          {name}: {value}
                        </p>
                      )
                    )}

                    <div className="mt-3 flex w-fit items-center rounded-full border border-[#e5dce9] bg-white">
  <button
    type="button"
    onClick={() => updateQuantity(index, item.quantity - 1)}
    disabled={item.quantity <= 1}
    className="px-4 py-2 text-[#75558c] transition hover:bg-[#eee8f2] disabled:opacity-40"
  >
    −
  </button>

  <span className="min-w-10 text-center text-sm text-[#59406f]">
    {item.quantity}
  </span>

  <button
    type="button"
    onClick={() =>
      updateQuantity(
        index,
        Math.min(
          item.quantity + 1,
          item.product.type === "Pre-order"
            ? (item.product.preOrderLimit ?? 0) -
                (item.product.preOrdersReserved ?? 0)
            : item.product.type === "Digital"
              ? 99
              : item.product.quantityAvailable
        )
      )
    }
    disabled={
      item.quantity >=
      (item.product.type === "Pre-order"
        ? (item.product.preOrderLimit ?? 0) -
            (item.product.preOrdersReserved ?? 0)
        : item.product.type === "Digital"
          ? 99
          : item.product.quantityAvailable)
    }
    className="px-4 py-2 text-[#75558c] transition hover:bg-[#eee8f2] disabled:opacity-40"
  >
    +
  </button>
</div>

                    <p className="mt-2 font-medium text-[#75558c]">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
  type="button"
  onClick={() => removeFromBasket(index)}
  className="mt-3 text-sm text-[#9277a8] transition hover:text-red-600"
>
  Remove
</button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-[#e5dce9] bg-white p-6">
              <h2 className="font-serif text-2xl text-[#59406f]">
                Order summary
              </h2>

              <div className="mt-5 flex justify-between text-sm text-[#827a89]">
                <span>Items ({items.reduce((total, item) => total + item.quantity, 0)})</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>

              <div className="mt-4 border-t border-[#e5dce9] pt-4">
                <div className="flex justify-between font-medium text-[#59406f]">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                disabled
                className="mt-6 w-full rounded-full bg-[#75558c] px-5 py-3 text-sm text-white opacity-50"
              >
                Checkout (Coming soon)
              </button>

              <p className="mt-3 text-center text-xs text-[#9277a8]">
                Shipping will be calculated at checkout.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}