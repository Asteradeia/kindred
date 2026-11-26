"use client";

import Link from "next/link";
import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  sendEmailVerification,
  updatePassword,
} from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/app/data/AuthContext";
import { deleteUserContent } from "@/app/data/userContent";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  UsernameTakenError,
  deleteUserProfile,
  saveUserProfile,
  type NotificationPreferences,
  type ProfileVisibility,
} from "@/app/data/userProfiles";

function firebaseErrorCode(error: unknown): string | null {
  return error instanceof Error && "code" in error && typeof error.code === "string"
    ? error.code
    : null;
}

function SettingsForm() {
  const router = useRouter();
  const { user, profile, emailVerified, refreshEmailVerification, refreshProfile } =
    useAuth();
  const [displayName, setDisplayName] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [about, setAbout] = useState<string | undefined>();
  const [profileVisibility, setProfileVisibility] =
    useState<ProfileVisibility | undefined>();
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences | undefined>();
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  const currentDisplayName = displayName ?? profile?.displayName ?? "";
  const currentUsername = username ?? profile?.username ?? "";
  const currentAbout = about ?? profile?.about ?? "";
  const currentProfileVisibility =
    profileVisibility ?? profile?.profileVisibility ?? "public";
  const currentNotificationPreferences =
    notificationPreferences ??
    profile?.notificationPreferences ??
    DEFAULT_NOTIFICATION_PREFERENCES;

  if (!user || !profile) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-12 text-sm text-[#827a89]">
        Loading your account settings...
      </main>
    );
  }

  const accountUser = user;
  const accountProfile = profile;

  function setNotificationPreference(
    preference: keyof NotificationPreferences,
    enabled: boolean,
  ) {
    setNotificationPreferences((current) => ({
      ...(current ??
        profile?.notificationPreferences ??
        DEFAULT_NOTIFICATION_PREFERENCES),
      [preference]: enabled,
    }));
  }

  async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");
    setSavingProfile(true);

    try {
      await saveUserProfile(accountUser.uid, {
        displayName: currentDisplayName,
        username: currentUsername,
        about: currentAbout,
        interests: accountProfile.interests,
        profileVisibility: currentProfileVisibility,
        notificationPreferences: currentNotificationPreferences,
      });
      await refreshProfile();
      setProfileMessage("Your account settings have been saved.");
    } catch (error: unknown) {
      console.error("Could not save account settings:", error);
      setProfileError(
        error instanceof UsernameTakenError
          ? error.message
          : error instanceof Error
            ? error.message
            : "We couldn't save your settings. Please try again.",
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleResendVerification() {
    setVerificationMessage("");
    try {
      await sendEmailVerification(accountUser);
      setVerificationMessage(`Verification email sent to ${accountUser.email}.`);
    } catch (error: unknown) {
      console.error("Could not resend verification email:", error);
      setVerificationMessage(
        firebaseErrorCode(error) === "auth/too-many-requests"
          ? "Too many requests. Please wait before trying again."
          : "We couldn't send a verification email. Please try again.",
      );
    }
  }

  async function handleCheckVerification() {
    setVerificationMessage("");
    try {
      const verified = await refreshEmailVerification();
      setVerificationMessage(
        verified
          ? "Your email address is verified."
          : "Your email address is not verified yet.",
      );
    } catch (error: unknown) {
      console.error("Could not refresh email verification:", error);
      setVerificationMessage("We couldn't check your status. Please try again.");
    }
  }

  async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (!accountUser.email) {
      setPasswordError("A password change isn't available for this account.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Your new password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Your new passwords don't match.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(accountUser.email, currentPassword);
      await reauthenticateWithCredential(accountUser, credential);
      await updatePassword(accountUser, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordMessage("Your password has been updated.");
    } catch (error: unknown) {
      console.error("Could not change password:", error);
      const code = firebaseErrorCode(error);
      setPasswordError(
        code === "auth/wrong-password" || code === "auth/invalid-credential"
          ? "Your current password is incorrect."
          : code === "auth/weak-password"
            ? "Choose a stronger password."
            : "We couldn't update your password. Please try again.",
      );
    } finally {
      setUpdatingPassword(false);
    }
  }

  async function handleDeleteAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDeleteError("");

    if (deleteConfirmation !== "DELETE") {
      setDeleteError('Type "DELETE" to confirm account deletion.');
      return;
    }
    if (!accountUser.email) {
      setDeleteError(
        "Account deletion requires an email and password sign-in. Please contact support.",
      );
      return;
    }

    setDeletingAccount(true);
    try {
      const credential = EmailAuthProvider.credential(accountUser.email, deletePassword);
      await reauthenticateWithCredential(accountUser, credential);
      await deleteUserContent(accountUser.uid);
      await deleteUserProfile(accountUser.uid);
      await deleteUser(accountUser);
      router.replace("/");
    } catch (error: unknown) {
      console.error("Could not delete account:", error);
      const code = firebaseErrorCode(error);
      setDeleteError(
        code === "auth/wrong-password" || code === "auth/invalid-credential"
          ? "Your password is incorrect."
          : "We couldn't complete account deletion. Please try again or contact support.",
      );
    } finally {
      setDeletingAccount(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] px-5 py-10 text-[#30283a]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link href="/home" className="text-sm text-[#75558c] hover:underline">
            ← Back to Kindred
          </Link>
          <h1 className="mt-4 font-serif text-4xl">Account settings</h1>
          <p className="mt-2 text-sm text-[#827a89]">
            Update your profile, security, and preferences.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-[#e9e3eb] bg-white p-6 sm:p-8">
            <h2 className="font-serif text-2xl">Account</h2>
            <form onSubmit={handleSaveProfile} className="mt-5 space-y-5">
              <div>
                <label htmlFor="settings-email" className="mb-2 block text-sm font-medium">
                  Email address
                </label>
                <input
                  id="settings-email"
                  value={accountUser.email ?? ""}
                  readOnly
                  className="w-full rounded-xl border border-[#e9e3eb] bg-[#faf8f5] px-4 py-3 text-sm text-[#827a89]"
                />
              </div>
              <div>
                <label htmlFor="settings-display-name" className="mb-2 block text-sm font-medium">
                  Display name
                </label>
                <input
                  id="settings-display-name"
                  value={currentDisplayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  maxLength={50}
                  required
                  className="w-full rounded-xl border border-[#dcd2e2] px-4 py-3 text-sm outline-none focus:border-[#75558c]"
                />
              </div>
              <div>
                <label htmlFor="settings-username" className="mb-2 block text-sm font-medium">
                  Username
                </label>
                <div className="flex items-center rounded-xl border border-[#dcd2e2] px-4 focus-within:border-[#75558c]">
                  <span className="text-sm text-[#827a89]">@</span>
                  <input
                    id="settings-username"
                    value={currentUsername}
                    onChange={(event) =>
                      setUsername(event.target.value.replace(/^@/, "").toLowerCase())
                    }
                    maxLength={20}
                    required
                    className="w-full bg-transparent px-2 py-3 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="settings-about" className="mb-2 block text-sm font-medium">
                  Biography
                </label>
                <textarea
                  id="settings-about"
                  value={currentAbout}
                  onChange={(event) => setAbout(event.target.value)}
                  maxLength={200}
                  rows={4}
                  className="w-full resize-y rounded-xl border border-[#dcd2e2] px-4 py-3 text-sm outline-none focus:border-[#75558c]"
                />
                <p className="mt-1 text-right text-xs text-[#a098a5]">
                  {currentAbout.length}/200
                </p>
              </div>

              <div className="border-t border-[#eee8f0] pt-5">
                <h3 className="font-medium">Email verification</h3>
                <p className="mt-1 text-sm text-[#827a89]">
                  {accountUser.email} · {emailVerified ? "Verified" : "Not verified"}
                </p>
                {!emailVerified && (
                  <div className="mt-3 flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      className="text-sm text-[#75558c] hover:underline"
                    >
                      Resend verification email
                    </button>
                    <button
                      type="button"
                      onClick={handleCheckVerification}
                      className="text-sm text-[#75558c] hover:underline"
                    >
                      Check verification status
                    </button>
                  </div>
                )}
                {verificationMessage && (
                  <p role="status" className="mt-2 text-sm text-[#75558c]">
                    {verificationMessage}
                  </p>
                )}
              </div>

              <div className="border-t border-[#eee8f0] pt-5">
                <h3 className="font-medium">Profile visibility</h3>
                <p className="mt-1 text-sm text-[#827a89]">
                  Private profiles are hidden from public profile links in Kindred.
                </p>
                <label className="mt-3 flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={currentProfileVisibility === "private"}
                    onChange={(event) =>
                      setProfileVisibility(event.target.checked ? "private" : "public")
                    }
                    className="h-4 w-4 accent-[#75558c]"
                  />
                  Make my profile private
                </label>
              </div>

              <div className="border-t border-[#eee8f0] pt-5">
                <h3 className="font-medium">In-app notification preferences</h3>
                <p className="mt-1 text-sm text-[#827a89]">
                  Choose which activity notifications you want to receive.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["likes", "Likes"],
                      ["comments", "Comments"],
                      ["follows", "Follows"],
                      ["commissions", "Commissions"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={currentNotificationPreferences[key]}
                        onChange={(event) =>
                          setNotificationPreference(key, event.target.checked)
                        }
                        className="h-4 w-4 accent-[#75558c]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {profileError && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {profileError}
                </p>
              )}
              {profileMessage && (
                <p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
                  {profileMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={savingProfile}
                className="rounded-full bg-[#75558c] px-6 py-3 text-sm font-medium text-white hover:bg-[#59406f] disabled:opacity-60"
              >
                {savingProfile ? "Saving..." : "Save account settings"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-[#e9e3eb] bg-white p-6 sm:p-8">
            <h2 className="font-serif text-2xl">Security</h2>
            <p className="mt-1 text-sm text-[#827a89]">
              Changing your password requires your current password.
            </p>
            <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
              <label className="block text-sm font-medium">
                Current password
                <input
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-[#dcd2e2] px-4 py-3 text-sm outline-none focus:border-[#75558c]"
                />
              </label>
              <label className="block text-sm font-medium">
                New password
                <input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={6}
                  required
                  className="mt-2 w-full rounded-xl border border-[#dcd2e2] px-4 py-3 text-sm outline-none focus:border-[#75558c]"
                />
              </label>
              <label className="block text-sm font-medium">
                Confirm new password
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmNewPassword}
                  onChange={(event) => setConfirmNewPassword(event.target.value)}
                  minLength={6}
                  required
                  className="mt-2 w-full rounded-xl border border-[#dcd2e2] px-4 py-3 text-sm outline-none focus:border-[#75558c]"
                />
              </label>
              {passwordError && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {passwordError}
                </p>
              )}
              {passwordMessage && (
                <p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
                  {passwordMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={updatingPassword}
                className="rounded-full border border-[#dcd2e2] px-6 py-3 text-sm font-medium text-[#75558c] hover:bg-[#f7f3f8] disabled:opacity-60"
              >
                {updatingPassword ? "Updating..." : "Change password"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-red-200 bg-white p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-red-800">Delete account</h2>
            <p className="mt-2 text-sm leading-6 text-[#827a89]">
              This permanently deletes your Firebase account, profile, posts,
              comments, uploaded images, and username. Legacy demo content is
              unaffected.
              Shared posts and other browser-stored activity are not removed.
            </p>
            <form onSubmit={handleDeleteAccount} className="mt-5 space-y-4">
              <label className="block text-sm font-medium">
                Current password
                <input
                  type="password"
                  autoComplete="current-password"
                  value={deletePassword}
                  onChange={(event) => setDeletePassword(event.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-[#e5bebe] px-4 py-3 text-sm outline-none focus:border-red-500"
                />
              </label>
              <label className="block text-sm font-medium">
                Type DELETE to confirm
                <input
                  value={deleteConfirmation}
                  onChange={(event) => setDeleteConfirmation(event.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-[#e5bebe] px-4 py-3 text-sm outline-none focus:border-red-500"
                />
              </label>
              {deleteError && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {deleteError}
                </p>
              )}
              <button
                type="submit"
                disabled={deletingAccount}
                className="rounded-full bg-red-700 px-6 py-3 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-60"
              >
                {deletingAccount ? "Deleting account..." : "Delete my account"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsForm />
    </ProtectedRoute>
  );
}
