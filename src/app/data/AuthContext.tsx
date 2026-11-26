
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  reload,
  type User,
} from "firebase/auth";
import { getUserProfile, type UserProfile } from "@/app/data/userProfiles";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profile: UserProfile | null;
  profileLoading: boolean;
  profileError: string | null;
  emailVerified: boolean;
  refreshEmailVerification: () => Promise<boolean>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  profile: null,
  profileLoading: true,
  profileError: null,
  emailVerified: false,
  refreshEmailVerification: async () => false,
  refreshProfile: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);

  async function refreshEmailVerification() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setEmailVerified(false);
      return false;
    }

    await reload(currentUser);
    setEmailVerified(currentUser.emailVerified);
    return currentUser.emailVerified;
  }

  async function refreshProfile(): Promise<UserProfile | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setProfile(null);
      return null;
    }

    const updatedProfile = await getUserProfile(currentUser.uid);
    if (auth.currentUser?.uid === currentUser.uid) {
      setProfile(updatedProfile);
    }
    return updatedProfile;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      setEmailVerified(currentUser?.emailVerified ?? false);

      if (!currentUser) {
        setProfile(null);
        setProfileLoading(false);
        setProfileError(null);
        return;
      }

      setProfile(null);
      setProfileLoading(true);
      setProfileError(null);

      void getUserProfile(currentUser.uid)
        .then((currentProfile) => {
          if (auth.currentUser?.uid === currentUser.uid) {
            setProfile(currentProfile);
          }
        })
        .catch((error: unknown) => {
          if (auth.currentUser?.uid !== currentUser.uid) {
            return;
          }

          console.error("Error loading Kindred profile:", error);
          setProfileError("We couldn't load your profile. Please try again.");
        })
        .finally(() => {
          if (auth.currentUser?.uid === currentUser.uid) {
            setProfileLoading(false);
          }
        });
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        profile,
        profileLoading,
        profileError,
        emailVerified,
        refreshEmailVerification,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
