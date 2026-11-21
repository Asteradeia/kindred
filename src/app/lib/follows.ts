const STORAGE_KEY = "kindred-follows";
const EVENT_NAME = "kindred-follows-updated";

export function getFollowedCreators(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    return JSON.parse(stored) as string[];
  } catch (error) {
    console.error("Could not load followed creators:", error);
    return [];
  }
}

export function isFollowing(username: string): boolean {
  const normalizedUsername = username.replace("@", "").toLowerCase();

  return getFollowedCreators().some(
    (name) => name.replace("@", "").toLowerCase() === normalizedUsername
  );
}

export function toggleFollow(username: string): string[] {
  const followed = getFollowedCreators();

  const updated = followed.includes(username)
    ? followed.filter((name) => name !== username)
    : [...followed, username];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (error) {
    console.error("Could not save followed creators:", error);
  }

  return updated;
}

export function subscribeToFollows(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(EVENT_NAME, callback);

  return () => window.removeEventListener(EVENT_NAME, callback);
}