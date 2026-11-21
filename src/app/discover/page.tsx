"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBookmarks, toggleBookmark } from "@/app/lib/bookmarks";
import {
  getLikedPosts,
  toggleLike,
  subscribeToLikes,
} from "@/app/lib/likes";

const categories = [
  "All",
  "Art",
  "Crafts",
  "Writing",
  "Gaming",
  "Photography",
  "Cosplay",
  "DIY",
  "Music",
];

const pins = [
  {
    id: "scroll-1",
    title: "A little corner of my fantasy world",
    creator: "Moss & Moon",
    username: "mossandmoon",
    category: "Art",
    tags: ["fantasy", "worldbuilding"],
    artwork: "🌙",
    height: "h-64",
    colour: "from-[#e8dced] to-[#d8c5e4]",
    description: "Building a world filled with forests, magic and strange little creatures.",
  },
  {
    id: "scroll-2",
    title: "The things we leave unsaid",
    creator: "PaperCrow",
    username: "papercrow",
    category: "Writing",
    tags: ["poetry", "writing"],
    artwork: "📖",
    height: "h-80",
    colour: "from-[#eee3d7] to-[#ddcbb9]",
    description: "A little piece of poetry from my notebook.",
  },
  {
    id: "scroll-3",
    title: "My tiny forest game is growing",
    creator: "PixelWitch",
    username: "pixelwitch",
    category: "Gaming",
    tags: ["gamedev", "cozygames"],
    artwork: "🌲",
    height: "h-72",
    colour: "from-[#dce8dc] to-[#c4d9c7]",
    description: "Some progress on the little world I've been making.",
  },
  {
    id: "scroll-4",
    title: "A collection of handmade friends",
    creator: "Little Fern Studio",
    username: "littlefernstudio",
    category: "Crafts",
    tags: ["crochet", "handmade"],
    artwork: "🧸",
    height: "h-60",
    colour: "from-[#f0e5d9] to-[#e4cdb9]",
    description: "A few tiny creatures made by hand, one stitch at a time.",
  },
  {
    id: "scroll-5",
    title: "A quiet afternoon of painting",
    creator: "Moss & Moon",
    username: "mossandmoon",
    category: "Art",
    tags: ["painting", "sketchbook"],
    artwork: "🎨",
    height: "h-80",
    colour: "from-[#e9d9d3] to-[#d6b9ad]",
    description: "Messy palettes, paint-covered hands and a slow afternoon.",
  },
  {
    id: "scroll-6",
    title: "Little moments on film",
    creator: "Starling Studio",
    username: "starlingstudio",
    category: "Photography",
    tags: ["photography", "nature"],
    artwork: "🌼",
    height: "h-56",
    colour: "from-[#f0ead2] to-[#d8d6b5]",
    description: "Collecting little moments that I don't want to forget.",
  },
  {
    id: "scroll-7",
    title: "Designing my next character",
    creator: "PixelWitch",
    username: "pixelwitch",
    category: "Gaming",
    tags: ["characterdesign", "gamedev"],
    artwork: "🧙",
    height: "h-64",
    colour: "from-[#dedff0] to-[#c6c9e0]",
    description: "Character concepts for my next game project.",
  },
  {
    id: "scroll-8",
    title: "A handmade little cottage",
    creator: "Little Fern Studio",
    username: "littlefernstudio",
    category: "Crafts",
    tags: ["miniatures", "handmade"],
    artwork: "🏡",
    height: "h-80",
    colour: "from-[#dce8d8] to-[#c6d6bb]",
    description: "Working on a miniature cottage full of tiny details.",
  },
  {
    id: "scroll-9",
    title: "Notes from another world",
    creator: "PaperCrow",
    username: "papercrow",
    category: "Writing",
    tags: ["fantasy", "worldbuilding"],
    artwork: "🗝️",
    height: "h-60",
    colour: "from-[#e4ddec] to-[#cfc2df]",
    description: "Maps, notes and scraps of lore for a story I'm writing.",
  },
  {
    id: "scroll-10",
    title: "Making something from nothing",
    creator: "Starling Studio",
    username: "starlingstudio",
    category: "DIY",
    tags: ["diy", "creative"],
    artwork: "🪡",
    height: "h-72",
    colour: "from-[#e8ddd2] to-[#d3bda9]",
    description: "A little project made from things I already had lying around.",
  },
];

