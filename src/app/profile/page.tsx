
"use client";

import Link from "next/link";
import { useState } from "react";

const portfolioItems = [
  { title: "Whispers of the Woods", category: "Digital illustration", color: "#e8e0ef", symbol: "✿" },
  { title: "The Hollow Lighthouse", category: "Character & world design", color: "#f0e0e4", symbol: "☾" },
  { title: "Wildflower Collection", category: "Botanical studies", color: "#e5ebdf", symbol: "❀" },
  { title: "Dreaming in Blue", category: "Experimental art", color: "#e2e7f1", symbol: "✧" },
  { title: "Little Worlds", category: "Concept art", color: "#f1eadc", symbol: "♧" },
  { title: "Midnight Garden", category: "Digital painting", color: "#e9e1f0", symbol: "✷" },
];

const tabs = ["Posts", "Portfolio", "Stories", "Projects", "Commissions"];

export default function CreatorProfile() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("Portfolio");

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#30283a]">
      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Banner */}
        <div className="relative h-48 overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#e9e1f0] via-[#f2e1e2] to-[#e9eee4] md:h-64">
          <div className="absolute left-[12%] top-10 text-5xl text-[#9c80b4]/60">✳</div>
          <div className="absolute right-[15%] top-16 text-6xl text-[#b67d96]/50">✿</div>
          <div className="absolute bottom-8 left-[40%] text-4xl text-[#82967b]/60">✧</div>
          <div className="absolute bottom-5 right-10 font-serif text-2xl italic text-[#75558c]/50">
            a little space to create
          </div>
        </div>

        {/* Profile information */}
        <section className="relative px-5 pb-8">
          <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-[6px] border-[#faf8f5] bg-[#e9e1f0] font-serif text-4xl text-[#75558c] sm:h-32 sm:w-32">
                M
              </div>
              <div className="pb-2">
                <p className="text-sm text-[#827a89]">@mossandmoon</p>
                <h1 className="font-serif text-3xl sm:text-4xl">Moss & Moon</h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 sm:pb-2">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${
                  isFollowing
                    ? "border border-[#dcd2e2] bg-white text-[#75558c]"
                    : "bg-[#75558c] text-white hover:bg-[#59406f]"
                }`}
              >
                {isFollowing ? "Following ✓" : "+ Follow"}
              </button>
              <button className="rounded-full border border-[#dcd2e2] bg-white px-6 py-2.5 text-sm text-[#75558c] transition hover:bg-[#eee8f2]">
                Message
              </button>
              <button aria-label="More profile options" className="rounded-full border border-[#dcd2e2] bg-white px-4 py-2.5 text-[#75558c] hover:bg-[#eee8f2]">
                ···
              </button>
            </div>
          </div>

          <p className="mt-5 max-w-2xl leading-7 text-[#62596b]">
            Illustrator, plant enthusiast and collector of tiny things. I like drawing forests,
            little creatures, magical places and things that feel like they belong in a story.
          </p>

          {/* Creative disciplines */}
          <div className="mt-4 flex flex-wrap gap-2">
            {["Illustration", "Fantasy", "Character design", "Nature", "Digital art"].map((skill) => (
              <span key={skill} className="rounded-full bg-[#eee8f2] px-3.5 py-1.5 text-xs text-[#75558c]">
                {skill}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-[#827a89]">
            <p><strong className="text-[#30283a]">128</strong> posts</p>
            <p><strong className="text-[#30283a]">2.4k</strong> followers</p>
            <p><strong className="text-[#30283a]">316</strong> following</p>
          </div>
        </section>

        {/* Tabs */}
        <div className="border-b border-[#e9e3eb]">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-5 py-4 text-sm transition ${
                  activeTab === tab
                    ? "border-b-2 border-[#75558c] font-medium text-[#75558c]"
                    : "text-[#827a89] hover:text-[#75558c]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <section className="py-8">
          {activeTab === "Portfolio" && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl">Selected works</h2>
                  <p className="mt-1 text-sm text-[#827a89]">A collection of things I&apos;ve made.</p>
                </div>
                <button className="hidden rounded-full border border-[#dcd2e2] px-4 py-2 text-sm text-[#75558c] hover:bg-[#eee8f2] sm:block">
                  View all works
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {portfolioItems.map((item) => (
                  <article key={item.title} className="group cursor-pointer">
                    <div
                      style={{ backgroundColor: item.color }}
                      className="flex aspect-square items-center justify-center rounded-3xl transition group-hover:scale-[0.98]"
                    >
                      <span className="font-serif text-7xl text-[#75558c]/70">{item.symbol}</span>
                    </div>
                    <h3 className="mt-3 text-sm font-medium">{item.title}</h3>
                    <p className="mt-1 text-xs text-[#827a89]">{item.category}</p>
                  </article>
                ))}
              </div>
            </>
          )}

          {activeTab === "Posts" && (
            <div className="rounded-3xl border border-[#e9e3eb] bg-white p-8 text-center">
              <span className="text-3xl text-[#75558c]">✎</span>
              <h2 className="mt-3 font-serif text-2xl">Creator posts</h2>
              <p className="mt-2 text-sm text-[#827a89]">Updates, works in progress and everyday creative moments.</p>
              <a href="/home" className="mt-4 inline-block text-sm text-[#75558c] hover:underline">View community feed →</a>
            </div>
          )}

          {activeTab === "Stories" && (
            <div className="rounded-3xl border border-[#e9e3eb] bg-white p-8 text-center">
              <span className="text-3xl text-[#75558c]">☾</span>
              <h2 className="mt-3 font-serif text-2xl">Stories & writing</h2>
              <p className="mt-2 text-sm text-[#827a89]">Fiction, snippets, poetry and worlds waiting to be explored.</p>
            </div>
          )}

          {activeTab === "Projects" && (
            <div className="rounded-3xl border border-[#e9e3eb] bg-white p-8 text-center">
              <span className="text-3xl text-[#75558c]">✧</span>
              <h2 className="mt-3 font-serif text-2xl">Creative projects</h2>
              <p className="mt-2 text-sm text-[#827a89]">Games, collaborations, ideas and things being built.</p>
            </div>
          )}

          {activeTab === "Commissions" && (
            <div className="rounded-3xl border border-[#e9e3eb] bg-white p-8 text-center">
              <span className="text-3xl text-[#75558c]">♡</span>
              <h2 className="mt-3 font-serif text-2xl">Commission me</h2>
              <p className="mt-2 text-sm text-[#827a89]">Custom work, available slots, pricing and creative services.</p>
              <Link href="/commissions" className="mt-4 inline-block text-sm text-[#75558c] hover:underline">Browse commissions →</Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
