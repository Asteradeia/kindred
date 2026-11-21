export type KindredPost = {
  id: string | number;
  creator: string;
  username: string;
  avatar: string;
  avatarColor: string;
  content: string;
  tags: string[];
  image?: string;
  time: string;
  likes: number;
  comments: number;
};

const BOOKMARKS_KEY = "kindred-bookmarks";

export function getBookmarks(): KindredPost[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(BOOKMARKS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function isBookmarked(id: string | number): boolean {
  return getBookmarks().some((post) => String(post.id) === String(id));
}

export function toggleBookmark(post: KindredPost): KindredPost[] {
  const current = getBookmarks();

  const exists = current.some(
    (saved) => String(saved.id) === String(post.id)
  );

  const updated = exists
    ? current.filter((saved) => String(saved.id) !== String(post.id))
    : [post, ...current];

  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));

  window.dispatchEvent(new Event("kindred-bookmarks-updated"));

  return updated;
}