"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { KindredPost } from "@/app/data/posts";
import { getPosts, subscribeToPosts } from "@/app/lib/sharedPosts";

function TagPageContent() {
  const params = useParams<{ tag: string }>();
  const selectedTag = decodeURIComponent(params.tag).toLowerCase();

  const [allPosts, setAllPosts] = useState<KindredPost[]>([]);

  useEffect(() => {
    queueMicrotask(() => setAllPosts(getPosts()));

    const unsubscribe = subscribeToPosts(() => {
      setAllPosts(getPosts());
    });

    return unsubscribe;
  }, []);

  const taggedPosts = allPosts.filter((post) =>
    post.tags.some(
      (postTag) => postTag.replace(/^#/, "").toLowerCase() === selectedTag
    )
  );

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#30283a]">
      <header className="border-b border-[#e9e3eb] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-5">
          <Link href="/home" className="text-xl font-bold text-[#75558c]">
            kindred<span className="text-[#c59aa6">.</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/home"
          className="text-sm text-[#827a89] hover:text-[#75558c]"
        >
          ← Back to feed
        </Link>

        <div className="mt-6 rounded-3xl bg-[#e9e1f0] p-8">
          <p className="text-sm text-[#756780]">Exploring a little corner</p>

          <h1 className="mt-2 font-serif text-4xl text-[#59406f]">
            #{selectedTag}
          </h1>

          <p className="mt-3 text-sm text-[#756780]">
            Discover creations, ideas and conversations tagged with #{selectedTag}.
          </p>

          <p className="mt-4 text-sm text-[#75558c]">
            {taggedPosts.length} {taggedPosts.length === 1 ? "post" : "posts"}
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {taggedPosts.length > 0 ? (
            taggedPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-3xl border border-[#e9e3eb] bg-white p-6"
              >
                <Link
                  href={`/u/${post.username}`}
                  className="font-medium text-[#75558c] hover:underline"
                >
                  {post.creator}
                </Link>

                <p className="mt-1 text-xs text-[#827a89]">
                  @{post.username} · {post.time}
                </p>

                {post.image && (
                  <div className="mt-4 overflow-hidden rounded-2xl">
                    <img
                      src={post.image}
                      alt="Post attachment"
                      className="max-h-[500px] w-full object-contain"
                    />
                  </div>
                )}

                <p className="mt-4 text-sm leading-7">{post.content}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((postTag) => (
                    <Link
                      key={postTag}
                      href={`/tags/${encodeURIComponent(
                        postTag.toLowerCase().replace(/^#/, "")
                      )}`}
                      className="text-xs text-[#866b9b] hover:underline"
                    >
                      #{postTag.replace(/^#/, "")}
                    </Link>
                  ))}
                </div>

                <div className="mt-5 flex gap-5 border-t border-[#f0ebf2] pt-4 text-sm text-[#9277a8]">
                  <span>♡ {post.likes}</span>
                  <span>☁ {post.comments}</span>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-[#e9e3eb] bg-white p-10 text-center">
              <p className="text-3xl">✧</p>

              <h2 className="mt-3 font-serif text-xl">A little quiet here</h2>

              <p className="mt-2 text-sm text-[#827a89]">
                There aren&apos;t any posts using this tag just yet. Why not be the
                first to share something?
              </p>

              <Link
                href="/home"
                className="mt-5 inline-block rounded-full bg-[#75558c] px-5 py-2.5 text-sm text-white hover:bg-[#59406f]"
              >
                Create a post
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function TagPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#faf8f5]" />}>
      <TagPageContent />
    </Suspense>
  );
}
