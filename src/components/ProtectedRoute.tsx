"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/data/AuthContext";

export default function ProtectedRoute({
  children,
  allowIncompleteProfile = false,
}: {
  children: ReactNode;
  allowIncompleteProfile?: boolean;
}) {
  const { user, loading, profile, profileLoading, profileError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      const requestedPage = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      router.replace(`/login?redirect=${encodeURIComponent(requestedPage)}`);
      return;
    }

    if (profileLoading || profileError) {
      return;
    }

    if (allowIncompleteProfile && profile?.profileComplete) {
      router.replace("/home");
    } else if (!allowIncompleteProfile && !profile?.profileComplete) {
      const requestedPage = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      router.replace(
        `/account/setup?redirect=${encodeURIComponent(requestedPage)}`,
      );
    }
  }, [
    allowIncompleteProfile,
    loading,
    profile?.profileComplete,
    profileError,
    profileLoading,
    router,
    user,
  ]);

  if (loading || !user || profileLoading) {
    return (
      <main
        className="flex min-h-[40vh] items-center justify-center bg-[#faf8f5] text-sm text-[#827a89]"
        role="status"
      >
        {loading || profileLoading
          ? "Checking your account..."
          : "Redirecting to log in..."}
      </main>
    );
  }

  if (profileError) {
    return (
      <main
        className="flex min-h-[40vh] items-center justify-center bg-[#faf8f5] px-5 text-center text-sm text-[#827a89]"
        role="alert"
      >
        {profileError}
      </main>
    );
  }

  if (allowIncompleteProfile && profile?.profileComplete) {
    return (
      <main
        className="flex min-h-[40vh] items-center justify-center bg-[#faf8f5] text-sm text-[#827a89]"
        role="status"
      >
        Taking you to your home feed...
      </main>
    );
  }

  if (!allowIncompleteProfile && !profile?.profileComplete) {
    return (
      <main
        className="flex min-h-[40vh] items-center justify-center bg-[#faf8f5] text-sm text-[#827a89]"
        role="status"
      >
        Taking you to account setup...
      </main>
    );
  }

  return children;
}
