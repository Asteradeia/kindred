import { posts as initialPosts, type KindredPost } from "@/app/data/posts";

const STORAGE_KEY = "kindred-posts";
const EVENT_NAME = "kindred-posts-updated";

export function getPosts(): KindredPost[] {
  if (typeof window === "undefined") {
    return initialPosts;
  }

  try {
    const storedPosts = localStorage.getItem(STORAGE_KEY);

    if (!storedPosts) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPosts));
      return initialPosts;
    }

    return JSON.parse(storedPosts) as KindredPost[];
  } catch (error) {
    console.error("Could not load Kindred posts:", error);
    return initialPosts;
  }
}

export function savePosts(posts: KindredPost[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));

    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (error) {
    console.error("Could not save Kindred posts:", error);
  }
}

export function addPost(post: KindredPost): KindredPost[] {
  const currentPosts = getPosts();

  const updatedPosts = [post, ...currentPosts];

  savePosts(updatedPosts);

  return updatedPosts;
}

export function subscribeToPosts(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(EVENT_NAME, callback);

  return () => {
    window.removeEventListener(EVENT_NAME, callback);
  };
}