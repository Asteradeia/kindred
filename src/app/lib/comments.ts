export type KindredComment = {
  id: string;
  postId: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "kindred-comments";
const EVENT_NAME = "kindred-comments-updated";

export function getComments(): KindredComment[] {
  if (typeof window === "undefined") return [];

  try {
    const storedComments = localStorage.getItem(STORAGE_KEY);
    if (!storedComments) return [];

    return JSON.parse(storedComments) as KindredComment[];
  } catch (error) {
    console.error("Could not load comments:", error);
    return [];
  }
}

export function getCommentsForPost(postId: string): KindredComment[] {
  return getComments().filter((comment) => comment.postId === postId);
}
export function addComment(comment: KindredComment): KindredComment[] {
  const currentComments = getComments();
  const updatedComments = [...currentComments, comment];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedComments));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (error) {
    console.error("Could not save comment:", error);
  }

  return updatedComments;
}

export function subscribeToComments(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(EVENT_NAME, callback);

  return () => window.removeEventListener(EVENT_NAME, callback);
}