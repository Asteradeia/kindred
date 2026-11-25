import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const CREATIVE_INTERESTS = [
  "Illustration",
  "Writing",
  "Crafts",
  "Game development",
] as const;

export type CreativeInterest = (typeof CREATIVE_INTERESTS)[number];

export interface UserProfile {
  uid: string;
  displayName: string;
  username: string;
  usernameNormalized: string;
  about: string;
  interests: CreativeInterest[];
  profileComplete: boolean;
}

export interface UserProfileInput {
  displayName: string;
  username: string;
  about: string;
  interests: CreativeInterest[];
}

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
const RESERVED_USERNAMES = new Set([
  "mossandmoon",
  "papercrow",
  "littlefernstudio",
  "pixelwitch",
  "inkandivy",
  "starlingstudio",
]);

export class UsernameTakenError extends Error {
  constructor() {
    super("That username is already taken.");
    this.name = "UsernameTakenError";
  }
}

export function normalizeUsername(username: string): string {
  return username.trim().replace(/^@/, "").toLowerCase();
}

export function isValidUsername(username: string): boolean {
  return USERNAME_PATTERN.test(normalizeUsername(username));
}

function isCreativeInterest(value: unknown): value is CreativeInterest {
  return CREATIVE_INTERESTS.some((interest) => interest === value);
}

function parseUserProfile(uid: string, data: Record<string, unknown>): UserProfile {
  const displayName =
    typeof data.displayName === "string" ? data.displayName : "";
  const username = typeof data.username === "string" ? data.username : "";
  const usernameNormalized =
    typeof data.usernameNormalized === "string"
      ? data.usernameNormalized
      : normalizeUsername(username);
  const about = typeof data.about === "string" ? data.about : "";
  const interests = Array.isArray(data.interests)
    ? data.interests.filter(isCreativeInterest)
    : [];

  return {
    uid,
    displayName,
    username,
    usernameNormalized,
    about,
    interests,
    profileComplete:
      data.profileComplete === true &&
      displayName.trim().length > 0 &&
      USERNAME_PATTERN.test(usernameNormalized),
  };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? parseUserProfile(uid, snapshot.data()) : null;
}

export async function getUserProfileByUsername(
  username: string,
): Promise<UserProfile | null> {
  const normalizedUsername = normalizeUsername(username);

  if (!USERNAME_PATTERN.test(normalizedUsername)) {
    return null;
  }

  const usernameSnapshot = await getDoc(
    doc(db, "usernames", normalizedUsername),
  );

  if (!usernameSnapshot.exists()) {
    return null;
  }

  const uid: unknown = usernameSnapshot.data().uid;
  if (typeof uid !== "string" || !uid) {
    throw new Error("The username record does not contain a valid user ID.");
  }

  const profile = await getUserProfile(uid);
  return profile?.profileComplete ? profile : null;
}

export async function isUsernameAvailable(
  username: string,
  currentUid: string,
): Promise<boolean> {
  const normalizedUsername = normalizeUsername(username);

  if (
    !USERNAME_PATTERN.test(normalizedUsername) ||
    RESERVED_USERNAMES.has(normalizedUsername)
  ) {
    return false;
  }

  const snapshot = await getDoc(doc(db, "usernames", normalizedUsername));
  return !snapshot.exists() || snapshot.data().uid === currentUid;
}

export async function saveUserProfile(
  uid: string,
  input: UserProfileInput,
): Promise<UserProfile> {
  const displayName = input.displayName.trim();
  const usernameNormalized = normalizeUsername(input.username);
  const about = input.about.trim();

  if (!displayName || displayName.length > 50) {
    throw new Error("Display name must be between 1 and 50 characters.");
  }
  if (!USERNAME_PATTERN.test(usernameNormalized)) {
    throw new Error(
      "Username must be 3–20 characters using lowercase letters, numbers, or underscores.",
    );
  }
  if (about.length > 200) {
    throw new Error("Your biography must be 200 characters or fewer.");
  }
  if (RESERVED_USERNAMES.has(usernameNormalized)) {
    throw new UsernameTakenError();
  }

  const usernameRef = doc(db, "usernames", usernameNormalized);
  const userRef = doc(db, "users", uid);
  const interests = [...new Set(input.interests.filter(isCreativeInterest))];

  await runTransaction(db, async (transaction) => {
    const [usernameSnapshot, userSnapshot] = await Promise.all([
      transaction.get(usernameRef),
      transaction.get(userRef),
    ]);

    if (
      usernameSnapshot.exists() &&
      usernameSnapshot.data().uid !== uid
    ) {
      throw new UsernameTakenError();
    }

    const previousUsername = userSnapshot.exists()
      ? userSnapshot.data().usernameNormalized
      : null;

    if (
      typeof previousUsername === "string" &&
      previousUsername !== usernameNormalized
    ) {
      const previousUsernameRef = doc(db, "usernames", previousUsername);
      const previousUsernameSnapshot =
        await transaction.get(previousUsernameRef);

      if (
        previousUsernameSnapshot.exists() &&
        previousUsernameSnapshot.data().uid === uid
      ) {
        transaction.delete(previousUsernameRef);
      }
    }

    transaction.set(usernameRef, {
      uid,
      username: usernameNormalized,
      updatedAt: serverTimestamp(),
    });
    transaction.set(
      userRef,
      {
        uid,
        displayName,
        username: usernameNormalized,
        usernameNormalized,
        about,
        interests,
        profileComplete: true,
        ...(userSnapshot.exists() ? {} : { createdAt: serverTimestamp() }),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });

  return {
    uid,
    displayName,
    username: usernameNormalized,
    usernameNormalized,
    about,
    interests,
    profileComplete: true,
  };
}
