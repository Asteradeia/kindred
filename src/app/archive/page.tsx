"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getPosts,
  subscribeToPosts,
} from "@/app/lib/sharedPosts";
type SortOption = "newest" | "popular" | "creator";

export default function ArchivePage() {
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [search, setSearch] = useState("");
const [allPosts, setAllPosts] = useState<ReturnType<typeof getPosts>>([]);
useEffect(() => {
  function refreshPosts() {
    setAllPosts(getPosts());
  }

  refreshPosts();

  const unsubscribe = subscribeToPosts(refreshPosts);

  return () => unsubscribe();
}, []);
  const tags = [
    "All",
    ...Array.from(new Set(allPosts.flatMap((post) => post.tags))).sort(),
  ];

  const filteredPosts = useMemo(() => {
    let result = [...allPosts];

    if (selectedTag !== "All") {
      result = result.filter((post) =>
        post.tags.some(
          (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
        )
      );
    }

    if (search.trim()) {
      const term = search.toLowerCase();

      result = result.filter(
        (post) =>
          post.content.toLowerCase().includes(term) ||
          post.creator.toLowerCase().includes(term) ||
          post.username.toLowerCase().includes(term) ||
          post.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    if (sortBy === "popular") {
      result.sort((a, b) => b.likes - a.likes);
    }

    if (sortBy === "creator") {
      result.sort((a, b) => a.creator.localeCompare(b.creator));
    }

    return result;
  }, [allPosts, selectedTag, sortBy, search]);

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#46394f]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Header */}
        <header className="mb-10">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#9277a8]">
            The Kindred library
          </p>

          <h1 className="font-serif text-4xl text-[#59406f] md:text-5xl">
            The Archive
          </h1>

          <p className="mt-3 max-w-xl text-[#827a89]">
            A collection of ideas, creations, little moments and things
            shared by the Kindred community.
          </p>
        </header>

        {/* Search & Sorting */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#e5dce9] bg-white px-4 py-3">
            <span className="text-xl text-[#9277a8]">⌕</span>

            <input
              type="text"
              placeholder="Search the archive..."
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
            <option value="newest">Newest</option>
            <option value="popular">Most liked</option>
            <option value="creator">Creator A–Z</option>
          </select>
        </div>

        {/* Tag filters */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-medium text-[#59406f]">
            Browse by topic
          </h2>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedTag === tag
                    ? "bg-[#75558c] text-white"
                    : "border border-[#e5dce9] bg-white text-[#75558c] hover:bg-[#eee8f2]"
                }`}
              >
                {tag === "All" ? "All posts" : `#${tag}`}
              </button>
            ))}
          </div>
        </section>

        {/* Results heading */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#59406f]">
            Community posts
          </h2>

          <span className="text-sm text-[#9277a8]">
            {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
          </span>
        </div>

        {/* Post grid */}
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-[#e5dce9] bg-white p-12 text-center">
            <h3 className="font-serif text-xl text-[#59406f]">
              Nothing found in the archive
            </h3>

            <p className="mt-2 text-sm text-[#827a89]">
              Try changing your search or choosing a different topic.
            </p>

            <button
              onClick={() => {
                setSelectedTag("All");
                setSearch("");
              }}
              className="mt-5 rounded-full bg-[#75558c] px-5 py-2 text-sm text-white hover:bg-[#59406f]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-[#e5dce9] bg-white p-6 transition hover:shadow-md"
              >
                {/* Creator */}
                <Link
                  href={`/u/${post.username}`}
                  className="mb-5 flex items-center gap-3"
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full font-serif text-lg text-[#59406f]"
                    style={{ backgroundColor: post.avatarColor }}
                  >
                    {post.avatar}
                  </div>

                  <div>
                    <p className="font-medium text-[#59406f]">{post.creator}</p>
                    <p className="text-xs text-[#9277a8]">
                      @{post.username} · {post.time}
                    </p>
                  </div>
                </Link>

                {/* Content */}
                <p className="leading-relaxed text-[#63596b]">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className="rounded-full bg-[#f1edf4] px-3 py-1 text-xs text-[#75558c] hover:bg-[#e9e1ef]"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-5 flex gap-5 border-t border-[#f0ebf2] pt-4 text-sm text-[#9277a8]">
                  <span>♡ {post.likes}</span>
                  <span>☁ {post.comments}</span>
                </div>
              </article>
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