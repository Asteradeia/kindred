
"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  getUserProfile,
  type UserProfile,
} from "@/app/data/userProfiles";
import { getSafeInternalRedirect } from "@/app/data/authRedirect";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setError("");
  setLoading(true);

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    let profile: UserProfile | null;

    try {
      profile = await getUserProfile(credential.user.uid);
    } catch (profileLoadError: unknown) {
      console.error("Error checking profile completion:", profileLoadError);
      setError("We couldn't check your profile. Please try again.");
      return;
    }

    const requestedDestination = getSafeInternalRedirect(
      new URLSearchParams(window.location.search).get("redirect"),
    );
    const destination = profile?.profileComplete
      ? requestedDestination
      : requestedDestination.startsWith("/account/setup")
        ? requestedDestination
        : `/account/setup?redirect=${encodeURIComponent(requestedDestination)}`;

    window.location.assign(destination);
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string };

      if (
        firebaseError.code === "auth/invalid-credential" ||
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/wrong-password"
      ) {
        setError("Your email or password is incorrect.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } else {
      setError("Something went wrong. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-5 py-12 text-[#30283a]">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 block text-center text-3xl font-bold tracking-tight text-[#75558c]"
        >
          kindred<span className="text-[#c59aa6]">.</span>
        </Link>

        <div className="rounded-3xl border border-[#e9e3eb] bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl">Welcome back</h1>
            <p className="mt-2 text-sm text-[#827a89]">
              It's lovely to have you here again.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-[#dcd2e2] px-4 py-3 text-sm outline-none transition focus:border-[#75558c]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                required
                className="w-full rounded-xl border border-[#dcd2e2] px-4 py-3 text-sm outline-none transition focus:border-[#75558c]"
              />
              <Link
                href="/reset-password"
                className="mt-2 inline-block text-sm text-[#75558c] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            {error && (
  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
    {error}
  </p>
)}
            <button
  type="submit"
  disabled={loading}
  className="w-full rounded-full bg-[#75558c] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#59406f] disabled:cursor-not-allowed disabled:opacity-60">
  {loading ? "Logging in..." : "Log in"}
</button>
          </form>

          <p className="mt-6 text-center text-sm text-[#827a89]">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-[#75558c] hover:underline">
              Join Kindred
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
