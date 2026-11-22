"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  marketplaceProducts,
  productTypes,
  type MarketplaceProduct,
} from "@/app/data/marketplace";

type SortOption =
  | "featured"
  | "price-low"
  | "price-high"
  | "release-date";

function ProductCard({ product }: { product: MarketplaceProduct }) {
  const [imageIndex, setImageIndex] = useState(0);
  const detailHref = `/archive/${product.id}`;
  const hasMultipleImages = product.images.length > 1;

  const moveImage = (offset: number) => {
    setImageIndex(
      (current) => (current + offset + product.images.length) % product.images.length
    );
  };

  return (
    <article className="rounded-2xl border border-[#e5dce9] bg-white p-6 transition hover:shadow-md">
      <div className="relative mb-4 h-48 overflow-hidden rounded-xl bg-[#eee8f2]">
        {product.images.length > 0 ? (
          <Link href={detailHref} className="block h-full w-full">
            <img
              src={product.images[imageIndex]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </Link>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#9277a8]">
            Image coming soon
          </div>
        )}

        {hasMultipleImages && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => moveImage(-1)}
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#59406f] shadow"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => moveImage(1)}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#59406f] shadow"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  aria-label={`Show image ${index + 1}`}
                  onClick={() => setImageIndex(index)}
                  className={`h-2 rounded-full shadow ${
                    index === imageIndex ? "w-5 bg-white" : "w-2 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="rounded-full bg-[#eee8f2] px-3 py-1 text-xs text-[#75558c]">
          {product.type}
        </span>
        {product.featured && (
          <span className="text-xs text-[#9277a8]">Featured</span>
        )}
      </div>

      <h3 className="font-serif text-xl text-[#59406f]">
        <Link href={detailHref} className="hover:underline">
          {product.title}
        </Link>
      </h3>

      <Link
        href={`/u/${product.username}`}
        className="mt-1 block text-sm text-[#9277a8] hover:text-[#59406f]"
      >
        by {product.creator}
      </Link>

      <p className="mt-3 text-sm leading-relaxed text-[#63596b]">
        {product.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-medium text-[#59406f]">
          €{product.price.toFixed(2)}
        </span>
        <span className="text-xs text-[#9277a8]">{product.category}</span>
      </div>

      {product.type === "Pre-order" && product.releaseDate && (
        <p className="mt-3 text-sm text-[#75558c]">
          Release date:{" "}
          {new Date(product.releaseDate).toLocaleDateString("en-IE")}
        </p>
      )}

      {product.type === "Made to Order" && product.turnaround && (
        <p className="mt-3 text-sm text-[#75558c]">
          Made in: {product.turnaround}
        </p>
      )}

      <div className="mt-4 border-t border-[#f0ebf2] pt-4">
        <p className="text-xs text-[#9277a8]">
          {product.type === "Pre-order"
            ? `${(product.preOrderLimit ?? 0) - (product.preOrdersReserved ?? 0)} pre-order slots remaining`
            : product.type === "Digital"
              ? "Digital download"
              : product.quantityAvailable > 0
                ? `${product.quantityAvailable} available`
                : "Sold out"}
        </p>
      </div>

      <Link
        href={`/u/${product.username}`}
        className="mt-5 block rounded-full border border-[#e5dce9] px-4 py-2 text-center text-sm text-[#75558c] transition hover:bg-[#eee8f2]"
      >
        Visit creator
      </Link>
    </article>
  );
}

export default function ArchivePage() {
 const [search, setSearch] = useState("");
const [selectedType, setSelectedType] = useState("All");
const [selectedCategory, setSelectedCategory] = useState("All");
const [sortBy, setSortBy] = useState("featured");
  const categories = [
    "All",
    ...Array.from(
      new Set(marketplaceProducts.map((product) => product.category))
    ),
  ];

  const filteredProducts = useMemo(() => {
    let result = [...marketplaceProducts];

    if (selectedType !== "All") {
      result = result.filter((product) => product.type === selectedType);
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (search.trim()) {
      const term = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.creator.toLowerCase().includes(term) ||
          product.username.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      );
    }

    if (sortBy === "featured") {
      result.sort(
        (a, b) => Number(b.featured) - Number(a.featured)
      );
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "release-date") {
      result.sort((a, b) => {
        const dateA = a.releaseDate
          ? new Date(a.releaseDate).getTime()
          : Infinity;
        const dateB = b.releaseDate
          ? new Date(b.releaseDate).getTime()
          : Infinity;

        return dateA - dateB;
      });
    }

    return result;
  }, [selectedType, selectedCategory, sortBy, search]);

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#46394f]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Header */}
        <header className="mb-10">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#9277a8]">
  The Kindred marketplace
</p>

<h1 className="font-serif text-4xl text-[#59406f] md:text-5xl">
  Marketplace
</h1>

<p className="mt-3 max-w-xl text-[#827a89]">
  Discover unique creations, handmade goods, artwork and digital
  products from creators across the Kindred community.
</p>
        </header>

        {/* Search & Sorting */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#e5dce9] bg-white px-4 py-3">
            <span className="text-xl text-[#9277a8]">⌕</span>

            <input
              type="text"
              placeholder="Search products, creators, or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[#59406f] outline-none placeholder:text-[#aaa1b1]"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm text-[#9277a8] hover:text-[#59406f]"
              >
                Clear
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-xl border border-[#e5dce9] bg-white px-4 py-3 text-sm text-[#75558c] outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="release-date">Release Date</option>
          </select>
        </div>

        {/* Product type filters */}
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-medium text-[#59406f]">
            Browse by type
          </h2>

          <div className="flex flex-wrap gap-2">
            {(["All", ...productTypes] as string[]).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedType === type
                    ? "bg-[#75558c] text-white"
                    : "border border-[#e5dce9] bg-white text-[#75558c] hover:bg-[#eee8f2]"
                }`}
              >
                {type === "All" ? "All types" : type}
              </button>
            ))}
          </div>
        </section>

        {/* Category filters */}
