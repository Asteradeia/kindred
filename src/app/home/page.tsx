
"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { posts } from "@/app/data/posts";

const suggestedCreators = [
  { name: "Moss & Moon", username: "@mossandmoon", letter: "M", color: "#e3eadc" },
  { name: "PaperCrow", username: "@papercrow", letter: "P", color: "#f0dfe8" },
  { name: "Little Fern", username: "@littlefernstudio", letter: "F", color: "#e4e6f1" },
];

function Artwork({ type }: { type: string }) {
  if (type === "mushroom") {
    return (
      <div className="relative flex h-72 items-center justify-center overflow-hidden bg-[#e9e1f0]">
        <div className="absolute left-8 top-8 text-3xl">✦</div>
        <div className="absolute right-12 top-12 text-xl">✧</div>
        <div className="absolute bottom-10 left-16 text-2xl">✿</div>
        <div className="relative flex flex-col items-center">
          <div className="z-10 h-20 w-36 rounded-t-full bg-[#b9829c] shadow-sm" />
          <div className="-mt-2 h-24 w-16 rounded-b-3xl bg-[#f7eee6]" />
          <div className="absolute left-7 top-12 h-3 w-3 rounded-full bg-[#f7eee6]" />
          <div className="absolute right-7 top-12 h-3 w-3 rounded-full bg-[#f7eee6]" />
        </div>
        <div className="absolute bottom-0 h-16 w-full bg-[#cbd9c1]" />
      </div>
    );
  }

  if (type === "book") {
    return (
      <div className="flex h-64 items-center justify-center bg-[#f2e1e2]">
        <div className="relative flex h-40 w-32 -rotate-6 flex-col items-center justify-center rounded-r-xl border-l-8 border-[#98748b] bg-[#75558c] text-center shadow-xl">
          <span className="text-3xl text-[#ead9e9]">✧</span>
          <p className="mt-3 font-serif text-lg italic text-white">The Hollow</p>
          <p className="font-serif text-sm text-[#ead9e9]"> Lighthouse</p>
          <div className="mt-3 h-px w-16 bg-[#d7bdd9]" />
        </div>
        <div className="absolute mb-48 ml-64 text-2xl text-[#b37c8d]">☾</div>
      </div>
    );
  }

  return (
    <div className="flex h-64 items-center justify-center bg-[#e4e6f1]">
      <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-[#c3c9df]">
        <div className="flex h-28 w-24 items-center justify-center rounded-[45%] bg-[#f1e2d7] text-5xl">🐻</div>
        <span className="absolute -right-3 top-3 text-2xl">✿</span>
        <span className="absolute -left-4 bottom-5 text-xl">✧</span>
      </div>
    </div>
  );
}

export default function KindredHome() {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [activeFeed, setActiveFeed] = useState("Following");
  const [newPost, setNewPost] = useState("");
  const [feedPosts, setFeedPosts] = useState(posts);
  const [newTags, setNewTags] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

function publishPost() {
  if (!newPost.trim()) return;

  const tags = newTags
    .split(/[,\s]+/)
    .map((tag) => tag.replace(/^#/, "").trim())
    .filter(Boolean);

  const post = {
    id: Date.now().toString(),
    creator: "Kellie",
    username: "yourusername",
    avatar: "K",
    avatarColor: "#e9e1f0",
    content: newPost.trim(),
    tags,
    image: imagePreview ?? undefined,
    time: "Just now",
    likes: 0,
    comments: 0,
  };

  setFeedPosts((previousPosts) => [post, ...previousPosts]);
  setNewPost("");
  setNewTags("");
  setShowTags(false);
  setImagePreview(null);
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
}

function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Image must be smaller than 5MB.");
    e.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    setImagePreview(reader.result as string);
  };

  reader.readAsDataURL(file);
}
  function toggleLike(index: number) {
    setLikedPosts((previous) =>
      previous.includes(index)
        ? previous.filter((id) => id !== index)
        : [...previous, index]
    );
  }

  function toggleFollow(username: string) {
    setFollowing((previous) =>
      previous.includes(username)
        ? previous.filter((name) => name !== username)
        : [...previous, username]
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#30283a]">
      {/* Top navigation */}
      <header className="sticky top-0 z-40 border-b border-[#e9e3eb] bg-[#faf8f5]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5">
          <Link href="/" className="text-2xl font-bold tracking-tight text-[#75558c]">
            kindred<span className="text-[#c59aa6]">.</span>
          </Link>

          <div className="hidden max-w-md flex-1 px-12 md:block">
            <input
              placeholder="Search Kindred..."
              className="w-full rounded-full border border-[#e9e3eb] bg-white px-5 py-2.5 text-sm outline-none transition focus:border-[#b69ac8]"
            />
          </div>

          <div className="flex items-center gap-5">
            <button aria-label="Notifications" className="text-xl text-[#75558c]">♡</button>
            <button aria-label="Messages" className="text-xl text-[#75558c]">✉</button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9e1f0] font-medium text-[#75558c]">K</div>
          </div>
        </div>
      </header>

      {/* Three column layout */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-5 py-8 lg:grid-cols-[220px_minmax(0,620px)_280px]">

        {/* Left sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-3xl border border-[#e9e3eb] bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9e1f0] text-lg font-medium text-[#75558c]">K</div>
                <div>
                  <p className="font-medium">Kellie</p>
                  <p className="text-xs text-[#827a89]">@yourusername</p>
                </div>
              </div>
              <Link href="/profile" className="mt-4 block rounded-full border border-[#e9e3eb] py-2 text-center text-sm text-[#75558c] hover:bg-[#eee8f2]">
                View profile
              </Link>
            </div>

            <nav className="space-y-1">
              {[
                ["⌂", "Home"],
                ["✧", "Discover"],
                ["▤", "Archive"],
                ["✎", "Commissions"],
                ["♡", "Requests"],
                ["♧", "Projects"],
                ["▣", "Bookmarks"],
              ].map(([icon, label]) => (
                <a
                  key={label}
                  href={label === "Home" ? "/home" : `/${label.toLowerCase()}`}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    label === "Home"
                      ? "bg-[#eee8f2] font-medium text-[#75558c]"
                      : "text-[#62596b] hover:bg-[#f0ebf2]"
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  {label}
                </a>
              ))}
            </nav>

            <div className="px-3 text-xs leading-6 text-[#a19aa8]">
              A home for people who create.
            </div>
          </div>
        </aside>

        {/* Main feed */}
        <section className="min-w-0">
          <div className="mb-6">
            <h1 className="font-serif text-3xl">Your little corner.</h1>
            <p className="mt-1 text-sm text-[#827a89]">A little inspiration from your creative community.</p>
          </div>

          {/* Post composer */}
          <div className="mb-6 rounded-3xl border border-[#e9e3eb] bg-white p-5">
            <div className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e9e1f0] font-medium text-[#75558c]">K</div>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What are you creating today?"
                rows={3}
                className="w-full resize-none rounded-2xl bg-[#faf8f5] p-4 text-sm outline-none placeholder:text-[#a49aa8] focus:ring-1 focus:ring-[#d9c9e5]"
              />
            </div>
            {showTags && (
              <div className="mt-3 ml-14">
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Add tags (e.g. fantasy, art, wip)"
                  className="w-full rounded-xl border border-[#e9e3eb] bg-[#faf8f5] px-4 py-3 text-sm outline-none focus:border-[#b69ac8]"
                />
                <p className="mt-1 text-xs text-[#a19aa8]">
                  Separate tags with spaces or commas.
                </p>
              </div>
            )}
            {imagePreview && (
              <div className="relative mt-4 ml-14">
                <img
                  src={imagePreview}
                  alt="Post preview"
                  className="max-h-80 w-full rounded-2xl object-contain"
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="absolute right-2 top-2 rounded-full bg-black/60 px-3 py-1 text-sm text-white hover:bg-black/80"
                >
                  ✕ Remove
                </button>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-4 text-sm text-[#827a89]">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="transition hover:text-[#75558c]"
                >
                  ▧ Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  onClick={() => setShowTags(!showTags)}
                  className={`transition hover:text-[#75558c] ${
                    showTags ? "text-[#75558c]" : ""
                  }`}
                >
                  ✧ Tags
                </button>
              </div>
              <button
                disabled={!newPost.trim()}
             onClick={publishPost}
                className="rounded-full bg-[#75558c] px-5 py-2 text-sm text-white transition hover:bg-[#59406f] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </div>

          {/* Feed selector */}
          <div className="mb-5 flex gap-2 rounded-2xl border border-[#e9e3eb] bg-white p-2">
            {["Following", "Latest", "Discover"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFeed(tab)}
                className={`flex-1 rounded-xl py-2.5 text-sm transition ${
                  activeFeed === tab
                    ? "bg-[#eee8f2] font-medium text-[#75558c]"
                    : "text-[#827a89] hover:bg-[#faf8f5]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-5">
            {feedPosts.map((post, index) => (
              <article key={post.id} className="overflow-hidden rounded-3xl border border-[#e9e3eb] bg-white">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: post.avatarColor }}
                      className="flex h-11 w-11 items-center justify-center rounded-full font-medium text-[#75558c]"
                    >
                      {post.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{post.creator}</p>
                      <p className="text-xs text-[#827a89]">@{post.username} · {post.time}</p>
                    </div>
                  </div>
                  <button aria-label="Post options" className="text-xl text-[#827a89]">···</button>
                </div>

                <div className="px-5 pb-4">
                  <p className="text-sm leading-7">{post.content}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${encodeURIComponent(tag.toLowerCase().replace(/^#/, ""))}`}
                        className="text-xs text-[#866b9b] transition hover:text-[#75558c] hover:underline"
                      >
                        #{tag.replace(/^#/, "")}
                      </Link>
                    ))}
                  </div>
                </div>

                {post.image ? (
                  <img
                    src={post.image}
                    alt=""
                    className="max-h-[520px] w-full object-contain bg-[#faf8f5]"
                  />
                ) : (
                  <Artwork type={index === 0 ? "mushroom" : index === 1 ? "book" : "bear"} />
                )}

                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex gap-5">
                    <button
                      onClick={() => toggleLike(index)}
                      className={`text-sm transition ${
                        likedPosts.includes(index) ? "text-[#b66d8a]" : "text-[#827a89] hover:text-[#b66d8a]"
                      }`}
                    >
                      {likedPosts.includes(index) ? "♥" : "♡"} {post.likes + (likedPosts.includes(index) ? 1 : 0)}
                    </button>
                    <button className="text-sm text-[#827a89] hover:text-[#75558c]">○ {post.comments} comments</button>
                    <button className="text-sm text-[#827a89] hover:text-[#75558c]">↗ Share</button>
                  </div>
                  <button className="text-lg text-[#827a89] hover:text-[#75558c]" aria-label="Bookmark">♧</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Right sidebar */}
        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-5">
            {/* Suggested creators */}
            <section className="rounded-3xl border border-[#e9e3eb] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-medium">People to discover</h2>
                <Link href="/discover" className="text-xs text-[#75558c]">See all</Link>
              </div>
              <div className="space-y-4">
                {suggestedCreators.map((creator) => (
                  <div key={creator.username} className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: creator.color }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-medium text-[#75558c]"
                    >
                      {creator.letter}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{creator.name}</p>
                      <p className="truncate text-xs text-[#827a89]">{creator.username}</p>
                    </div>
                    <button
                      onClick={() => toggleFollow(creator.username)}
                      className="rounded-full border border-[#dcd2e2] px-3 py-1.5 text-xs text-[#75558c] transition hover:bg-[#eee8f2]"
                    >
                      {following.includes(creator.username) ? "Following" : "Follow"}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Trending tags */}
            <section className="rounded-3xl border border-[#e9e3eb] bg-white p-5">
              <h2 className="mb-4 font-medium">Little things trending</h2>
              <div className="space-y-3">
                {[
                  ["#originalcharacters", "Creative worlds"],
                  ["#fantasy", "Stories & art"],
                  ["#wip", "Works in progress"],
                  ["#indiedev", "Game development"],
                  ["#handmade", "Made by hand"],
                ].map(([tag, description]) => (
                  <Link href="/discover" key={tag} className="block">
                    <p className="text-sm font-medium text-[#75558c]">{tag}</p>
                    <p className="mt-0.5 text-xs text-[#827a89]">{description}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Commissions */}
            <section className="rounded-3xl bg-[#e9e1f0] p-5">
              <span className="text-xl">✧</span>
              <h2 className="mt-2 font-serif text-xl text-[#59406f]">Support a creator</h2>
              <p className="mt-2 text-sm leading-6 text-[#756780]">
                Find artists and creatives offering commissions and bring an idea to life.
              </p>
              <Link href="/commissions" className="mt-4 inline-block text-sm font-medium text-[#75558c] hover:underline">
                Browse commissions →
              </Link>
            </section>

            <footer className="px-2 text-xs leading-6 text-[#a19aa8]">
              About · Guidelines · Privacy · Terms
              <p className="mt-1">© 2026 Kindred</p>
            </footer>
          </div>
        </aside>
      </div>
    </div>
  );
}
