
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";

const listings = [
  {
    id: "1",
    creator: "Moss & Moon",
    username: "@mossandmoon",
    avatar: "M",
    title: "Fantasy character illustration",
    description:
      "Detailed character art with soft colours, magical details and a whimsical atmosphere. I love drawing original characters, fantasy adventurers, witches, woodland creatures and characters with interesting little stories behind them.\n\nEach commission is created individually with care. You can provide references, character descriptions, colour palettes and personality details to help me bring your idea to life.",
    category: "Illustration",
    price: 45,
    turnaround: "7–14 days",
    slots: 3,
    color: "#e9e1f0",
    terms: [
      "Personal use included",
      "Commercial use must be discussed beforehand",
      "Payment is required before work begins",
      "Two minor revisions included",
      "Please provide references when possible",
    ],
  },
  {
    id: "2",
    creator: "PaperCrow",
    username: "@papercrow",
    avatar: "P",
    title: "Short story commission",
    description:
      "A custom short story written around your characters, ideas or prompts. Tell me about your world, characters, themes or the kind of story you want to read, and we can create something together.",
    category: "Writing",
    price: 25,
    turnaround: "5–10 days",
    slots: 5,
    color: "#f2e1e2",
    terms: [
      "Original characters and fictional worlds welcome",
      "Length agreed before work begins",
      "One revision included",
      "Payment before writing begins",
    ],
  },
  {
    id: "3",
    creator: "Little Fern Studio",
    username: "@littlefernstudio",
    avatar: "F",
    title: "Handmade crochet plushie",
    description:
      "A made-to-order little creature, lovingly crocheted in your choice of colours. I make woodland animals, tiny monsters, mushrooms and other cute little friends.",
    category: "Handmade",
    price: 35,
    turnaround: "2–3 weeks",
    slots: 2,
    color: "#e9eee4",
    terms: [
      "Made by hand",
      "Colour choices can be requested",
      "Shipping costs quoted separately",
      "Please allow extra time for handmade work",
    ],
  },
  {
    id: "4",
    creator: "PixelWitch",
    username: "@pixelwitch",
    avatar: "W",
    title: "Pixel art character",
    description:
      "A custom pixel character suitable for indie games, avatars or personal projects. Characters can be designed to match your game's style and palette.",
    category: "Games & Digital",
    price: 20,
    turnaround: "3–7 days",
    slots: 4,
    color: "#e2e7f1",
    terms: [
      "Personal projects included",
      "Game commercial usage must be discussed",
      "Sprite dimensions agreed in advance",
      "One revision included",
    ],
  },
  {
    id: "5",
    creator: "Ink & Ivy",
    username: "@inkandivy",
    avatar: "I",
    title: "Poetry written for you",
    description:
      "A personalised poem inspired by a memory, person, place or feeling. It can be romantic, melancholy, whimsical or whatever emotion you'd like to capture.",
    category: "Writing",
    price: 15,
    turnaround: "3–5 days",
    slots: 6,
    color: "#f1eadc",
    terms: [
      "Tell me the theme or feeling you have in mind",
      "Original writing only",
      "One small revision included",
      "Personal use included",
    ],
  },
  {
    id: "6",
    creator: "Starling Studio",
    username: "@starlingstudio",
    avatar: "S",
    title: "Custom illustrated portrait",
    description:
      "A soft, stylised portrait of you, a friend, a pet or an original character. I work with gentle colours, dreamy textures and expressive details.",
    category: "Illustration",
    price: 60,
    turnaround: "1–2 weeks",
    slots: 1,
    color: "#f0e2e9",
    terms: [
      "One subject included in starting price",
      "Additional subjects may cost extra",
      "Personal use included",
      "Two revisions included",
    ],
  },
];

