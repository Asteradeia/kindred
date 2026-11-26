"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPosts, subscribeToPosts } from "@/app/lib/sharedPosts";
import type { KindredPost } from "@/app/data/posts";
import Link from "next/link";
import {
  getLikedPosts,
  toggleLike as togglePostLike,
  subscribeToLikes,
} from "@/app/lib/likes";
import { getBookmarks, toggleBookmark } from "@/app/lib/bookmarks";
import { sharePost } from "@/app/lib/shares";
import { addComment, getComments, subscribeToComments } from "@/app/lib/comments";
import type { KindredComment } from "@/app/lib/comments";
import { useAuth } from "@/app/data/AuthContext";
export default function PostPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#faf8f5] text-sm text-[#827a89]">
          Loading post...
        </main>
      }
    >
      <PostPageContent />
    </Suspense>
  );
}

function PostPageContent() {
  const { user, profile } = useAuth();
  const [post, setPost] = useState<KindredPost | null>(null);
  const params = useParams();
  const postId = String(params.id);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState<KindredComment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    const refreshPost = () => {
      void getPosts()
        .then((posts) => {
          setPost(posts.find((item) => String(item.id) === postId) ?? null);
        })
        .catch((error: unknown) => {
          console.error("Could not load post:", error);
        });
    };
    queueMicrotask(refreshPost);

    const unsubscribe = subscribeToPosts(refreshPost);

    return unsubscribe;
  }, [postId]);

  useEffect(() => {
  const refreshInteractions = () => {
    setLiked(getLikedPosts().includes(postId));
    setBookmarked(
      getBookmarks().some((bookmarkedPost) => String(bookmarkedPost.id) === postId),
    );
    void getComments()
      .then((allComments) => {
        setComments(allComments.filter((comment) => comment.postId === postId));
      })
      .catch((error: unknown) => {
        console.error("Could not load post comments:", error);
      });
  };
  queueMicrotask(refreshInteractions);

  const unsubscribeLikes = subscribeToLikes(refreshInteractions);
  const unsubscribeComments = subscribeToComments(refreshInteractions);

  return () => {
    unsubscribeLikes();
    unsubscribeComments();
  };
}, [postId]);

  function handleLike() {
    setLiked(togglePostLike(postId).includes(postId));
  }

  function handleBookmark() {
    if (!post) return;

    setBookmarked(
      toggleBookmark(post).some(
        (bookmarkedPost) => String(bookmarkedPost.id) === postId,
      ),
    );
  }

  async function handleShare() {
    const success = await sharePost(postId);
    setShareCopied(success);
  }

  async function handleSubmitComment() {
  const content = commentInput.trim();

  if (!content || !user || !profile) return;

  const newComment: KindredComment = {
    id: "",
    postId,
    authorUid: user.uid,
    username: profile.username,
    displayName: profile.displayName,
    avatar: profile.displayName.trim().charAt(0).toUpperCase() || "K",
    content,
    createdAt: "",
  };

  setCommentError("");
  try {
    await addComment(newComment);
    setCommentInput("");
  } catch (error: unknown) {
    console.error("Could not add post comment:", error);
    setCommentError("We couldn't add your comment. Please try again.");
  }
}

  if (!post) {
    return (
      <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-[#59406f]">
            Post not found
          </h1>
          <p className="mt-2 text-[#827a89]">
            This post may have been removed or doesn&apos;t exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] flex flex-col">
      <div className="relative flex flex-1 items-start justify-center px-6 pt-16 pb-12">
        <div className="w-full max-w-[640px] rounded-2xl border border-[#e9e3eb] bg-white p-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: post.avatarColor }}
            >
              {post.avatar}
            </div>

            <div>
              <p className="font-medium text-[#59406f]">{post.creator}</p>
              <p className="text-sm text-[#827a89]">@{post.username}</p>
            </div>
          </div>

          <p className="mt-6 whitespace-pre-wrap text-[#59406f]">
            {post.content}
          </p>

          {post.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image}
              alt="Post image"
              className="mt-5 w-full rounded-xl object-cover"
            />
          )}

          <div className="mt-6 flex items-center justify-between border-t border-[#e9e3eb] pt-4">
  <button
    onClick={handleLike}
    className={`text-sm ${
      liked ? "text-[#75558c]" : "text-[#827a89]"
    }`}
  >
    {liked ? "♥ Liked" : "♡ Like"}
  </button>

  <button
    onClick={() => setShowComments(!showComments)}
    className="text-sm text-[#827a89]"
  >
    💬 Comment ({comments.length})
  </button>

  <button
    onClick={handleShare}
    className="text-sm text-[#827a89]"
  >
    {shareCopied ? "Link copied!" : "↗ Share"}
  </button>

  <button
    onClick={handleBookmark}
    className={`text-sm ${
      bookmarked ? "text-[#75558c]" : "text-[#827a89]"
    }`}
  >
    {bookmarked ? "★ Saved" : "☆ Bookmark"}
  </button>
