import Link from "next/link";
import { notFound } from "next/navigation";
import { marketplaceProducts } from "@/app/data/marketplace";
import ProductGallery from "./ProductGallery";
import ProductConfiguration from "./ProductConfiguration";
export function generateStaticParams() {
  return marketplaceProducts.map((product) => ({
    id: String(product.id),
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = marketplaceProducts.find(
    (item) => String(item.id) === id
  );

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#46394f]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/archive"
          className="text-sm text-[#9277a8] transition hover:text-[#59406f]"
        >
          ← Back to marketplace
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <ProductGallery images={product.images} title={product.title} />

          <aside className="h-fit rounded-2xl border border-[#e5dce9] bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-[#eee8f2] px-3 py-1 text-xs text-[#75558c]">
                {product.type}
              </span>
              {product.featured && (
  <span className="rounded-full bg-[#f8f0df] px-3 py-1 text-xs font-medium text-[#a17a40]">
    ✦ Featured
  </span>
)}
            </div>

            <h1 className="mt-5 font-serif text-4xl leading-tight text-[#59406f]">
              {product.title}
            </h1>
      <Link
        href={`/u/${product.username}`}
        className="mt-2 inline-block text-sm font-medium text-[#9277a8] transition hover:text-[#59406f] hover:underline"
      >
       Created by {product.creator}
      </Link>

            <p className="mt-5 text-[15px] leading-7 text-[#63596b]">
              {product.description}
            </p>

            <div className="mt-6 border-t border-[#f0ebf2] pt-5">
  <p className="font-serif text-4xl font-medium text-[#59406f]">
    €{product.price.toFixed(2)}
  </p>
  <p className="mt-2 text-sm text-[#9277a8]">
    {product.category}
  </p>
</div>

            {product.type === "Pre-order" && product.releaseDate && (
              <p className="mt-4 text-sm text-[#75558c]">
                Release date:{" "}
                {new Date(product.releaseDate).toLocaleDateString("en-IE")}
              </p>
            )}

            {product.type === "Made to Order" && product.turnaround && (
              <p className="mt-4 text-sm text-[#75558c]">
                Made in: {product.turnaround}
              </p>
            )}

            <div className="mt-5 rounded-xl bg-[#faf8f5] p-4">
  <p className="text-sm font-medium text-[#59406f]">
    {product.type === "Pre-order"
      ? "Pre-order available"
      : product.type === "Made to Order"
        ? "Made to order"
        : product.type === "Digital"
          ? "Digital product"
          : product.quantityAvailable > 0
            ? "In stock"
            : "Sold out"}
  </p>

  <p className="mt-1 text-sm text-[#9277a8]">
    {product.type === "Pre-order"
      ? `${(product.preOrderLimit ?? 0) - (product.preOrdersReserved ?? 0)} slots remaining`
      : product.type === "Made to Order"
        ? product.turnaround ?? "Made after purchase"
        : product.type === "Digital"
          ? "Available for digital download"
          : product.quantityAvailable > 0
            ? `${product.quantityAvailable} available`
            : "Currently unavailable"}
  </p>
</div>
           <div className="mt-5 border-t border-[#f0ebf2] pt-5">
  <ProductConfiguration product={product} />
</div>


          </aside>
        </div>

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
