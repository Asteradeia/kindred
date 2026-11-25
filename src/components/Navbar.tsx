"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBasket } from "@/app/data/BasketContext";
import { useAuth } from "@/app/data/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const { items } = useBasket();
  const { user } = useAuth();
  const handleLogout = async () => {
  try {
    await signOut(auth);
    router.push("/login");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const basketCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e3eb] bg-[#faf8f5]/95 backdrop-blur">
      <nav className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-6 px-5">

        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-3xl font-bold tracking-tight text-[#30283a]"
        >
          kindred<span className="text-[#c59aa6]">.</span>
        </Link>

        {/* Main navigation */}
        <div className="hidden items-center gap-7 text-sm font-medium text-[#62596b] md:flex">
          <Link href="/discover" className="transition hover:text-[#75558c]">
            Explore
          </Link>

          <Link href="/discover" className="transition hover:text-[#75558c]">
            Creators
          </Link>

          <Link href="/commissions" className="transition hover:text-[#75558c]">
            Commissions
          </Link>

          <Link href="/home" className="transition hover:text-[#75558c]">
            Community
          </Link>

          <Link href="/archive" className="transition hover:text-[#75558c]">
            Marketplace
          </Link>
        </div>

                {/* Right side */}
        <div className="flex items-center gap-3">

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (search.trim()) {
                router.push(`/search?query=${encodeURIComponent(search.trim())}`);
              }
            }}
            className="hidden lg:block"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Kindred..."
              className="w-44 rounded-full border border-[#e9e3eb] bg-white px-4 py-2 text-sm outline-none transition focus:border-[#b69ac8]"
            />
          </form>

          {/* Notifications */}
          <Link
            href="/notifications"
            title="Notifications"
            aria-label="Notifications"
            className="group flex h-10 w-10 items-center justify-center rounded-full text-[#75558c] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#eee8f5]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>
          </Link>

          {/* Messages */}
          <Link
            href="/messages"
            title="Messages"
            aria-label="Messages"
            className="group flex h-10 w-10 items-center justify-center rounded-full text-[#75558c] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#eee8f5]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </Link>

          {/* Basket */}
          <Link
            href="/basket"
            title="Basket"
            aria-label={`Basket, ${basketCount} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#75558c] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#eee8f5]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M6 7h12l1 14H5L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>

            {basketCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 -translate-y-0.5 translate-x-0.5 items-center justify-center rounded-full bg-[#75558c] px-1 text-[10px] font-medium text-white">
                {basketCount}
              </span>
            )}
          </Link>

          {/* Profile dropdown */}
<div className="relative">
  <button
    type="button"
    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
    title="Profile menu"
    aria-label="Open profile menu"
    aria-expanded={isProfileMenuOpen}
    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9e1f0] font-medium text-[#75558c] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d9c9e5] hover:ring-2 hover:ring-[#d9c9e5]">
    K
  </button>
  {isProfileMenuOpen && (
    <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-[#e9e3eb] bg-[#fffdfb] p-3 shadow-lg">
      
      {user ? (
        <>
      {/* Account */}
      <div className="border-b border-[#e9e3eb] py-2">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#a098a5]">
          Your account
        </p>

        <Link
          href="/profile"
          onClick={() => setIsProfileMenuOpen(false)}
          className="block rounded-xl px-3 py-2 text-sm text-[#62596b] hover:bg-[#f3eef6]"
        >
          My profile
        </Link>

        <Link
          href="/settings"
          onClick={() => setIsProfileMenuOpen(false)}
          className="block rounded-xl px-3 py-2 text-sm text-[#62596b] hover:bg-[#f3eef6]"
        >
          Account settings
        </Link>
      </div>

      {/* Creative activity */}
      <div className="border-b border-[#e9e3eb] py-2">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#a098a5]">
          Creative activity
        </p>

        <Link
          href="/engagement"
          onClick={() => setIsProfileMenuOpen(false)}
          className="block rounded-xl px-3 py-2 text-sm text-[#62596b] hover:bg-[#f3eef6]"
        >
          Post engagement
        </Link>

        <Link
          href="/bookmarks"
          onClick={() => setIsProfileMenuOpen(false)}
          className="block rounded-xl px-3 py-2 text-sm text-[#62596b] hover:bg-[#f3eef6]"
        >
          Saved items
        </Link>
      </div>

      {/* Creator tools */}
      <div className="border-b border-[#e9e3eb] py-2">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#a098a5]">
          Creator tools
        </p>

        <Link
          href="/creator-dashboard"
          onClick={() => setIsProfileMenuOpen(false)}
          className="block rounded-xl px-3 py-2 text-sm text-[#62596b] hover:bg-[#f3eef6]"
        >
          Creator dashboard
        </Link>

        <Link
          href="/my-listings"
          onClick={() => setIsProfileMenuOpen(false)}
          className="block rounded-xl px-3 py-2 text-sm text-[#62596b] hover:bg-[#f3eef6]"
        >
          My marketplace listings
        </Link>
      </div>
        </>
      ) : (
        <div className="py-2">
          <Link
            href="/login"
            onClick={() => setIsProfileMenuOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm text-[#62596b] hover:bg-[#f3eef6]"
          >
            Log in
          </Link>

          <Link
            href="/register"
            onClick={() => setIsProfileMenuOpen(false)}
            className="block rounded-xl bg-[#75558c] px-3 py-2 text-center text-sm font-medium text-white hover:bg-[#59406f]"
          >
            Join Kindred
          </Link>
        </div>
      )}
          {/* Logout */}
          {user && (
            <div className="mt-2 border-t border-[#e9e3eb] pt-3">
              <button
                onClick={handleLogout}
                className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-[#75558c] hover:bg-[#eee8f2]">
                Log out
              </button>
            </div>
          )}
    </div>
  )}
</div>

        </div>
      </nav>
    </header>
  );
}