</div>

{showComments && (
  <div className="mt-6 border-t border-[#e9e3eb] pt-5">
    <h3 className="mb-4 font-serif text-lg text-[#59406f]">
      Comments
    </h3>

    {comments.length === 0 ? (
      <p className="mb-4 text-sm text-[#827a89]">
        No comments yet. Be the first to comment!
      </p>
    ) : (
      <div className="mb-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9e3eb] text-sm text-[#59406f]">
              {comment.avatar}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-[#59406f]">
                {comment.displayName}
              </p>
              <p className="mt-1 text-sm text-[#827a89]">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}

    {user && profile ? (
    <div className="flex gap-2">
      <input
        type="text"
        value={commentInput}
        onChange={(event) => setCommentInput(event.target.value)}
        placeholder="Write a comment..."
        className="flex-1 rounded-lg border border-[#e9e3eb] bg-[#faf8f5] px-4 py-2 text-sm outline-none focus:border-[#9277a8]"
      />

      <button
        onClick={handleSubmitComment}
        disabled={!commentInput.trim()}
        className="rounded-lg bg-[#75558c] px-4 py-2 text-sm text-white transition hover:bg-[#59406f]"
      >
        Send
      </button>
    </div>
    ) : (
      <p className="text-sm text-[#827a89]">
        <Link href="/login" className="text-[#75558c] hover:underline">
          Log in
        </Link>{" "}
        to join the conversation.
      </p>
    )}
    {commentError && (
      <p role="alert" className="mt-2 text-sm text-red-600">
        {commentError}
      </p>
    )}
  </div>
)}
        </div>
        <aside className="absolute left-[calc(50%+340px)] top-16 hidden w-[200px] rounded-2xl border border-[#e9e3eb] bg-white p-4 lg:block">
          <h2 className="font-serif text-lg text-[#59406f]">
            Discover creators
          </h2>

          <p className="mt-1 text-xs text-[#827a89]">
            Find your next favourite creator.
          </p>

          <div className="mt-4 space-y-4">
            <Link href="/u/mossandmoon" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5d9ed] text-sm text-[#75558c]">
                M
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#59406f]">
                  mossandmoon
                </p>
                <p className="text-xs text-[#827a89]">Artist</p>
              </div>
            </Link>

            <Link href="/u/papercrow" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eadfd7] text-sm text-[#75558c]">
                P
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#59406f]">
                  papercrow
                </p>
                <p className="text-xs text-[#827a89]">Writer</p>
              </div>
            </Link>

            <Link href="/u/littlefernstudio" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dce8d8] text-sm text-[#75558c]">
                L
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#59406f]">
                  littlefernstudio
                </p>
                <p className="text-xs text-[#827a89]">Crafts</p>
              </div>
            </Link>
          </div>

          <Link
            href="/discover"
            className="mt-4 block text-sm font-medium text-[#75558c] hover:text-[#59406f]"
          >
            Explore more →
          </Link>
        </aside>
      </div>
    </main>
  );
}