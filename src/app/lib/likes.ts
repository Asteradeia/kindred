const STORAGE_KEY = "kindred-likes";
const EVENT_NAME = "kindred-likes-updated";

export function getLikedPosts(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const storedLikes = localStorage.getItem(STORAGE_KEY);

    if (!storedLikes) return [];

    return JSON.parse(storedLikes) as string[];
  } catch (error) {
    console.error("Could not load likes:", error);
    return [];
  }
}

export function isPostLiked(postId: string): boolean {
  return getLikedPosts().includes(postId);
}

export function toggleLike(postId: string): string[] {
  const likedPosts = getLikedPosts();

  const updatedLikes = likedPosts.includes(postId)
    ? likedPosts.filter((id) => id !== postId)
    : [...likedPosts, postId];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLikes));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (error) {
    console.error("Could not save like:", error);
  }

  return updatedLikes;
}

export function subscribeToLikes(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(EVENT_NAME, callback);

  return () => {
    window.removeEventListener(EVENT_NAME, callback);
  };
}