const trendingTags = [
  "fantasy",
  "worldbuilding",
  "digitalart",
  "oc",
  "cozygames",
  "poetry",
  "crochet",
  "writing",
  "characterdesign",
  "gamedev",
  "books",
  "witchcraft",
];

const creators = [
  {
    username: "mossandmoon",
    name: "Moss & Moon",
    bio: "Illustrator of strange little things and magical worlds.",
    category: "Art",
    initials: "MM",
    colour: "bg-[#e8dfed]",
  },
  {
    username: "papercrow",
    name: "PaperCrow",
    bio: "Stories, poetry and worlds that linger.",
    category: "Writing",
    initials: "PC",
    colour: "bg-[#e9e2d8]",
  },
  {
    username: "pixelwitch",
    name: "PixelWitch",
    bio: "Making tiny worlds, one pixel at a time.",
    category: "Gaming",
    initials: "PW",
    colour: "bg-[#dedff0]",
  },
  {
    username: "littlefernstudio",
    name: "Little Fern Studio",
    bio: "Handmade things with a little bit of love.",
    category: "Crafts",
    initials: "LF",
    colour: "bg-[#e1eadf]",
  },
];

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [savedPosts, setSavedPosts] = useState<(string | number)[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

  useEffect(() => {
    const bookmarks = getBookmarks();
    queueMicrotask(() =>
      setSavedPosts(bookmarks.map((post) => post.id))
    );
  }, []);

  useEffect(() => {
    queueMicrotask(() => setLikedPostIds(getLikedPosts()));

    const unsubscribe = subscribeToLikes(() => {
      setLikedPostIds(getLikedPosts());
    });

    return unsubscribe;
  }, []);

  const filteredPins = pins.filter((pin) => {
    const matchesCategory =
      activeCategory === "All" || pin.category === activeCategory;

    const searchTerm = search.toLowerCase().trim();

    const matchesSearch =
      searchTerm === "" ||
      pin.title.toLowerCase().includes(searchTerm) ||
      pin.creator.toLowerCase().includes(searchTerm) ||
      pin.description.toLowerCase().includes(searchTerm) ||
      pin.tags.some((tag) => tag.toLowerCase().includes(searchTerm));

    return matchesCategory && matchesSearch;
  });

  const filteredCreators = creators.filter((creator) => {
    const matchesCategory =
      activeCategory === "All" || creator.category === activeCategory;

    const matchesSearch =
      search.trim() === "" ||
      creator.name.toLowerCase().includes(search.toLowerCase()) ||
      creator.bio.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  function handleLike(pin: (typeof pins)[number]) {
    setLikedPostIds(toggleLike(String(pin.id)));
  }

  function handleSave(pin: (typeof pins)[number]) {
    const post = {
      id: pin.id,
      creator: pin.creator,
      username: pin.username,
      avatar: pin.creator.slice(0, 1),
      avatarColor: "bg-[#e8dfed]",
      time: "Recently",
      content: pin.description,
      tags: pin.tags,
      likes: 0,
      comments: 0,
    };

toggleBookmark(post);

setSavedPosts(getBookmarks().map((item) => item.id));
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#45384e]">
      <div className="mx-auto max-w-[1600px] px-5 py-8 md:px-10">

        {/* Header */}
        <header className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#9277a8]">
            A little inspiration
          </p>

          <h1 className="font-serif text-4xl font-medium md:text-5xl">
            Scroll
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#827a89]">
            Find something lovely, discover new ideas and explore the things
            people create.
          </p>
        </header>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#9277a8]">
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search creations, crafts, creators and ideas..."
              className="w-full rounded-2xl border border-[#e5dce8] bg-white py-4 pl-12 pr-5 text-sm outline-none transition focus:border-[#9277a8] focus:ring-2 focus:ring-[#9277a8]/10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm transition ${
                activeCategory === category
                  ? "border-[#75558c] bg-[#75558c] text-white"
                  : "border-[#e5dce8] bg-white text-[#65556f] hover:border-[#9277a8] hover:bg-[#f0eaf4]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Trending Tags */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-serif text-lg">Popular right now</h2>
            <span className="text-sm text-[#9277a8]">✦</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {trendingTags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="shrink-0 rounded-full bg-[#f0eaf3] px-4 py-2 text-xs text-[#75558c] transition hover:bg-[#e6dceb]"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </section>

        {/* Masonry Feed */}
        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl">Made by the community</h2>
              <p className="mt-1 text-sm text-[#827a89]">
                Art, ideas and little things worth saving.
              </p>
            </div>

            <span className="text-sm text-[#9277a8]">
              {filteredPins.length} creations
            </span>
          </div>

          {filteredPins.length === 0 ? (
            <div className="rounded-2xl border border-[#e5dce8] bg-white p-10 text-center text-[#827a89]">
              Nothing found. Try another search or category.
            </div>
          ) : (
            <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
              {filteredPins.map((pin) => (
                <article
                  key={pin.id}
                  className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-[#e9e1eb] bg-white transition hover:shadow-md"
                >
                  {/* Artwork */}
                  <div
                    className={`relative flex ${pin.height} items-center justify-center bg-gradient-to-br ${pin.colour}`}
                  >
                    <span className="text-7xl transition duration-300 hover:scale-110">
                      {pin.artwork}
                    </span>

                    {/* Save Button */}
                    <button
                      onClick={() => handleSave(pin)}
                      aria-label={
                        savedPosts.includes(pin.id)
                          ? "Remove bookmark"
                          : "Save creation"
                      }
                      title={
                        savedPosts.includes(pin.id)
                          ? "Saved"
                          : "Save to bookmarks"
                      }
                      className={`absolute right-3 top-3 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition ${
                        savedPosts.includes(pin.id)
                          ? "bg-[#75558c] text-white"
                          : "bg-white/90 text-[#75558c] hover:bg-[#75558c] hover:text-white"
                      }`}
                    >
                      {savedPosts.includes(pin.id) ? "♥ Saved" : "♡ Save"}
                    </button>
                  </div>

                  {/* Pin Details */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium leading-snug">
                      {pin.title}
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-[#827a89]">
                      {pin.description}
                    </p>

                    {/* Tags */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {pin.tags.slice(0, 2).map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${encodeURIComponent(tag)}`}
                          className="text-[11px] text-[#9277a8] hover:underline"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>

                    {/* Like Button */}
                    <div className="mt-3">
                      <button
                        onClick={() => handleLike(pin)}
                        aria-label={
                          likedPostIds.includes(String(pin.id))
                            ? "Unlike creation"
                            : "Like creation"
                        }
                        className={`text-sm transition ${
                          likedPostIds.includes(String(pin.id))
                            ? "text-[#b66d8a]"
                            : "text-[#827a89] hover:text-[#b66d8a]"
                        }`}
                      >
                        {likedPostIds.includes(String(pin.id)) ? "♥" : "♡"}{" "}
                        {likedPostIds.includes(String(pin.id)) ? 1 : 0}
                      </button>
                    </div>

                    {/* Creator */}
                    <Link
                      href={`/u/${pin.username}`}
                      className="mt-3 flex items-center gap-2 border-t border-[#f0ebf2] pt-3 text-xs text-[#827a89] transition hover:text-[#75558c]"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eee7f1] text-[10px] font-medium text-[#75558c]">
                        {pin.creator.charAt(0)}
                      </span>
                      {pin.creator}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Creators */}
        <section className="mt-14">
          <div className="mb-5">
            <h2 className="font-serif text-2xl">Find your kindred</h2>
            <p className="mt-1 text-sm text-[#827a89]">
              Meet the people behind the creations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCreators.map((creator) => (
              <Link
                key={creator.username}
                href={`/u/${creator.username}`}
                className="flex items-center gap-3 rounded-2xl border border-[#e9e1eb] bg-white p-4 transition hover:border-[#c8b6d6] hover:shadow-sm"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${creator.colour} font-serif text-[#75558c]`}
                >
                  {creator.initials}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium">
                    {creator.name}
                  </h3>
                  <p className="text-xs text-[#9277a8]">{creator.category}</p>
                  <p className="mt-1 truncate text-xs text-[#827a89]">
                    {creator.bio}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom Banner */}
        <section className="mt-12 rounded-3xl border border-[#e6dce9] bg-[#eee7f1] px-7 py-9 md:px-12">
          <p className="text-xs uppercase tracking-widest text-[#9277a8]">
            Your creative community
          </p>

          <h2 className="mt-3 font-serif text-3xl">
            There&apos;s a place for what you make.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#756a7c]">
            Whether you write stories, paint, make games, craft, photograph or
            simply love creating, there&apos;s room for you here.
          </p>

          <Link
            href="/home"
            className="mt-6 inline-block rounded-full bg-[#75558c] px-6 py-3 text-sm text-white transition hover:bg-[#59406f]"
          >
            Back to your feed
          </Link>
        </section>
      </div>
    </main>
  );
}