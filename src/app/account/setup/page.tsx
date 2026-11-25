"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/app/data/AuthContext";
import { getSafeInternalRedirect } from "@/app/data/authRedirect";
import {
  CREATIVE_INTERESTS,
  isUsernameAvailable,
  isValidUsername,
  normalizeUsername,
  saveUserProfile,
  UsernameTakenError,
  type CreativeInterest,
} from "@/app/data/userProfiles";

type AvailabilityStatus = "available" | "taken" | "error";

function AccountSetupForm() {
  const { user, profile, emailVerified } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [about, setAbout] = useState(profile?.about ?? "");
  const [interests, setInterests] = useState<CreativeInterest[]>(
    profile?.interests ?? [],
  );
  const [availability, setAvailability] = useState<{
    username: string;
    status: AvailabilityStatus;
  } | null>(null);
  const [availabilityRetry, setAvailabilityRetry] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const normalizedUsername = normalizeUsername(username);
  const validUsername = isValidUsername(normalizedUsername);
  const availabilityStatus =
    availability?.username === normalizedUsername
      ? availability.status
      : validUsername
        ? "checking"
        : "idle";

  useEffect(() => {
    const uid = user?.uid;
    if (!uid || !validUsername) {
      return;
    }

    let cancelled = false;
    const timeout = window.setTimeout(() => {
      void isUsernameAvailable(normalizedUsername, uid)
        .then((isAvailable) => {
          if (!cancelled) {
            setAvailability({
              username: normalizedUsername,
              status: isAvailable ? "available" : "taken",
            });
          }
        })
        .catch((availabilityError: unknown) => {
          if (cancelled) {
            return;
          }

          console.error("Error checking username availability:", availabilityError);
          setAvailability({ username: normalizedUsername, status: "error" });
        });
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [availabilityRetry, normalizedUsername, user?.uid, validUsername]);

  function toggleInterest(interest: CreativeInterest) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!user) {
      setError("Please log in again before saving your profile.");
      return;
    }
    if (!displayName.trim()) {
      setError("Enter a display name to continue.");
      return;
    }
    if (!validUsername) {
      setError("Choose a valid username to continue.");
      return;
    }
    if (availabilityStatus !== "available") {
      setError("Wait for the username availability check before continuing.");
      return;
    }

    setSaving(true);
    try {
      await saveUserProfile(user.uid, {
        displayName,
        username: normalizedUsername,
        about,
        interests,
      });

      const redirect = getSafeInternalRedirect(
        new URLSearchParams(window.location.search).get("redirect"),
      );
      window.location.assign(redirect);
    } catch (saveError: unknown) {
      if (saveError instanceof UsernameTakenError) {
        setAvailability({ username: normalizedUsername, status: "taken" });
        setError("That username was just taken. Choose another one.");
      } else {
        console.error("Error saving Kindred profile:", saveError);
        setError("We couldn't save your profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] px-5 py-12 text-[#30283a]">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/"
          className="mb-8 block text-center text-3xl font-bold tracking-tight text-[#75558c]"
        >
          kindred<span className="text-[#c59aa6]">.</span>
        </Link>

        <section className="rounded-3xl border border-[#e9e3eb] bg-[#fffdfb] p-6 shadow-sm sm:p-9">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#9277a8]">
              Your creative corner
            </p>
            <h1 className="mt-2 font-serif text-3xl">Set up your Kindred profile</h1>
            <p className="mt-3 text-sm leading-6 text-[#827a89]">
              Give the community a name to know you by and a little glimpse of
              what you love to create.
            </p>
            <p
              role="status"
              className="mt-4 rounded-xl bg-[#f3eef6] px-4 py-3 text-sm text-[#62596b]"
            >
              Email verification:{" "}
              <span className="font-medium">
                {emailVerified ? "verified" : "not verified"}
              </span>
              {!emailVerified &&
                " — check your inbox or resend the email from your account menu."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="displayName"
                className="mb-2 block text-sm font-medium"
              >
                Display name
              </label>
              <input
                id="displayName"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your name or chosen display name"
                maxLength={50}
                required
                className="w-full rounded-xl border border-[#dcd2e2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#75558c]"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium"
              >
                Username
              </label>
              <div className="flex items-center rounded-xl border border-[#dcd2e2] bg-white px-4 focus-within:border-[#75558c]">
                <span className="text-sm text-[#827a89]">@</span>
                <input
                  id="username"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value.replace(/^@/, "").toLowerCase())
                  }
                  placeholder="yourusername"
                  autoComplete="username"
                  maxLength={20}
                  required
                  aria-describedby="username-help username-status"
                  className="w-full bg-transparent px-2 py-3 text-sm outline-none"
                />
              </div>
              <p id="username-help" className="mt-2 text-xs text-[#827a89]">
                Your unique username will be used in your Kindred profile URL.
                Use 3–20 lowercase letters, numbers, or underscores.
              </p>
              <p
                id="username-status"
                aria-live="polite"
                className={`mt-1 text-xs ${
                  availabilityStatus === "taken" ||
                  availabilityStatus === "error" ||
                  (!validUsername && username)
                    ? "text-red-600"
                    : "text-[#75558c]"
                }`}
              >
                {!validUsername && username
                  ? "Use 3–20 lowercase letters, numbers, or underscores."
                  : availabilityStatus === "checking"
                    ? "Checking username availability..."
                    : availabilityStatus === "available"
                      ? "Username is available."
                      : availabilityStatus === "taken"
                        ? "That username is already in use."
                        : availabilityStatus === "error"
                          ? "Couldn't check availability. Try again."
                          : ""}
              </p>
              {availabilityStatus === "error" && (
                <button
                  type="button"
                  onClick={() => setAvailabilityRetry((count) => count + 1)}
                  className="mt-2 text-xs font-medium text-[#75558c] underline"
                >
                  Check again
                </button>
              )}
            </div>

            <div>
              <label htmlFor="about" className="mb-2 block text-sm font-medium">
                About you
              </label>
              <textarea
                id="about"
                value={about}
                onChange={(event) => setAbout(event.target.value)}
                placeholder="Tell the community a little about yourself..."
                maxLength={200}
                rows={4}
                className="w-full resize-y rounded-xl border border-[#dcd2e2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#75558c]"
              />
              <p className="mt-1 text-right text-xs text-[#a098a5]">
                {about.length}/200
              </p>
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-medium">
                Creative interests
              </legend>
              <div className="flex flex-wrap gap-2">
                {CREATIVE_INTERESTS.map((interest) => {
                  const selected = interests.includes(interest);
                  return (
                    <label
                      key={interest}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition ${
                        selected
                          ? "border-[#75558c] bg-[#eee8f2] text-[#59406f]"
                          : "border-[#e9e3eb] bg-white text-[#62596b] hover:bg-[#faf8f5]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleInterest(interest)}
                        className="sr-only"
                      />
                      {interest}
                    </label>
                  );
                })}
              </div>
            </fieldset>

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
              disabled={
                saving ||
                !displayName.trim() ||
                !validUsername ||
                availabilityStatus !== "available"
              }
              className="w-full rounded-full bg-[#75558c] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#59406f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving profile..." : "Continue to Kindred"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default function AccountSetupPage() {
  return (
    <ProtectedRoute allowIncompleteProfile>
      <AccountSetupForm />
    </ProtectedRoute>
  );
}