<section className="mb-10">
  <h2 className="mb-3 text-sm font-medium text-[#59406f]">
    Browse by category
  </h2>

  <div className="flex flex-wrap gap-2">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => setSelectedCategory(category)}
        className={`rounded-full px-4 py-2 text-sm transition ${
          selectedCategory === category
            ? "bg-[#75558c] text-white"
            : "border border-[#e5dce9] bg-white text-[#75558c] hover:bg-[#eee8f2]"
        }`}
      >
        {category === "All" ? "All categories" : category}
      </button>
    ))}
  </div>
</section>

        {/* Results heading */}
<div className="mb-5 flex items-center justify-between">
  <h2 className="font-serif text-2xl text-[#59406f]">
    Products
  </h2>

  <span className="text-sm text-[#9277a8]">
    {filteredProducts.length}{" "}
    {filteredProducts.length === 1 ? "product" : "products"}
  </span>
</div>

            {/* Product grid */}
{filteredProducts.length === 0 ? (
  <div className="rounded-2xl border border-[#e5dce9] bg-white p-12 text-center">
    <h3 className="font-serif text-xl text-[#59406f]">
      No products found
    </h3>

    <p className="mt-2 text-sm text-[#827a89]">
      Try changing your search or filters.
    </p>

    <button
      onClick={() => {
        setSelectedType("All");
        setSelectedCategory("All");
        setSearch("");
      }}
      className="mt-5 rounded-full bg-[#75558c] px-5 py-2 text-sm text-white hover:bg-[#59406f]"
    >
      Reset filters
    </button>
  </div>
) : (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {filteredProducts.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
)}

        {/* Footer */}
        <div className="mt-16 rounded-2xl bg-[#eee8f2] p-8 text-center">
          <h3 className="font-serif text-2xl text-[#59406f]">
            Every creation has a place here.
          </h3>

          <p className="mt-2 text-[#827a89]">
            Have something of your own to share?
          </p>

          <Link
            href="/home"
            className="mt-5 inline-block rounded-full bg-[#75558c] px-6 py-3 text-sm text-white transition hover:bg-[#59406f]"
          >
            Share something
          </Link>
        </div>
      </div>
    </main>
  );
}