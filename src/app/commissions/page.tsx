
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const commissions = [
  {
    id: 1,
    creator: "Moss & Moon",
    username: "@mossandmoon",
    avatar: "M",
    avatarColor: "#e3eadc",
    title: "Fantasy character illustration",
    description: "Detailed character art with soft colours, magical details and a whimsical atmosphere.",
    category: "Illustration",
    price: 45,
    turnaround: "7–14 days",
    slots: 3,
    artColor: "#e9e1f0",
    symbol: "✿",
    featured: true,
  },
  {
    id: 2,
    creator: "PaperCrow",
    username: "@papercrow",
    avatar: "P",
    avatarColor: "#f0dfe8",
    title: "Short story commission",
    description: "A custom short story written around your characters, ideas or prompts.",
    category: "Writing",
    price: 25,
    turnaround: "5–10 days",
    slots: 5,
    artColor: "#f2e1e2",
    symbol: "☾",
    featured: false,
  },
  {
    id: 3,
    creator: "Little Fern Studio",
    username: "@littlefernstudio",
    avatar: "F",
    avatarColor: "#e4e6f1",
    title: "Handmade crochet plushie",
    description: "A made-to-order little creature, lovingly crocheted in your choice of colours.",
    category: "Handmade",
    price: 35,
    turnaround: "2–3 weeks",
    slots: 2,
    artColor: "#e9eee4",
    symbol: "♡",
    featured: true,
  },
  {
    id: 4,
    creator: "PixelWitch",
    username: "@pixelwitch",
    avatar: "W",
    avatarColor: "#e5e8f2",
    title: "Pixel art character",
    description: "A custom pixel character suitable for indie games, avatars or personal projects.",
    category: "Games & Digital",
    price: 20,
    turnaround: "3–7 days",
    slots: 4,
    artColor: "#e2e7f1",
    symbol: "✧",
    featured: false,
  },
  {
    id: 5,
    creator: "Ink & Ivy",
    username: "@inkandivy",
    avatar: "I",
    avatarColor: "#f1eadc",
    title: "Poetry written for you",
    description: "A personalised poem inspired by a memory, person, place or feeling.",
    category: "Writing",
    price: 15,
    turnaround: "3–5 days",
    slots: 6,
    artColor: "#f1eadc",
    symbol: "❀",
    featured: false,
  },
  {
    id: 6,
    creator: "Starling Studio",
    username: "@starlingstudio",
    avatar: "S",
    avatarColor: "#e9e1f0",
    title: "Custom illustrated portrait",
    description: "A soft, stylised portrait of you, a friend, a pet or an original character.",
    category: "Illustration",
    price: 60,
    turnaround: "1–2 weeks",
    slots: 1,
    artColor: "#f0e2e9",
    symbol: "✷",
    featured: false,
  },
];

const categories = ["All", "Illustration", "Writing", "Handmade", "Games & Digital"];

