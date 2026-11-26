import {
  doc,
  deleteField,
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
export type ProfileVisibility = "public" | "private";

export interface NotificationPreferences {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  commissions: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  likes: true,
  comments: true,
  follows: true,
  commissions: true,
};

export interface UserProfile {
  uid: string;
  displayName: string;
  username: string;
  usernameNormalized: string;
  about: string;
  interests: CreativeInterest[];
  profileVisibility: ProfileVisibility;
  notificationPreferences: NotificationPreferences;
  profileComplete: boolean;
}

export interface UserProfileInput {
  displayName: string;
  username: string;
  about: string;
  interests: CreativeInterest[];
  profileVisibility?: ProfileVisibility;
  notificationPreferences?: NotificationPreferences;
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

function parseNotificationPreferences(value: unknown): NotificationPreferences {
  const data =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {};

  return {
    likes:
      typeof data.likes === "boolean"
        ? data.likes
        : DEFAULT_NOTIFICATION_PREFERENCES.likes,
    comments:
      typeof data.comments === "boolean"
        ? data.comments
        : DEFAULT_NOTIFICATION_PREFERENCES.comments,
    follows:
      typeof data.follows === "boolean"
        ? data.follows
        : DEFAULT_NOTIFICATION_PREFERENCES.follows,
    commissions:
      typeof data.commissions === "boolean"
        ? data.commissions
        : DEFAULT_NOTIFICATION_PREFERENCES.commissions,
  };
}

function parseUserProfile(
  uid: string,
  data: Record<string, unknown>,
  privateSettings: Record<string, unknown> = {},
): UserProfile {
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
  const notificationPreferences = parseNotificationPreferences(
    privateSettings.notificationPreferences,
  );

  return {
    uid,
    displayName,
    username,
    usernameNormalized,
    about,
    interests,
    profileVisibility:
      data.profileVisibility === "private" ? "private" : "public",
    notificationPreferences,
    profileComplete:
      data.profileComplete === true &&
      displayName.trim().length > 0 &&
      USERNAME_PATTERN.test(usernameNormalized),
  };
}

export async function getUserProfile(
  uid: string,
  includePrivateSettings = true,
): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    return null;
  }

  const privateSettingsRef = doc(db, "users", uid, "private", "settings");
  let userData = snapshot.data();
  let privateSettings = includePrivateSettings
    ? await getDoc(privateSettingsRef)
    : null;

  if (includePrivateSettings && userData.notificationPreferences !== undefined) {
    const userRef = doc(db, "users", uid);
    await runTransaction(db, async (transaction) => {
      const [latestUser, latestSettings] = await Promise.all([
        transaction.get(userRef),
        transaction.get(privateSettingsRef),
      ]);
      if (!latestUser.exists()) return;

      const legacyPreferences = latestUser.data().notificationPreferences;
      if (legacyPreferences === undefined) return;

      const currentPrivatePreferences = latestSettings.exists()
        ? latestSettings.data().notificationPreferences
        : undefined;
      transaction.set(
        privateSettingsRef,
        {
          notificationPreferences: parseNotificationPreferences(
            currentPrivatePreferences ?? legacyPreferences,
          ),
        },
        { merge: true },
      );
      transaction.update(userRef, {
        notificationPreferences: deleteField(),
      });
    });

    const refreshed = await Promise.all([
      getDoc(userRef),
      getDoc(privateSettingsRef),
    ]);
    if (!refreshed[0].exists()) return null;
    userData = refreshed[0].data();
    privateSettings = refreshed[1];
  }

  return parseUserProfile(
    uid,
    userData,
    privateSettings?.data() ?? {},
  );
}

export async function getUserProfileByUsername(
  username: string,
  requesterUid?: string,
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

  let profile: UserProfile | null;
  try {
    profile = await getUserProfile(uid, requesterUid === uid);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "permission-denied"
    ) {
      return null;
    }
    throw error;
  }
  return profile?.profileComplete &&
    (profile.profileVisibility === "public" || profile.uid === requesterUid)
    ? profile
    : null;
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
  const privateSettingsRef = doc(db, "users", uid, "private", "settings");
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
        profileVisibility: input.profileVisibility ?? "public",
        profileComplete: true,
        ...(userSnapshot.exists() ? {} : { createdAt: serverTimestamp() }),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    if (input.notificationPreferences) {
      transaction.set(
        privateSettingsRef,
        { notificationPreferences: input.notificationPreferences },
        { merge: true },
      );
    }
  });

  return {
    uid,
    displayName,
    username: usernameNormalized,
    usernameNormalized,
    about,
    interests,
    profileVisibility: input.profileVisibility ?? "public",
    notificationPreferences:
      input.notificationPreferences ?? DEFAULT_NOTIFICATION_PREFERENCES,
    profileComplete: true,
  };
}

export async function deleteUserProfile(uid: string): Promise<void> {
  const userRef = doc(db, "users", uid);
  const privateSettingsRef = doc(db, "users", uid, "private", "settings");

  await runTransaction(db, async (transaction) => {
    const [userSnapshot, privateSettingsSnapshot] = await Promise.all([
      transaction.get(userRef),
      transaction.get(privateSettingsRef),
    ]);
    const username =
      userSnapshot.exists() &&
      typeof userSnapshot.data().usernameNormalized === "string"
        ? userSnapshot.data().usernameNormalized
        : null;

    if (username) {
      const usernameRef = doc(db, "usernames", username);
      const usernameSnapshot = await transaction.get(usernameRef);

      if (usernameSnapshot.exists() && usernameSnapshot.data().uid === uid) {
        transaction.delete(usernameRef);
      }
    }

    if (userSnapshot.exists()) {
      transaction.delete(userRef);
    }
    if (privateSettingsSnapshot.exists()) {
      transaction.delete(privateSettingsRef);
    }
  });
}
