
"use client";

import { useState } from "react";
import type { KindredPost } from "@/app/data/posts";

export default function PostCard({ post }: { post: KindredPost }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="overflow-hidden rounded-3xl border border-[#e9e3eb] bg-white">
      {/* Post header */}
      <div className="flex items-center justify-between p-5">
        <a
          href={`/u/${post.username}`}
          className="flex items-center gap-3 group"
        >
          <div
            style={{ backgroundColor: post.avatarColor }}
            className="flex h-12 w-12 items-center justify-center rounded-full font-serif text-xl text-[#75558c]"
          >
            {post.avatar}
          </div>

          <div>
            <p className="font-medium text-[#30283a] group-hover:text-[#75558c]">
              {post.creator}
            </p>
            <p className="text-xs text-[#928899]">
              @{post.username} · {post.time}
            </p>
          </div>
        </a>

        <button
          aria-label="More post options"
          className="rounded-full px-3 py-2 text-[#928899] hover:bg-[#f4eff6]"
        >
          ···
        </button>
      </div>

      {/* Post content */}
      <div className="px-5 pb-4">
        <p className="whitespace-pre-line leading-7 text-[#40364a]">
          {post.content}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <a
              href={`/discover?tag=${encodeURIComponent(tag)}`}
              key={tag}
              className="text-sm text-[#75558c] hover:underline"
            >
              #{tag}
            </a>
          ))}
        </div>
      </div>

      {/* Post actions */}
      <div className="flex items-center justify-between border-t border-[#eee8f0] px-5 py-3">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-2 text-sm transition ${
              liked ? "text-[#b56c91]" : "text-[#827a89 hover:text-[#b56c91]"
            }`}
          >
            <span className="text-lg">{liked ? "♥" : "♡"}</span>
            {post.likes + (liked ? 1 : 0)}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm text-[#827a89] hover:text-[#75558c]"
          >
            <span className="text-lg">◯</span>
            {post.comments} comments
          </button>
        </div>

        <button
          onClick={() => setBookmarked(!bookmarked)}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark post"}
          className={`text-lg ${
            bookmarked ? "text-[#75558c]" : "text-[#827a89 hover:text-[#75558c]"
          }`}
        >
          {bookmarked ? "▣" : "□"}
        </button>
      </div>

      {/* Demo comment area */}
      {showComments && (
        <div className="border-t border-[#eee8f0] bg-[#faf8f5] px-5 py-4">
          <p className="text-sm text-[#827a89]">
            Comments will be connected when we build the comment system.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Write a little comment..."
              disabled
              className="min-w-0 flex-1 rounded-full border border-[#e9e3eb] bg-white px-4 py-2 text-sm outline-none"
            />
            <button
              disabled
              className="rounded-full bg-[#d8c9e1] px-4 py-2 text-sm text-white"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