export default function CommissionsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openOnly, setOpenOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const filteredCommissions = useMemo(() => {
    let results = commissions.filter((commission) => {
      const matchesCategory =
        activeCategory === "All" || commission.category === activeCategory;

      const searchText = `${commission.title} ${commission.creator} ${commission.description} ${commission.category}`.toLowerCase();
      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesAvailability = !openOnly || commission.slots > 0;

      return matchesCategory && matchesSearch && matchesAvailability;
    });

    if (sortBy === "price-low") {
      results = [...results].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      results = [...results].sort((a, b) => b.price - a.price);
    } else if (sortBy === "slots") {
      results = [...results].sort((a, b) => b.slots - a.slots);
    }

    return results;
  }, [search, activeCategory, openOnly, sortBy]);

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#30283a]">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#e9e3eb] bg-[#faf8f5]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-bold tracking-tight text-[#75558c]">
            kindred<span className="text-[#c59aa6]">.</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/home" className="text-sm text-[#62596b] hover:text-[#75558c]">Home</Link>
            <Link href="/discover" className="text-sm text-[#62596b] hover:text-[#75558c]">Discover</Link>
            <Link href="/commissions" className="text-sm font-medium text-[#75558c]">Commissions</Link>
            <Link href="/profile" className="text-sm text-[#62596b] hover:text-[#75558c]">Creators</Link>
          </nav>

          <Link href="/profile" className="rounded-full bg-[#e9e1f0] px-4 py-2 text-sm text-[#75558c]">
            My account
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10">
        {/* Hero */}
        <section className="mb-10 rounded-[2rem] bg-[#eee8f2] px-8 py-12 md:px-14 md:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#9277a8]">
              Made by people, made with love
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-[#59406f] md:text-6xl">
              Find something special.
              <span className="block italic">Make it yours.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#756780]">
              Commission artwork, stories, handmade treasures and creative work
              from independent artists and makers in the Kindred community.
            </p>
            <a
              href="#browse"
              className="mt-7 inline-block rounded-full bg-[#75558c] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#59406f]"
            >
              Browse commissions ↓
            </a>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-10">
          <h2 className="mb-4 font-serif text-2xl">Explore by creativity</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { name: "Illustration", symbol: "✿", colour: "#e9e1f0" },
              { name: "Writing", symbol: "☾", colour: "#f2e1e2" },
              { name: "Handmade", symbol: "♡", colour: "#e9eee4" },
              { name: "Games & Digital", symbol: "✧", colour: "#e2e7f1" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveCategory(item.name)}
                style={{ backgroundColor: item.colour }}
                className="rounded-2xl p-5 text-left transition hover:-translate-y-1"
              >
                <span className="text-2xl text-[#75558c]">{item.symbol}</span>
                <p className="mt-3 text-sm font-medium text-[#59406f]">{item.name}</p>
                <p className="mt-1 text-xs text-[#827a89]">Explore creations →</p>
              </button>
            ))}
          </div>
        </section>

        {/* Marketplace */}
        <section id="browse">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#a18baa]">The marketplace</p>
              <h2 className="mt-2 font-serif text-3xl">Open for commissions</h2>
              <p className="mt-2 text-sm text-[#827a89]">
                Find a creative, commission a piece and support independent creators.
              </p>
            </div>
            <span className="text-sm text-[#827a89]">
              {filteredCommissions.length} listings found
            </span>
          </div>

          {/* Search */}
          <div className="mb-5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artwork, stories, creators..."
              className="w-full rounded-2xl border border-[#e9e3eb] bg-white px-5 py-4 text-sm outline-none focus:border-[#b69ac8]"
            />
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-[#e9e3eb] bg-white p-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                    activeCategory === category
                      ? "bg-[#75558c] text-white"
                      : "bg-[#faf8f5] text-[#827a89] hover:bg-[#eee8f2]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f0ebf2] pt-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#62596b]">
                <input
                  type="checkbox"
                  checked={openOnly}
                  onChange={(e) => setOpenOnly(e.target.checked)}
                  className="accent-[#75558c]"
                />
                Only show available creators
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-[#e9e3eb] bg-[#faf8f5] px-4 py-2 text-sm text-[#62596b] outline-none"
              >
                <option value="featured">Featured first</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="slots">Most available slots</option>
              </select>
            </div>
          </div>

          {/* Listings */}
          {filteredCommissions.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCommissions.map((commission) => (
                <article
                  key={commission.id}
                  className="overflow-hidden rounded-3xl border border-[#e9e3eb] bg-white transition hover:-translate-y-1 hover:shadow-sm"
                >
                  {/* Preview artwork */}
                  <div
                style={{ backgroundColor: commission.artColor }}
                className="relative flex h-56 items-center justify-center"
              >
                <span className="font-serif text-8xl text-[#75558c]/60">{commission.symbol}</span>
                {commission.featured && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-[#75558c]">
                    Featured
                  </span>
                )}
                <span className="absolute bottom-4 right-4 rounded-full bg-white/85 px-3 py-1 text-xs text-[#75558c]">
                  {commission.slots > 0 ? "Open" : "Closed"}
                </span>
              </div>

              {/* Creator */}
              <div className="p-5">
                <div className="mb-4 flex items-center gap-2.5">
                  <div
                    style={{ backgroundColor: commission.avatarColor }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-[#75558c]"
                  >
                    {commission.avatar}
                  </div>
                  <div>
                  <a
  href={`/u/${commission.username.replace("@", "")}`}
  className="hover:text-[#75558c] hover:underline"
>
  {commission.creator}
</a>

<p className="text-sm text-[#827a89]">
  {commission.username}
</p>
                  </div>
                </div>

                <h3 className="font-serif text-xl">{commission.title}</h3>
                <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-[#827a89]">
                  {commission.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#eee8f2] px-3 py-1.5 text-xs text-[#75558c]">
                    {commission.category}
                  </span>
                  <span className="rounded-full bg-[#faf8f5] px-3 py-1.5 text-xs text-[#827a89]">
                    {commission.slots} slots left
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between border-t border-[#f0ebf2] pt-4">
                  <div>
                    <p className="text-xs text-[#827a89]">Starting from</p>
                    <p className="text-xl font-semibold text-[#59406f]">€{commission.price}</p>
                    <p className="mt-1 text-xs text-[#827a89]">{commission.turnaround}</p>
                  </div>
                 <a
  href={`/commissions/${commission.id}`}
  className="rounded-full bg-[#75558c] px-4 py-2.5 text-sm text-white transition hover:bg-[#59406f]"
>
  View details →
</a>
                </div>
              </div>
            </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#e9e3eb] bg-white px-6 py-16 text-center">
              <span className="text-4xl text-[#75558c]">✧</span>
              <h3 className="mt-4 font-serif text-2xl">No commissions found</h3>
              <p className="mt-2 text-sm text-[#827a89]">Try changing your search or filters.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                  setOpenOnly(false);
                }}
                className="mt-5 rounded-full border border-[#dcd2e2] px-5 py-2.5 text-sm text-[#75558c] hover:bg-[#eee8f2]"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Creator CTA */}
        <section className="mt-16 rounded-[2rem] bg-[#e9eee4] px-8 py-10 md:flex md:items-center md:justify-between md:px-12">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#82967b]">Are you a creator?</p>
            <h2 className="mt-3 font-serif text-3xl text-[#587255]">Share your talent with Kindred.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#758c70]">
              Create your profile, showcase your work and open commissions to the community.
            </p>
          </div>
          <a
            href="/profile"
            className="mt-6 inline-block whitespace-nowrap rounded-full bg-[#6c8468] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#587255] md:mt-0"
          >
            Become a creator →
          </a>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#e9e3eb] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row">
          <Link href="/" className="text-xl font-bold text-[#75558c]">
            kindred<span className="text-[#c59aa6]">.</span>
          </Link>
          <p className="text-sm text-[#827a89]">A home for people who create.</p>
          <p className="text-xs text-[#a19aa8]">© 2026 Kindred</p>
        </div>
      </footer>
    </main>
  );
}
