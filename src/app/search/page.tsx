"use client";

import { Suspense } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { KindredPost } from "@/app/data/posts";
import { useSearchParams } from "next/navigation";
import {
  getPosts,
  subscribeToPosts,
} from "@/app/lib/sharedPosts";

const creators = [
  { name: "Moss & Moon", username: "mossandmoon", category: "Illustration", avatar: "M", color: "#e5eddc" },
  { name: "PaperCrow", username: "papercrow", category: "Writing", avatar: "P", color: "#f0dfe8" },
  { name: "Little Fern Studio", username: "littlefernstudio", category: "Crafts", avatar: "F", color: "#e2e8f2" },
  { name: "PixelWitch", username: "pixelwitch", category: "Gaming", avatar: "W", color: "#e8e1f1" },
  { name: "Ink & Ivy", username: "inkandivy", category: "Writing", avatar: "I", color: "#f1e5dc" },
  { name: "Starling Studio", username: "starlingstudio", category: "Art", avatar: "S", color: "#e6e5f0" },
];

const categories = ["All", "Art", "Writing", "Gaming", "Crafts", "Photography", "Music", "Cosplay"];

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#faf8f5] text-sm text-[#827a89]">
          Loading search...
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("Posts");
const [allPosts, setAllPosts] = useState<KindredPost[]>([]);
const [showAllTags, setShowAllTags] = useState(false);
const searchParams = useSearchParams();

useEffect(() => {
  let cancelled = false;
  const urlQuery = searchParams.get("query") ?? "";
  queueMicrotask(() => {
    if (!cancelled) setQuery(urlQuery);
  });

  return () => {
    cancelled = true;
  };
}, [searchParams]);

