"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification, type User } from "firebase/auth";
import { useBasket } from "@/app/data/BasketContext";
import { useAuth } from "@/app/data/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

function EmailVerificationStatus({
  user,
  emailVerified,
  refreshEmailVerification,
}: {
  user: User;
  emailVerified: boolean;
  refreshEmailVerification: () => Promise<boolean>;
}) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "checking" | "sent" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function resendVerificationEmail() {
    setStatus("sending");
    setMessage("");

    try {
      await sendEmailVerification(user);
      setStatus("sent");
      setMessage(`Verification email sent to ${user.email}.`);
    } catch (error: unknown) {
      console.error("Error resending email verification:", error);
      setStatus("error");
      setMessage(
        error instanceof Error &&
          "code" in error &&
          error.code === "auth/too-many-requests"
          ? "Too many requests. Please wait before trying again."
          : "We couldn't send a verification email. Please try again.",
      );
    }
  }

  async function checkVerificationStatus() {
    setStatus("checking");
    setMessage("");

    try {
      const verified = await refreshEmailVerification();
      setStatus(verified ? "sent" : "idle");
      setMessage(
        verified
          ? "Your email address is verified."
          : "Your email address is not verified yet.",
      );
    } catch (error: unknown) {
      console.error("Error refreshing email verification status:", error);
      setStatus("error");
      setMessage("We couldn't refresh your verification status. Please retry.");
    }
  }

  return (
    <div className="border-b border-[#e9e3eb] px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#a098a5]">
        Email verification
      </p>
      <p className="mt-1 text-sm text-[#62596b]">
        {emailVerified ? "Verified" : "Not verified"}
      </p>
      {!emailVerified && user.email && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={resendVerificationEmail}
            disabled={status === "sending"}
            className="text-left text-xs font-medium text-[#75558c] hover:underline disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "Resend verification email"}
          </button>
          <button
            type="button"
            onClick={checkVerificationStatus}
            disabled={status === "checking"}
            className="text-left text-xs font-medium text-[#75558c] hover:underline disabled:opacity-60"
          >
            {status === "checking" ? "Checking..." : "Check status"}
          </button>
        </div>
      )}
      {!user.email && (
        <p className="mt-1 text-xs text-[#827a89]">
          This account has no email address to verify.
        </p>
      )}
      {message && (
        <p
          role={status === "error" ? "alert" : "status"}
          className={`mt-2 text-xs ${
            status === "error" ? "text-red-600" : "text-[#75558c]"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default function Navbar() {
  const { items } = useBasket();
  const {
    user,
    profile,
    emailVerified,
    refreshEmailVerification,
  } = useAuth();
  const router = useRouter();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const [search, setSearch] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !profileMenuRef.current?.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
        profileButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileMenuOpen]);

  const profileInitial =
    profile?.displayName.trim().charAt(0) ||
    user?.displayName?.trim().charAt(0) ||
    user?.email?.trim().charAt(0) ||
    "K";
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
          <div className="relative" ref={profileMenuRef}>
            <button
              ref={profileButtonRef}
              type="button"
              onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
              title="Profile menu"
              aria-label={
                isProfileMenuOpen ? "Close profile menu" : "Open profile menu"
              }
              aria-expanded={isProfileMenuOpen}
              aria-controls="profile-menu"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e9e1f0] font-medium uppercase text-[#75558c] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d9c9e5] hover:ring-2 hover:ring-[#d9c9e5]"
            >
              {profileInitial}
              {user?.photoURL && (
                <Image
                  key={user.photoURL}
                  src={user.photoURL}
                  width={40}
                  height={40}
                  alt=""
                  unoptimized
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                  className="absolute inset-0 h-full w-full object-cover"/>
              )}
            </button>
            {isProfileMenuOpen && (
              <div
                id="profile-menu"
                className="absolute right-0 top-12 z-50 max-h-[calc(100dvh-6rem)] w-[min(18rem,calc(100vw-2.5rem))] overflow-y-auto overscroll-contain rounded-2xl border border-[#e9e3eb] bg-[#fffdfb] p-3 shadow-lg">
                {user ? (
                  <>
                    {/* Account */}
                    <div className="border-b border-[#e9e3eb] py-2">
                      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#a098a5]">
                        Your account
                      </p>

                      <Link
                        href={
                          profile?.profileComplete
                            ? `/u/${encodeURIComponent(profile.username)}`
                            : "/account/setup"
                        }
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm text-[#62596b] hover:bg-[#f3eef6]">
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
                {user && (
                  <>
                    <EmailVerificationStatus
                      user={user}
                      emailVerified={emailVerified}
                      refreshEmailVerification={refreshEmailVerification}
                    />
                    <div className="mt-2 border-t border-[#e9e3eb] pt-3">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-[#75558c] hover:bg-[#eee8f2]"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </nav>
    </header>
  );
}