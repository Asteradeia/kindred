
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";

const creators = {
  mossandmoon: {
    name: "Moss & Moon",
    username: "mossandmoon",
    avatar: "M",
    banner: "a little space to create",
    bio: "Illustrator, plant enthusiast and collector of tiny things. I like drawing forests, little creatures, magical places and things that feel like they belong in a story.",
    interests: ["Illustration", "Fantasy", "Character design", "Nature", "Digital art"],
    posts: 128,
    followers: "2.4k",
    following: 316,
    color: "#e9e1f0",
    commissions: [
      { id: "1", title: "Fantasy character illustration", price: 45, category: "Illustration", status: "Open" },
    ],
    portfolio: ["Forest spirits", "Character studies", "Little magical creatures"],
  },
  papercrow: {
    name: "PaperCrow",
    username: "papercrow",
    avatar: "P",
    banner: "stories stitched from imagination",
    bio: "Writer of fantasy, strange little tales and stories about people who probably need therapy. Original worlds, characters and the occasional poem.",
    interests: ["Writing", "Fantasy", "Poetry", "Worldbuilding"],
    posts: 86,
    followers: "1.8k",
    following: 204,
    color: "#f2e1e2",
    commissions: [
      { id: "2", title: "Short story commission", price: 25, category: "Writing", status: "Open" },
      { id: "5", title: "Poetry written for you", price: 15, category: "Writing", status: "Open" },
    ],
    portfolio: ["The Hollow Crown", "A collection of poems", "Worldbuilding"],
  },
  littlefernstudio: {
    name: "Little Fern Studio",
    username: "littlefernstudio",
    avatar: "F",
    banner: "handmade with a little love",
    bio: "Making tiny woodland friends, crochet creatures, handmade gifts and soft little things. Everything is made slowly and with care.",
    interests: ["Crochet", "Handmade", "Crafts", "Cute things"],
    posts: 54,
    followers: 892,
    following: 172,
    color: "#e9eee4",
    commissions: [
      { id: "3", title: "Handmade crochet plushie", price: 35, category: "Handmade", status: "Open" },
    ],
    portfolio: ["Woodland creatures", "Tiny frogs", "Custom plushies"],
  },
  pixelwitch: {
    name: "PixelWitch",
    username: "pixelwitch",
    avatar: "W",
    banner: "small pixels, big worlds",
    bio: "Indie game developer and pixel artist. Creating tiny characters, little environments and cosy worlds for games.",
    interests: ["Pixel art", "Game development", "Indie games", "Animation"],
    posts: 72,
    followers: 1240,
    following: 245,
    color: "#e2e7f1",
    commissions: [
      { id: "4", title: "Pixel art character", price: 20, category: "Games & Digital", status: "Open" },
    ],
    portfolio: ["Pixel characters", "Game sprites", "Environment tiles"],
  },
  inkandivy: {
    name: "Ink & Ivy",
    username: "inkandivy",
    avatar: "I",
    banner: "words for feelings without names",
    bio: "Poetry, little pieces of prose and words for the things we don't always know how to say.",
    interests: ["Poetry", "Writing", "Literature", "Romance"],
    posts: 42,
    followers: 760,
    following: 158,
    color: "#f1eadc",
    commissions: [
      { id: "5", title: "Poetry written for you", price: 15, category: "Writing", status: "Open" },
    ],
    portfolio: ["Poetry collection", "Letters never sent", "Little verses"],
  },
  starlingstudio: {
    name: "Starling Studio",
    username: "starlingstudio",
    avatar: "S",
    banner: "dreamy things in soft colours",
    bio: "Illustrator creating dreamy portraits, expressive characters and soft-coloured artwork.",
    interests: ["Illustration", "Portraits", "Digital art", "Character art"],
    posts: 96,
    followers: "3.1k",
    following: 402,
    color: "#f0e2e9",
    commissions: [
      { id: "6", title: "Custom illustrated portrait", price: 60, category: "Illustration", status: "Open" },
    ],
    portfolio: ["Portraits", "Character illustrations", "Colour studies"],
  },
};

type Creator = (typeof creators)[keyof typeof creators];