useEffect(() => {
  const refreshPosts = () => {
    void getPosts()
      .then(setAllPosts)
      .catch((error: unknown) => {
        console.error("Could not load Kindred posts:", error);
      });
  };
  queueMicrotask(refreshPosts);

  const unsubscribe = subscribeToPosts(() => {
    refreshPosts();
  });

  return () => {
    unsubscribe();
  };
}, []);
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesQuery =
        query.trim() === "" ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.creator.toLowerCase().includes(query.toLowerCase()) ||
        post.username.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));

      const matchesCategory =
        activeCategory === "All" ||
        post.tags.some((tag) => tag.toLowerCase() === activeCategory.toLowerCase());

      return matchesQuery && matchesCategory;
    });
  }, [allPosts, query, activeCategory]);

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const matchesQuery =
        query.trim() === "" ||
        creator.name.toLowerCase().includes(query.toLowerCase()) ||
        creator.username.toLowerCase().includes(query.toLowerCase()) ||
        creator.category.toLowerCase().includes(query.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        creator.category.toLowerCase() === activeCategory.toLowerCase();

      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  const allTags = useMemo(() => {
  const tagCounts = new Map<string, number>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);
}, [allPosts]);

  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#46394f]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#9277a8]">
            Find your corner
          </p>

          <h1 className="font-serif text-4xl text-[#59406f] md:text-5xl">
            Search Kindred
          </h1>

          <p className="mt-3 text-[#827a89]">
            Discover people, ideas and things created by the community.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <div className="flex items-center gap-3 rounded-2xl border border-[#e5dce9] bg-white px-5 py-4 shadow-sm">
            <span className="text-xl text-[#9277a8]">⌕</span>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search creators, posts, tags..."
              className="w-full bg-transparent text-[#59406f] outline-none placeholder:text-[#aaa1b1]"
            />

            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-sm text-[#9277a8] hover:text-[#59406f]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeCategory === category
                  ? "bg-[#75558c] text-white"
                  : "border border-[#e5dce9] bg-white text-[#75558c] hover:bg-[#eee8f2]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
{/* Explore tags */}
<div className="mb-8">
  <div className="mb-3 flex items-center justify-between">
    <h2 className="font-serif text-xl text-[#59406f]">Explore tags</h2>
  </div>

  <div className="flex flex-wrap items-center gap-2">
    {(showAllTags ? allTags : allTags.slice(0, 5)).map((tag) => (
      <button
        key={tag}
        onClick={() => setQuery(tag)}
        className="rounded-full bg-[#f1edf4] px-3 py-2 text-sm text-[#75558c] transition hover:bg-[#e9e1ef]"
      >
        #{tag}
      </button>
    ))}

    {allTags.length > 5 && (
      <button onClick={() => setShowAllTags(!showAllTags)}
  className="px-2 py-2 text-sm text-[#9277a8] transition hover:text-[#59406f]"
>
  {showAllTags ? "Show less ↑" : "Show more →"}
</button>
    )}
  </div>
</div>
        {/* Tabs */}
        <div className="mb-8 flex gap-6 border-b border-[#e5dce9]">
          {["Posts", "Creators"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm transition ${
                activeTab === tab
                  ? "border-b-2 border-[#75558c] font-medium text-[#59406f]"
                  : "text-[#827a89] hover:text-[#59406f]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results */}
        {activeTab === "Posts" && (
          <section>
            <h2 className="mb-5 font-serif text-2xl text-[#59406f]">
              Posts
              <span className="ml-2 text-sm font-sans text-[#9277a8]">
                ({filteredPosts.length})
              </span>
            </h2>

            {filteredPosts.length === 0 ? (
              <div className="rounded-2xl border border-[#e5dce9] bg-white p-10 text-center">
                <p className="font-serif text-xl text-[#59406f]">
                  No posts found
                </p>
                <p className="mt-2 text-sm text-[#827a89]">
                  Try a different search or category.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-2xl border border-[#e5dce9] bg-white p-6 transition hover:shadow-md"
                  >
                    <Link
                      href={`/u/${post.username}`}
                      className="mb-4 flex items-center gap-3"
                    >
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-full font-serif text-lg text-[#59406f]"
style={{ backgroundColor: post.avatarColor }}
                      >
                        {post.avatar}
                      </div>

                      <div>
                        <p className="font-medium text-[#59406f]">{post.creator}</p>
                        <p className="text-xs text-[#9277a8]">@{post.username}</p>
                      </div>
                    </Link>

                    <p className="leading-relaxed text-[#63596b]">{post.content}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${tag}`}
                          className="rounded-full bg-[#f1edf4] px-3 py-1 text-xs text-[#75558c] hover:bg-[#e9e1ef]"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>

                    <div className="mt-5 flex gap-4 border-t border-[#f0ebf2] pt-4 text-sm text-[#9277a8]">
                      <span>♡ {post.likes}</span>
                      <span>☁ {post.comments}</span>
                      <span>{post.time}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "Creators" && (
          <section>
            <h2 className="mb-5 font-serif text-2xl text-[#59406f]">
              Creators
              <span className="ml-2 text-sm font-sans text-[#9277a8]">
                ({filteredCreators.length})
              </span>
            </h2>

            {filteredCreators.length === 0 ? (
              <div className="rounded-2xl border border-[#e5dce9] bg-white p-10 text-center">
                <p className="font-serif text-xl text-[#59406f]">
                  No creators found
                </p>
                <p className="mt-2 text-sm text-[#827a89]">
                  Try a different search.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCreators.map((creator) => (
                  <Link
                    key={creator.username}
                    href={`/u/${creator.username}`}
                    className="rounded-2xl border border-[#e5dce9] bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-full font-serif text-xl text-[#59406f]"
                        style={{ backgroundColor: creator.color }}
                      >
                        {creator.avatar}
                      </div>

                      <div>
                        <h3 className="font-medium text-[#59406f]">
                          {creator.name}
                        </h3>
                        <p className="text-sm text-[#9277a8]">
                          @{creator.username}
                        </p>
                      </div>
                    </div>

                    <span className="mt-4 inline-block rounded-full bg-[#f1edf4] px-3 py-1 text-xs text-[#75558c]">
                      {creator.category}
                    </span>

                    <p className="mt-4 text-sm text-[#827a89]">
                      Visit creator profile →
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Bottom note */}
        <div className="mt-16 rounded-2xl bg-[#eee8f2] p-8 text-center">
          <h3 className="font-serif text-2xl text-[#59406f]">
            Something wonderful is waiting to be found.
          </h3>
          <p className="mt-2 text-[#827a89]">
            Explore, connect and discover your next favourite creator.
          </p>
          <Link
            href="/discover"
            className="mt-5 inline-block rounded-full bg-[#75558c] px-6 py-3 text-sm text-white transition hover:bg-[#59406f]"
          >
            Explore Discover
          </Link>
        </div>

      </div>
    </main>
  );
}