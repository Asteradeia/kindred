
"use client";
import { useState } from "react";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("Your passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await sendEmailVerification(credential.user);
    } catch (verificationError: unknown) {
      console.error("Error sending email verification:", verificationError);
      setAccountCreated(true);
      setError(
        "Your account was created, but we couldn't send a verification email. Continue to setup and resend it from your account menu.",
      );
      return;
    }

    window.location.assign("/account/setup");
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string };

      if (firebaseError.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (firebaseError.code === "auth/weak-password") {
        setError("Please choose a stronger password.");
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

        <div className="rounded-3xl border border-[#e9e3eb] bg-[#fffdfb] p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl">Join Kindred</h1>
            <p className="mt-2 text-sm text-[#827a89]">
              A little space to create, share and connect.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
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
                placeholder="Create a password"
                required
                minLength={6}
                className="w-full rounded-xl border border-[#dcd2e2] px-4 py-3 text-sm outline-none transition focus:border-[#75558c]"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter your password again"
                required
                minLength={6}
                className="w-full rounded-xl border border-[#dcd2e2] px-4 py-3 text-sm outline-none transition focus:border-[#75558c]"
              />
            </div>

            {error && (
              <p
                role={accountCreated ? "alert" : undefined}
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}
            {accountCreated && (
              <Link
                href="/account/setup"
                className="block text-center text-sm font-medium text-[#75558c] hover:underline"
              >
                Continue to profile setup
              </Link>
            )}
            <button
              type="submit"
              disabled={loading || accountCreated}
              className="w-full rounded-full bg-[#75558c] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#59406f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {accountCreated ? "Account created" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#827a89]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#75558c] hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#a098a5]">
          By joining Kindred, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
