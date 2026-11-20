
import Link from "next/link";

const categories = [
  { name: "Illustration & Art", description: "Discover beautiful creations", icon: "✳", color: "bg-[#eee5f3]" },
  { name: "Writing & Stories", description: "Fall into another world", icon: "✎", color: "bg-[#f4e5e5]" },
  { name: "Crafts & Handmade", description: "Made with love and imagination", icon: "♡", color: "bg-[#e9eee4]" },
  { name: "Games & Projects", description: "Ideas brought to life", icon: "✧", color: "bg-[#e6eaf3]" },
];

const creators = [
  { name: "Moss & Moon", handle: "@mossandmoon", role: "Illustrator · Nature & fantasy", initials: "M", color: "bg-[#e6eadf]" },
  { name: "PaperCrow", handle: "@papercrow", role: "Writer · Fantasy & folklore", initials: "P", color: "bg-[#eee2e9]" },
  { name: "Little Fern Studio", handle: "@littlefernstudio", role: "Craft artist · Crochet", initials: "F", color: "bg-[#e5e6f1]" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#30283a]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#e9e3eb] bg-[#faf8f5]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-3xl font-bold tracking-tight text-[#75558c]">
            kindred<span className="text-[#c59aa6]">.</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#discover" className="text-sm text-[#62596b] transition hover:text-[#75558c]">Explore</a>
            <a href="#creators" className="text-sm text-[#62596b] transition hover:text-[#75558c]">Creators</a>
            <a href="#commissions" className="text-sm text-[#62596b] transition hover:text-[#75558c]">Commissions</a>
            <a href="#community" className="text-sm text-[#62596b] transition hover:text-[#75558c]">Community</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="/login" className="hidden rounded-full px-4 py-2 text-sm font-medium transition hover:bg-[#eee8f2] sm:block">
              Log in
            </a>
            <a href="/signup" className="rounded-full bg-[#75558c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#59406f]">
              Join Kindred
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 md:pb-28 md:pt-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e9e3eb] bg-white px-4 py-2 text-sm text-[#75558c]">
              <span>✳</span> A community for every kind of creative
            </div>

            <h1 className="max-w-xl text-5xl font-semibold leading-[1.12] tracking-tight md:text-7xl">
              A home for
              <span className="block font-serif italic text-[#75558c]">people who create.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-[#827a89]">
              Share your work. Find your people. Support the things you love.
              A little corner of the internet for artists, writers, makers and dreamers.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#discover" className="rounded-full bg-[#75558c] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#59406f]">
                Explore Kindred →
              </a>
              <a href="/signup" className="rounded-full border border-[#dcd2e2] bg-white px-7 py-3.5 text-sm font-medium transition hover:bg-[#eee8f2]">
                Join the community
              </a>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-[#827a89]">
              <div className="flex -space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#faf8f5] bg-[#e6eadf]">🌿</div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#faf8f5] bg-[#eee2e9]">✎</div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#faf8f5] bg-[#e5e6f1]">✧</div>
              </div>
              A space for all kinds of creativity
            </div>
          </div>

          {/* Decorative hero collage */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-[#eee5f3] blur-2xl" />
            <div className="absolute -bottom-6 -left-8 h-40 w-40 rounded-full bg-[#f4e5e5] blur-2xl" />

            <div className="relative grid grid-cols-2 gap-4">
              <div className="flex min-h-[260px] flex-col justify-between rounded-[2rem] bg-[#e9e1f0] p-6">
                <span className="text-3xl text-[#75558c]">✳</span>
                <div>
                  <p className="font-serif text-2xl italic text-[#59406f]">Create freely.</p>
                  <p className="mt-2 text-sm text-[#756780]">Make something that feels like you.</p>
                </div>
              </div>

              <div className="mt-12 flex min-h-[260px] flex-col justify-between rounded-[2rem] bg-[#f2e1e2] p-6">
                <span className="self-end text-3xl text-[#a56e83]">♡</span>
                <div>
                  <p className="font-serif text-2xl italic text-[#865c70]">Find your people.</p>
                  <p className="mt-2 text-sm text-[#99798a]">Inspiration lives in community.</p>
                </div>
              </div>

              <div className="flex min-h-[190px] flex-col justify-between rounded-[2rem] bg-[#e6eaf3] p-6">
                <span className="text-3xl text-[#61749a]">✧</span>
                <p className="font-serif text-xl italic text-[#536583]">Share your world.</p>
              </div>

              <div className="mt-[-2rem] flex min-h-[190px] flex-col justify-between rounded-[2rem] bg-[#e9eee4] p-6">
                <span className="self-end text-3xl text-[#758c70]">☘</span>
                <p className="font-serif text-xl italic text-[#587255]">Grow together.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="discover" className="border-y border-[#e9e3eb] bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#a18baa]">Find your inspiration</p>
              <h2 className="mt-3 font-serif text-4xl tracking-tight">A world of creativity</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#827a89]">
              However you create, there&apos;s a place for you here.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <a
                key={category.name}
                href="/discover"
                className={`${category.color} group rounded-3xl p-6 transition hover:-translate-y-1`}
              >
                <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-2xl text-[#75558c]">
                  {category.icon}
                </div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="mt-2 text-sm text-[#827a89]">{category.description}</p>
                <span className="mt-5 inline-block text-sm text-[#75558c] transition group-hover:translate-x-1">Explore →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

  {/* Creators */}
      <section id="creators" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#a18baa]">Meet the community</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight">People worth discovering</h2>
          </div>
          <a href="/discover" className="hidden text-sm font-medium text-[#75558c] hover:underline sm:block">Discover creators →</a>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {creators.map((creator) => (
            <article key={creator.handle} className="rounded-3xl border border-[#e9e3eb] bg-white p-6 transition hover:shadow-sm">
              <div className={`${creator.color} flex h-24 items-center justify-center rounded-2xl`}>
                <span className="font-serif text-5xl text-[#75558c]">{creator.initials}</span>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{creator.name}</h3>
                  <p className="mt-1 text-sm text-[#827a89]">{creator.handle}</p>
                </div>
                <button className="rounded-full border border-[#dcd2e2] px-4 py-2 text-sm text-[#75558c] transition hover:bg-[#eee8f2]">
                  Follow
                </button>
              </div>
              <p className="mt-4 text-sm text-[#827a89]">{creator.role}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Commissions */}
      <section id="commissions" className="bg-[#eee8f2] py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8c75a4]">Support independent creativity</p>
            <h2 className="mt-4 max-w-lg font-serif text-4xl leading-tight tracking-tight text-[#59406f]">
              Find something special. Commission something yours.
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-[#756780]">
              From custom illustrations and stories to handmade treasures, discover creators offering work and bring your ideas to life.
            </p>
            <Link href="/commissions" className="mt-8 inline-block rounded-full bg-[#75558c] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#59406f]">
              Explore commissions →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex min-h-[210px] flex-col justify-between rounded-3xl bg-[#faf8f5] p-6">
              <span className="text-3xl">✎</span>
              <p className="font-serif text-xl italic text-[#75558c]">Custom artwork</p>
            </div>
            <div className="mt-8 flex min-h-[210px] flex-col justify-between rounded-3xl bg-[#f4e1e5] p-6">
              <span className="text-3xl">♡</span>
              <p className="font-serif text-xl italic text-[#956b7e]">Personal stories</p>
            </div>
            <div className="flex min-h-[180px] flex-col justify-between rounded-3xl bg-[#e4eadf] p-6">
              <span className="text-3xl">✿</span>
              <p className="font-serif text-xl italic text-[#698064]">Handmade gifts</p>
            </div>
            <div className="mt-[-1.5rem] flex min-h-[180px] flex-col justify-between rounded-3xl bg-[#e5e8f2] p-6">
              <span className="text-3xl">✧</span>
              <p className="font-serif text-xl italic text-[#667794]">Creative ideas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="px-6 py-24">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-[#75558c] px-8 py-16 text-center text-white md:px-16">
          <span className="text-4xl">✳</span>
          <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">Creativity is better together.</h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/80">
            Whether you make art, write stories, build games, craft or simply love discovering creative work — there&apos;s a place for you here.
          </p>
          <a href="/signup" className="mt-8 inline-block rounded-full bg-[#faf8f5] px-8 py-3.5 text-sm font-medium text-[#59406f] transition hover:bg-white">
            Find your place in Kindred
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e9e3eb] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-[#75558c]">
            kindred<span className="text-[#c59aa6]">.</span>
          </Link>
          <p className="text-sm text-[#827a89]">A home for people who create.</p>
          <p className="text-sm text-[#827a89]">© 2026 Kindred</p>
        </div>
      </footer>
    </main>
  );
}