function CommissionDetailContent() {
  const params = useParams();
  const id = String(params.id);

  const commission = listings.find((item) => item.id === id);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
    budget: "",
    deadline: "",
    references: "",
  });

  if (!commission) {
    return (
      <main className="min-h-screen bg-[#faf8f5] px-6 py-24 text-center text-[#30283a]">
        <h1 className="font-serif text-4xl">Commission not found</h1>
        <p className="mt-4 text-[#827a89]">
          This listing may have been removed or may not exist.
        </p>
        <Link
          href="/commissions"
          className="mt-6 inline-block rounded-full bg-[#75558c] px-6 py-3 text-white"
        >
          Back to commissions
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#30283a]">
      {/* Header */}
      <header className="border-b border-[#e9e3eb] bg-[#faf8f5]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-bold text-[#75558c]">
            kindred<span className="text-[#c59aa6]">.</span>
          </Link>
          <nav className="flex gap-6 text-sm">
            <a href="/home" className="text-[#62596b] hover:text-[#75558c]">Home</a>
            <Link href="/commissions" className="text-[#75558c]">Commissions</Link>
            <a href="/profile" className="text-[#62596b] hover:text-[#75558c]">Profile</a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10">
        {/* Breadcrumb */}
        <Link href="/commissions" className="text-sm text-[#9277a8] hover:underline">
          ← Back to marketplace
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Main listing */}
          <section>
            <div
              style={{ backgroundColor: commission.color }}
              className="flex aspect-[4/3] items-center justify-center rounded-[2rem]"
            >
              <span className="font-serif text-[10rem] text-[#75558c]/60">
                {commission.avatar === "M"
                  ? "✿"
                  : commission.avatar === "P"
                  ? "☾"
                  : commission.avatar === "F"
                  ? "♡"
                  : commission.avatar === "W"
                  ? "✧"
                  : commission.avatar === "I"
                  ? "❀"
                  : "✷"}
              </span>
            </div>

            <div className="mt-8">
              <span className="rounded-full bg-[#eee8f2] px-3 py-1.5 text-xs text-[#75558c]">
                {commission.category}
              </span>

              <h1 className="mt-4 font-serif text-3xl leading-tight md:text-5xl">
                {commission.title}
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <div
                  style={{ backgroundColor: commission.color }}
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg text-[#75558c]"
                >
                  {commission.avatar}
                </div>
                <div>
                  <p className="font-medium">{commission.creator}</p>
                  <p className="text-sm text-[#827a89]">{commission.username}</p>
                </div>
                <a href="/profile" className="ml-auto text-sm text-[#75558c] hover:underline">
                  View profile →
                </a>
              </div>

              <div className="mt-8">
                <h2 className="font-serif text-2xl">About this commission</h2>
                <p className="mt-4 whitespace-pre-line text-base leading-8 text-[#62596b]">
                  {commission.description}
                </p>
              </div>

              <div className="mt-8 rounded-3xl border border-[#e9e3eb] bg-white p-6">
                <h2 className="font-serif text-2xl">Commission terms</h2>
                <ul className="mt-4 space-y-3">
                  {commission.terms.map((term, index) => (
                    <li key={index} className="flex gap-3 text-sm text-[#62596b]">
                      <span className="text-[#9277a8]">✧</span>
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-6 rounded-3xl border border-[#e9e3eb] bg-white p-6">
              <p className="text-sm text-[#827a89]">Starting from</p>
              <h2 className="mt-1 text-4xl font-semibold text-[#59406f]">
                €{commission.price}
              </h2>

              <div className="mt-6 space-y-4 border-y border-[#f0ebf2] py-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#827a89]">Availability</span>
                  <span className="font-medium text-[#587255]">
                    {commission.slots > 0 ? "Open" : "Closed"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#827a89]">Slots remaining</span>
                  <span>{commission.slots}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#827a89]">Turnaround</span>
                  <span>{commission.turnaround}</span>
                </div>
              </div>

              {commission.slots > 0 ? (
                <button
                  onClick={() => setShowRequestForm(!showRequestForm)}
                  className="mt-6 w-full rounded-full bg-[#75558c] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#59406f]"
                >
                  {showRequestForm ? "Hide request form" : "Request a commission"}
                </button>
              ) : (
                <button
                  disabled
                  className="mt-6 w-full cursor-not-allowed rounded-full bg-[#e9e3eb] px-6 py-3.5 text-sm text-[#827a89]"
                >
                  Currently unavailable
                </button>
              )}

              <p className="mt-4 text-center text-xs leading-5 text-[#a19aa8]">
                Submitting a request does not guarantee acceptance. The creator will review your brief first.
              </p>
            </div>
          </aside>
        </div>

        {/* Request form */}
        {showRequestForm && (
          <section className="mt-12 rounded-[2rem] border border-[#e9e3eb] bg-white p-6 md:p-10">
            {requestSent ? (
              <div className="py-8 text-center">
                <span className="text-4xl text-[#75558c]">✧</span>
                <h2 className="mt-4 font-serif text-3xl">Request prepared!</h2>
                <p className="mt-3 text-[#827a89]">
                  Your demo request has been submitted locally. We haven&apos;t connected requests to a database yet.
                </p>
                <button
                  onClick={() => {
                    setRequestSent(false);
                    setShowRequestForm(false);
                  }}
                  className="mt-6 rounded-full border border-[#dcd2e2] px-6 py-3 text-sm text-[#75558c] hover:bg-[#eee8f2]"
                >
                  Return to listing
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#9277a8]">
                  Let&apos;s make something together
                </p>
                <h2 className="mt-3 font-serif text-3xl">Commission request</h2>
                <p className="mt-3 text-sm leading-6 text-[#827a89]">
                  Tell the creator a little about what you have in mind.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setRequestSent(true);
                  }}
                  className="mt-8 grid gap-5 md:grid-cols-2"
                >
                  <div>
                    <label className="mb-2 block text-sm">Your name</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Name or username"
                      className="w-full rounded-xl border border-[#e9e3eb] bg-[#faf8f5] px-4 py-3 text-sm outline-none focus:border-[#b69ac8]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm">Email address</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-[#e9e3eb] bg-[#faf8f5] px-4 py-3 text-sm outline-none focus:border-[#b69ac8]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm">Describe your idea</label>
                    <textarea
                      required
                      rows={5}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="What would you like the creator to make? Include details, ideas, characters, colours or anything else useful..."
                      className="w-full resize-y rounded-xl border border-[#e9e3eb] bg-[#faf8f5] px-4 py-3 text-sm leading-6 outline-none focus:border-[#b69ac8]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm">Your budget (optional)</label>
                    <input
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      placeholder="e.g. €50"
                      className="w-full rounded-xl border border-[#e9e3eb] bg-[#faf8f5] px-4 py-3 text-sm outline-none focus:border-[#b69ac8]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm">Desired deadline (optional)</label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      className="w-full rounded-xl border border-[#e9e3eb] bg-[#faf8f5] px-4 py-3 text-sm outline-none focus:border-[#b69ac8]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm">References or links (optional)</label>
                    <textarea
                      rows={3}
                      value={form.references}
                      onChange={(e) => setForm({ ...form, references: e.target.value })}
                      placeholder="Links to references, inspiration or relevant material..."
                      className="w-full resize-y rounded-xl border border-[#e9e3eb] bg-[#faf8f5] px-4 py-3 text-sm outline-none focus:border-[#b69ac8]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="rounded-full bg-[#75558c] px-8 py-3.5 text-sm font-medium text-white transition hover:bg-[#59406f]"
                    >
                      Submit commission request →
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        )}

        <footer className="mt-16 border-t border-[#e9e3eb] py-8 text-center text-sm text-[#a19aa8]">
          kindred. · A home for people who create.
        </footer>
      </div>
    </main>
  );
}

export default function CommissionDetailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#faf8f5]" />}>
      <CommissionDetailContent />
    </Suspense>
  );
}