function CreatorProfileContent() {
  const params = useParams();
  const username = String(params.username).toLowerCase();

  const creator = creators[username as keyof typeof creators] as Creator | undefined;

  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("Posts");

  if (!creator) {
    return (
      <main className="min-h-screen bg-[#faf8f5] px-6 py-24 text-center text-[#30283a]">
        <h1 className="font-serif text-4xl">Creator not found</h1>
        <p className="mt-4 text-[#827a89]">
          We couldn&apos;t find this creative corner.
        </p>
        <Link
          href="/commissions"
          className="mt-6 inline-block rounded-full bg-[#75558c] px-6 py-3 text-white"
        >
          Explore creators
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#30283a]">
      {/* Navigation */}
      <header className="border-b border-[#e9e3eb]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-bold">
            kindred<span className="text-[#c59aa6]">.</span>
          </Link>

          <nav className="flex gap-6 text-sm">
            <Link href="/home" className="hover:text-[#75558c]">Home</Link>
            <Link href="/commissions" className="hover:text-[#75558c]">Commissions</Link>
            <Link href="/discover" className="hover:text-[#75558c]">Discover</Link>
          </nav>

          <a href="/home" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9e1f0] text-[#75558c]">
            K
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10">
        {/* Banner */}
        <section
          style={{ backgroundColor: creator.color }}
          className="relative h-64 overflow-hidden rounded-[2rem] md:h-80"
        >
          <div className="absolute left-12 top-12 text-5xl text-[#a98ebc]">✳</div>
          <div className="absolute right-20 top-16 text-5xl text-[#b69ac8]">✿</div>
          <div className="absolute bottom-8 right-12 font-serif text-xl italic text-[#9277a8] md:text-3xl">
            {creator.banner}
          </div>
        </section>

        {/* Profile heading */}
        <section className="relative px-4 pb-8">
          <div
            style={{ backgroundColor: creator.color }}
            className="-mt-16 flex h-32 w-32 items-center justify-center rounded-full border-8 border-[#faf8f5] font-serif text-5xl text-[#75558c] md:h-40 md:w-40"
          >
            {creator.avatar}
          </div>

          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-[#827a89]">@{creator.username}</p>
              <h1 className="font-serif text-4xl md:text-5xl">{creator.name}</h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFollowing(!following)}
                className={`rounded-full px-7 py-3 text-sm transition ${
                  following
                    ? "border border-[#dcd2e2] bg-white text-[#75558c]"
                    : "bg-[#75558c] text-white hover:bg-[#59406f]"
                }`}
              >
                {following ? "✓ Following" : "+ Follow"}
              </button>

              <button
                onClick={() => alert("Messaging will be implemented in a later stage!")}
                className="rounded-full border border-[#dcd2e2] bg-white px-7 py-3 text-sm text-[#75558c] hover:bg-[#eee8f2]"
              >
                Message
              </button>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-7 max-w-3xl text-base leading-8 text-[#62596b]">
            {creator.bio}
          </p>

          {/* Interests */}
          <div className="mt-5 flex flex-wrap gap-2">
            {creator.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-[#eee8f2] px-4 py-2 text-sm text-[#75558c]"
              >
                {interest}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-8 text-sm">
            <p><strong>{creator.posts}</strong> posts</p>
            <p><strong>{creator.followers}</strong> followers</p>
            <p><strong>{creator.following}</strong> following</p>
          </div>
        </section>

        {/* Profile tabs */}
        <section className="mt-6 border-b border-[#e9e3eb]">
          <div className="flex gap-2 overflow-x-auto">
            {["Posts", "Portfolio", "Stories", "Projects", "Commissions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-6 py-4 text-sm transition ${
                  activeTab === tab
                    ? "border-b-2 border-[#75558c] text-[#75558c]"
                    : "text-[#827a89] hover:text-[#75558c]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* Tab content */}
        <section className="py-10">
          {activeTab === "Posts" && (
            <div className="rounded-3xl border border-[#e9e3eb] bg-white p-8 text-center">
              <span className="text-4xl text-[#b69ac8]">✧</span>
              <h2 className="mt-3 font-serif text-2xl">A little corner of creativity</h2>
              <p className="mt-3 text-[#827a89]">
                Creator posts will appear here when the feed system is connected.
              </p>
            </div>
          )}

          {activeTab === "Portfolio" && (
            <div>
              <h2 className="mb-6 font-serif text-3xl">Selected work</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {creator.portfolio.map((item, index) => (
                  <div
                    key={item}
                    style={{ backgroundColor: creator.color }}
                    className="flex min-h-56 items-center justify-center rounded-3xl p-6 text-center"
                  >
                    <div>
                      <span className="text-4xl text-[#9277a8]">✧</span>
                      <p className="mt-4 font-serif text-xl">{item}</p>
                      <p className="mt-2 text-sm text-[#827a89]">Portfolio piece {index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Stories" && (
            <div className="rounded-3xl border border-[#e9e3eb] bg-white p-8 text-center">
              <h2 className="font-serif text-2xl">Stories</h2>
              <p className="mt-3 text-[#827a89]">Published stories will appear here.</p>
            </div>
          )}

          {activeTab === "Projects" && (
            <div className="rounded-3xl border border-[#e9e3eb] bg-white p-8 text-center">
              <h2 className="font-serif text-2xl">Creative projects</h2>
              <p className="mt-3 text-[#827a89]">Collaborations and projects will appear here.</p>
            </div>
          )}

          {activeTab === "Commissions" && (
            <div>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-serif text-3xl">Available commissions</h2>
                  <p className="mt-2 text-sm text-[#827a89]">
                    Support {creator.name} and bring your ideas to life.
                  </p>
                </div>
              </div>

              {creator.commissions.length === 0 ? (
                <div className="rounded-3xl border border-[#e9e3eb] bg-white p-8 text-center text-[#827a89]">
                  No commission listings yet.
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {creator.commissions.map((commission) => (
                    <article
                      key={commission.id}
                      className="overflow-hidden rounded-3xl border border-[#e9e3eb] bg-white"
                    >
                      <div
                        style={{ backgroundColor: creator.color }}
                        className="flex h-44 items-center justify-center font-serif text-6xl text-[#9277a8]"
                      >
                        ✿
                      </div>

                      <div className="p-5">
                        <span className="text-xs text-[#9277a8]">{commission.category}</span>
                        <h3 className="mt-2 font-serif text-xl">{commission.title}</h3>
                        <div className="mt-5 flex items-center justify-between">
                          <span className="font-semibold text-[#59406f]">From €{commission.price}</span>
                          <a
                            href={`/commissions/${commission.id}`}
                            className="rounded-full bg-[#75558c] px-5 py-2.5 text-sm text-white hover:bg-[#59406f]"
                          >
                            View details →
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function CreatorProfilePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#faf8f5]" />}>
      <CreatorProfileContent />
    </Suspense>
  );
}
