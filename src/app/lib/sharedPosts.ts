import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { posts as initialPosts, type KindredPost } from "@/app/data/posts";

const postsCollection = collection(db, "posts");
const LEGACY_POSTS_KEY = "kindred-posts";

function isLegacyPost(value: unknown): value is KindredPost {
  if (typeof value !== "object" || value === null) return false;
  const post = value as Record<string, unknown>;
  return (
    typeof post.id === "string" &&
    typeof post.creator === "string" &&
    typeof post.username === "string" &&
    typeof post.avatar === "string" &&
    typeof post.avatarColor === "string" &&
    typeof post.content === "string" &&
    Array.isArray(post.tags) &&
    post.tags.every((tag) => typeof tag === "string") &&
    typeof post.time === "string" &&
    typeof post.likes === "number" &&
    typeof post.comments === "number" &&
    post.authorUid === undefined
  );
}

function getLegacyPosts(): KindredPost[] {
  try {
    const stored = localStorage.getItem(LEGACY_POSTS_KEY);
    if (!stored) return [];

    const legacy = JSON.parse(stored) as unknown;
    return Array.isArray(legacy) ? legacy.filter(isLegacyPost) : [];
  } catch (error) {
    console.error("Could not load legacy local posts:", error);
    return [];
  }
}

export function createPostId(): string {
  return doc(postsCollection).id;
}

export async function getPosts(): Promise<KindredPost[]> {
  if (typeof window === "undefined") {
    return initialPosts;
  }

  const snapshot = await getDocs(query(postsCollection, orderBy("createdAt", "desc")));
  const userPosts = snapshot.docs.map(
    (post) => ({ ...post.data(), id: post.id }) as KindredPost,
  );
  const knownIds = new Set([...userPosts, ...initialPosts].map((post) => post.id));
  const legacyPosts = getLegacyPosts().filter((post) => !knownIds.has(post.id));
  return [...userPosts, ...legacyPosts, ...initialPosts];
}

export async function addPost(post: KindredPost): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("You must be signed in to publish a post.");
  }
  if (!post.authorUid || post.authorUid !== currentUser.uid) {
    throw new Error("A post must belong to the signed-in account.");
  }

  const { id, image, ...postData } = post;
  await setDoc(doc(postsCollection, id), {
    ...postData,
    ...(image ? { image } : {}),
    createdAt: serverTimestamp(),
  });
}

export async function updatePost(
  postId: string,
  authorUid: string,
  updates: Pick<KindredPost, "content" | "tags" | "image">,
): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== authorUid) {
    throw new Error("You can only edit posts owned by the signed-in account.");
  }

  const postRef = doc(postsCollection, postId);
  const snapshot = await getDoc(postRef);
  if (!snapshot.exists() || snapshot.data().authorUid !== currentUser.uid) {
    throw new Error("You can only edit posts owned by the signed-in account.");
  }

  await updateDoc(postRef, {
    content: updates.content,
    tags: updates.tags,
    image: updates.image ?? deleteField(),
    updatedAt: serverTimestamp(),
  });
}

export async function deletePost(
  postId: string,
  authorUid: string,
): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== authorUid) {
    throw new Error("You can only delete posts owned by the signed-in account.");
  }

  const postRef = doc(postsCollection, postId);
  const snapshot = await getDoc(postRef);
  if (!snapshot.exists() || snapshot.data().authorUid !== currentUser.uid) {
    throw new Error("You can only delete posts owned by the signed-in account.");
  }

  await deleteDoc(postRef);
}

export function subscribeToPosts(
  callback: () => void,
  onError?: (error: Error) => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  return onSnapshot(
    postsCollection,
    callback,
    (error) => {
      console.error("Could not subscribe to Kindred posts:", error);
      onError?.(error);
    },
  );
}
