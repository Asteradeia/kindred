"use client";

import Link from "next/link";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("Password reset email sent. Check your inbox for the reset link.");
    } catch (resetError: unknown) {
      console.error("Error sending password reset email:", resetError);

      if (resetError instanceof Error && "code" in resetError) {
        const code = resetError.code;
        if (code === "auth/invalid-email") {
          setError("Enter a valid email address.");
        } else if (code === "auth/user-not-found") {
          setError("We couldn't find an account with that email address.");
        } else if (code === "auth/too-many-requests") {
          setError("Too many requests. Please wait a moment before trying again.");
        } else {
          setError("We couldn't send the reset email. Please try again.");
        }
      } else {
        setError("We couldn't send the reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-5 py-12 text-[#30283a]">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 block text-center text-3xl font-bold tracking-tight text-[#75558c]"
        >
          kindred<span className="text-[#c59aa6]">.</span>
        </Link>

        <section className="rounded-3xl border border-[#e9e3eb] bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl">Reset your password</h1>
            <p className="mt-2 text-sm leading-6 text-[#827a89]">
              Enter the email address on your account and we&apos;ll send you a
              link to choose a new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-[#dcd2e2] px-4 py-3 text-sm outline-none transition focus:border-[#75558c]"
              />
            </div>

            {message && (
              <p
                role="status"
                className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800"
              >
                {message}
              </p>
            )}
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#75558c] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#59406f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending email..." : "Send reset link"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#827a89]">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="font-medium text-[#75558c] hover:underline"
            >
              Log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
