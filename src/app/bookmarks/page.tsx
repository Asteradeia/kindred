"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getBookmarks,
  toggleBookmark,
  type KindredPost,
} from "@/app/lib/bookmarks";

export default function BookmarksPage() {
  const [savedPosts, setSavedPosts] = useState<KindredPost[]>([]);

  useEffect(() => {
    function refreshBookmarks() {
      setSavedPosts(getBookmarks());
    }

    refreshBookmarks();

    window.addEventListener("kindred-bookmarks-updated", refreshBookmarks);

    return () => {
      window.removeEventListener("kindred-bookmarks-updated", refreshBookmarks);
    };
  }, []);

  function removeBookmark(post: KindredPost) {
    toggleBookmark(post);
    setSavedPosts(getBookmarks());
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#30283a]">
      <div className="mx-auto max-w-5xl px-5 py-12 md:px-10">
        {/* Header */}
        <header className="mb-10">
          <Link
            href="/home"
            className="mb-6 inline-block text-sm text-[#866b9b] hover:underline"
          >
            ← Back to feed
          </Link>

          <p className="mb-3 text-sm uppercase tracking-[0.18em] text-[#9277a8]">
            Your personal collection
          </p>

          <h1 className="font-serif text-4xl md:text-5xl">Bookmarks</h1>

          <p className="mt-3 max-w-xl text-[#827a89]">
            Keep the things that inspire you close. Posts you save will live here.
          </p>

          <div className="mt-5 inline-flex rounded-full bg-[#eee8f2] px-4 py-2 text-sm text-[#75558c]">
            {savedPosts.length} {savedPosts.length === 1 ? "saved post" : "saved posts"}
          </div>
        </header>

        {/* Empty state */}
        {savedPosts.length === 0 ? (
          <div className="rounded-3xl border border-[#e9e3eb] bg-white px-6 py-16 text-center">
            <div className="text-5xl">♧</div>

            <h2 className="mt-5 font-serif text-2xl">
              Your collection is waiting
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#827a89]">
              When you find something you love on Kindred, bookmark it and
              it will appear here for you to revisit.
            </p>

            <Link
              href="/home"
              className="mt-7 inline-block rounded-full bg-[#75558c] px-6 py-3 text-sm text-white transition hover:bg-[#59406f]"
            >
              Explore your feed
            </Link>
          </div>
        ) : (
          /* Saved posts */
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {savedPosts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-3xl border border-[#e9e3eb] bg-white"
              >
                {/* Post header */}
                <div className="flex items-center justify-between p-5">
                  <Link
                    href={`/u/${post.username}`}
                    className="flex items-center gap-3"
                  >
                    <div
                      style={{ backgroundColor: post.avatarColor }}
                      className="flex h-11 w-11 items-center justify-center rounded-full font-medium text-[#75558c]"
                    >
                      {post.avatar}
                    </div>

                    <div>
                      <p className="text-sm font-medium">{post.creator}</p>
                      <p className="text-xs text-[#827a89]">
                        @{post.username} · {post.time}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={() => removeBookmark(post)}
                    className="rounded-full px-3 py-2 text-sm text-[#75558c] transition hover:bg-[#eee8f2]"
                    title="Remove bookmark"
                  >
                    ♣ Remove
                  </button>
                </div>

                {/* Content */}
                <div className="px-5 pb-4">
                  <p className="text-sm leading-7">{post.content}</p>

                  {post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${encodeURIComponent(tag.toLowerCase().replace(/^#/, ""))}`}
                          className="text-xs text-[#866b9b] hover:underline"
                        >
                          #{tag.replace(/^#/, "")}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image */}
                {post.image && (
                  <img
                    src={post.image}
                    alt=""
                    className="max-h-[450px] w-full object-contain bg-[#faf8f5]"
                  />
                )}

                {/* Footer */}
                <div className="border-t border-[#f0ebf2] px-5 py-4">
                  <p className="text-sm text-[#827a89]">
                    ♥ {post.likes} · ○ {post.comments} comments
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom link */}
        {savedPosts.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/discover"
              className="text-sm text-[#75558c] hover:underline"
            >
              Discover something new →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}