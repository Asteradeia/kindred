import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type KindredComment = {
  id: string;
  postId: string;
  authorUid?: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  createdAt: string;
};

const commentsCollection = collection(db, "comments");
const LEGACY_COMMENTS_KEY = "kindred-comments";

function parseComment(
  id: string,
  data: Record<string, unknown>,
): KindredComment {
  const timestamp = data.createdAt;

  return {
    id,
    postId: typeof data.postId === "string" ? data.postId : "",
    ...(typeof data.authorUid === "string"
      ? { authorUid: data.authorUid }
      : {}),
    username: typeof data.username === "string" ? data.username : "",
    displayName: typeof data.displayName === "string" ? data.displayName : "",
    avatar: typeof data.avatar === "string" ? data.avatar : "",
    content: typeof data.content === "string" ? data.content : "",
    createdAt:
      timestamp && typeof timestamp === "object" && "toDate" in timestamp &&
      typeof timestamp.toDate === "function"
        ? timestamp.toDate().toISOString()
        : "",
  };
}

export async function getComments(): Promise<KindredComment[]> {
  const snapshot = await getDocs(
    query(commentsCollection, orderBy("createdAt", "asc")),
  );
  const remoteComments = snapshot.docs.map((comment) =>
    parseComment(comment.id, comment.data()),
  );
  try {
    const stored = localStorage.getItem(LEGACY_COMMENTS_KEY);
    if (!stored) return remoteComments;

    const legacy = JSON.parse(stored) as unknown;
    if (!Array.isArray(legacy)) return remoteComments;

    const legacyComments = legacy.filter(
      (comment): comment is KindredComment =>
        typeof comment === "object" &&
        comment !== null &&
        "id" in comment &&
        typeof comment.id === "string" &&
        "postId" in comment &&
        typeof comment.postId === "string" &&
        "username" in comment &&
        typeof comment.username === "string" &&
        "displayName" in comment &&
        typeof comment.displayName === "string" &&
        "content" in comment &&
        typeof comment.content === "string" &&
        !("authorUid" in comment),
    );
    const knownIds = new Set(remoteComments.map((comment) => comment.id));
    return [
      ...remoteComments,
      ...legacyComments.filter((comment) => !knownIds.has(comment.id)),
    ];
  } catch (error) {
    console.error("Could not load legacy local comments:", error);
    return remoteComments;
  }
}

export async function getCommentsForPost(
  postId: string,
): Promise<KindredComment[]> {
  return (await getComments()).filter((comment) => comment.postId === postId);
}

export async function addComment(
  comment: KindredComment,
): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("You must be signed in to comment.");
  }
  if (comment.authorUid !== currentUser.uid) {
    throw new Error("A comment must belong to the signed-in account.");
  }
  if (!comment.content.trim() || comment.content.length > 2000) {
    throw new Error("Comments must be between 1 and 2,000 characters.");
  }

  await addDoc(commentsCollection, {
    postId: comment.postId,
    authorUid: comment.authorUid,
    username: comment.username,
    displayName: comment.displayName,
    avatar: comment.avatar,
    content: comment.content.trim(),
    createdAt: serverTimestamp(),
  });
}

export function subscribeToComments(
  callback: () => void,
  onError?: (error: Error) => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  return onSnapshot(
    commentsCollection,
    callback,
    (error) => {
      console.error("Could not subscribe to comments:", error);
      onError?.(error);
    },
  );
}
