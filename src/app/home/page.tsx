
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  getPosts,
  addPost,
  createPostId,
  deletePost,
  subscribeToPosts,
  updatePost,
} from "@/app/lib/sharedPosts";
import {
  getBookmarks,
  removeBookmark,
  toggleBookmark,
} from "@/app/lib/bookmarks";
import {
  getLikedPosts,
  toggleLike as togglePostLike,
  subscribeToLikes,
} from "@/app/lib/likes";
import type { KindredPost } from "@/app/data/posts";
import {
  getComments,
  addComment,
  subscribeToComments,
} from "@/app/lib/comments";
import { sharePost } from "@/app/lib/shares";
import type { KindredComment } from "@/app/lib/comments";
import {
  getFollowedCreators,
  toggleFollow as toggleCreatorFollow,
  subscribeToFollows,
} from "@/app/lib/follows";
import { useAuth } from "@/app/data/AuthContext";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
const suggestedCreators = [
  { name: "Moss & Moon", username: "@mossandmoon", letter: "M", color: "#e3eadc" },
  { name: "PaperCrow", username: "@papercrow", letter: "P", color: "#f0dfe8" },
  { name: "Little Fern", username: "@littlefernstudio", letter: "F", color: "#e4e6f1" },
];

export default function KindredHome() {
  const { user, profile, profileLoading } = useAuth();
  const canCreatePost = Boolean(user && profile?.profileComplete);
  const creatorName = profile?.displayName || user?.displayName || "Kellie";
  const creatorUsername = profile?.username || "yourusername";
  const creatorAvatar = creatorName.trim().charAt(0).toUpperCase() || "K";
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [sharedPostId, setSharedPostId] = useState<string | null>(null);
  const [following, setFollowing] = useState<string[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>([]);
  const [newPost, setNewPost] = useState("");
  const [newTags, setNewTags] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedPosts, setFeedPosts] = useState<KindredPost[]>([]);
  const [postComments, setPostComments] = useState<KindredComment[]>([]);
  const [publishError, setPublishError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [openPostMenuId, setOpenPostMenuId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<KindredPost | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editError, setEditError] = useState("");
  const [postActionError, setPostActionError] = useState("");
  const [savingEditedPost, setSavingEditedPost] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [activeFeed, setActiveFeed] = useState<"forYou" | "following">("forYou");
  const [followedCreators, setFollowedCreators] = useState<string[]>([]);
  const displayedPosts =
    activeFeed === "following"
      ? feedPosts.filter((post) =>
          followedCreators.includes(post.username.toLowerCase()),
        )
      : feedPosts;
  useEffect(() => {
    const refreshBookmarks = () => {
      setBookmarkedPosts(getBookmarks().map((post) => String(post.id)));
    };

    refreshBookmarks();

    window.addEventListener("kindred-bookmarks-updated", refreshBookmarks);

    return () => {
      window.removeEventListener("kindred-bookmarks-updated", refreshBookmarks);
    };
  }, []);
  useEffect(() => {
  const refreshFollowedCreators = () => {
    setFollowedCreators(getFollowedCreators());
  };

  queueMicrotask(refreshFollowedCreators);

  const unsubscribe = subscribeToFollows(refreshFollowedCreators);

  return unsubscribe;
}, []);
useEffect(() => {
  const refreshPosts = () => {
    void getPosts()
      .then(setFeedPosts)
      .catch((error: unknown) => {
        console.error("Could not load Kindred posts:", error);
      });
  };
  queueMicrotask(refreshPosts);

  const unsubscribe = subscribeToPosts(refreshPosts);

  return unsubscribe;
}, []);
useEffect(() => {
  queueMicrotask(() => setLikedPostIds(getLikedPosts()));

  const unsubscribe = subscribeToLikes(() => {
    setLikedPostIds(getLikedPosts());
  });

  return unsubscribe;
}, []);
useEffect(() => {
  const refreshComments = () => {
    void getComments()
      .then(setPostComments)
      .catch((error: unknown) => {
        console.error("Could not load comments:", error);
      });
  };
  queueMicrotask(refreshComments);

  const unsubscribe = subscribeToComments(refreshComments);

  return unsubscribe;
}, []);
async function publishPost() {
  if (!user || !profile || (!newPost.trim() && !imagePreview)) return;
  setPublishError("");
  setPublishing(true);

  const tags = newTags
    .split(/[,\s]+/)
    .map((tag) => tag.replace(/^#/, "").trim())
    .filter(Boolean);

  let uploadedImageRef: ReturnType<typeof ref> | null = null;
  try {
    const id = createPostId();
    let image: string | undefined;
    if (imagePreview) {
      uploadedImageRef = ref(storage, `users/${user.uid}/posts/${id}`);
      const uploadedImage = await uploadString(
        uploadedImageRef,
        imagePreview,
        "data_url",
      );
      image = await getDownloadURL(uploadedImage.ref);
    }

    await addPost({
      id,
      authorUid: user.uid,
      creator: profile.displayName,
      username: profile.username,
      avatar: profile.displayName.trim().charAt(0).toUpperCase() || "K",
      avatarColor: "#e9e1f0",
      content: newPost.trim(),
      tags,
      image,
      time: "Just now",
      likes: 0,
      comments: 0,
    });
    setFeedPosts(await getPosts());
    setNewPost("");
    setNewTags("");
    setShowTags(false);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  } catch (error: unknown) {
    console.error("Could not publish post:", error);
    if (uploadedImageRef) {
      try {
        await deleteObject(uploadedImageRef);
      } catch (cleanupError: unknown) {
        console.error("Could not remove the failed post image upload:", cleanupError);
      }
    }
    setPublishError("We couldn't publish your post. Please try again.");
  } finally {
    setPublishing(false);
  }
}

function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Image must be smaller than 5MB.");
    e.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    setImagePreview(reader.result as string);
  };

  reader.readAsDataURL(file);
}
  function beginEditingPost(post: KindredPost) {
    setEditingPost(post);
    setEditContent(post.content);
    setEditTags(post.tags.join(", "));
    setEditImagePreview(post.image ?? null);
    setEditError("");
    setOpenPostMenuId(null);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  }
  function handleEditImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setEditError("Please select an image.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setEditError("Image must be smaller than 5MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setEditImagePreview(reader.result);
        setEditError("");
      } else {
        setEditError("We couldn't read that image. Please try another file.");
      }
    };
    reader.onerror = () => {
      console.error("Could not read the edited post image:", reader.error);
      setEditError("We couldn't read that image. Please try another file.");
    };
    reader.readAsDataURL(file);
  }
  async function handleSavePostEdit() {
    if (!user || !profile || !editingPost || editingPost.authorUid !== user.uid) {
      return;
    }
    if (!editContent.trim() && !editImagePreview) {
      setEditError("Add some text or a photo before saving.");
      return;
    }

    setSavingEditedPost(true);
    setEditError("");
    setPostActionError("");
    let uploadedImageRef: ReturnType<typeof ref> | null = null;
    let image = editingPost.image;
    const tags = editTags
      .split(/[,\s]+/)
      .map((tag) => tag.replace(/^#/, "").trim())
      .filter(Boolean);

    try {
      if (editImagePreview && editImagePreview !== editingPost.image) {
        uploadedImageRef = ref(
          storage,
          `users/${user.uid}/posts/${editingPost.id}-${createPostId()}`,
        );
        const uploadedImage = await uploadString(
          uploadedImageRef,
          editImagePreview,
          "data_url",
        );
        image = await getDownloadURL(uploadedImage.ref);
      } else if (!editImagePreview) {
        image = undefined;
      }

      await updatePost(editingPost.id, user.uid, {
        content: editContent.trim(),
        tags,
        image,
      });
    } catch (error: unknown) {
      console.error("Could not update post:", error);
      if (uploadedImageRef) {
        try {
          await deleteObject(uploadedImageRef);
        } catch (cleanupError: unknown) {
          console.error("Could not remove the failed edited-image upload:", cleanupError);
        }
      }
      setEditError("We couldn't save your changes. Please try again.");
      setSavingEditedPost(false);
      return;
    }

    const updatedImage = image;
    setFeedPosts((previousPosts) =>
      previousPosts.map((post) =>
        post.id === editingPost.id
          ? {
              ...post,
              content: editContent.trim(),
              tags,
              image: updatedImage,
            }
          : post,
      ),
    );
    setEditingPost(null);
    setSavingEditedPost(false);

    if (editingPost.image && editingPost.image !== updatedImage) {
      try {
        await deleteObject(ref(storage, editingPost.image));
      } catch (error: unknown) {
        console.error("Post was updated, but its old image could not be removed:", error);
        setPostActionError(
          "Your post was updated, but its previous photo couldn't be removed.",
        );
      }
    }
  }
  async function handleDeletePost(post: KindredPost) {
    if (!user || post.authorUid !== user.uid) return;
    if (!window.confirm("Delete this post? This can't be undone.")) return;

    const postId = String(post.id);
    setOpenPostMenuId(null);
    setPostActionError("");
    setDeletingPostId(postId);

    try {
      await deletePost(postId, user.uid);
    } catch (error: unknown) {
      console.error("Could not delete post:", error);
      setPostActionError("We couldn't delete your post. Please try again.");
      setDeletingPostId(null);
      return;
    }

    setFeedPosts((previousPosts) =>
      previousPosts.filter((feedPost) => String(feedPost.id) !== postId),
    );
    removeBookmark(postId);
    setDeletingPostId(null);

    if (post.image) {
      try {
        await deleteObject(ref(storage, post.image));
      } catch (error: unknown) {
        console.error("Post was deleted, but its image could not be removed:", error);
        setPostActionError(
          "Your post was deleted, but its photo couldn't be removed from storage.",
        );
      }
    }
  }
  function handleToggleLike(post: KindredPost) {
    setLikedPostIds(togglePostLike(String(post.id)));
  }
  function handleBookmark(post: (typeof feedPosts)[number]) {
  toggleBookmark(post);

  setBookmarkedPosts(
    getBookmarks().map((saved) => String(saved.id))
  );
}
function toggleComments(postId: string) {
  setCommentError("");
  setExpandedComments((previous) =>
    previous.includes(postId)
      ? previous.filter((id) => id !== postId)
      : [...previous, postId]
  );
}
async function handleSubmitComment(postId: string) {
  if (!user || !profile) return;
  const content = commentInputs[postId]?.trim();
  if (!content) return;

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
    setCommentInputs((previous) => ({ ...previous, [postId]: "" }));
  } catch (error: unknown) {
    console.error("Could not add comment:", error);
    setCommentError("We couldn't add your comment. Please try again.");
  }
}
async function handleShare(postId: string) {
  const success = await sharePost(postId);

  if (success) {
    setSharedPostId(postId);
  }
}
function toggleFollow(username: string) {
  const updated = toggleCreatorFollow(username.replace("@", "").toLowerCase());
  setFollowing(updated);
}

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#30283a]">
      {/* Three column layout */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-5 py-8 lg:grid-cols-[220px_minmax(0,620px)_280px]">

        {/* Left sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-3xl border border-[#e9e3eb] bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9e1f0] text-lg font-medium text-[#75558c]">
                  {creatorAvatar}
                </div>
                <div>
                  <p className="font-medium">{creatorName}</p>
                  <p className="text-xs text-[#827a89]">@{creatorUsername}</p>
                </div>
              </div>
              <Link
                href={
                  profile?.profileComplete
                    ? `/u/${encodeURIComponent(profile.username)}`
                    : "/profile"
                }
                className="mt-4 block rounded-full border border-[#e9e3eb] py-2 text-center text-sm text-[#75558c] hover:bg-[#eee8f2]"
              >
                View profile
              </Link>
            </div>

            
<nav className="space-y-1">
  {[
    ["⌂", "Home", "/home"],
    ["✧", "Discover", "/discover"],
    ["⌕", "Search", "/search"],
    ["▤", "Archive", "/archive"],
    ["✎", "Commissions", "/commissions"],
    ["♡", "Requests", "/requests"],
    ["♧", "Projects", "/projects"],
    ["▣", "Bookmarks", "/bookmarks"],
    ["♧", "Notifications", "/notifications"],
  ].map(([icon, label, href]) => (
    <Link
      key={label}
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
        label === "Home"
          ? "bg-[#eee8f2] font-medium text-[#75558c]"
          : "text-[#62596b] hover:bg-[#f0ebf2]"
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </Link>
  ))}
</nav>


            <div className="px-3 text-xs leading-6 text-[#a19aa8]">
              A home for people who create.
            </div>
          </div>
        </aside>

        {/* Main feed */}
        <section className="min-w-0">
          <div className="mb-6">
            <h1 className="font-serif text-3xl">Your little corner.</h1>
            <p className="mt-1 text-sm text-[#827a89]">A little inspiration from your creative community.</p>
          </div>

          {/* Post composer */}
          <div className="mb-6 rounded-3xl border border-[#e9e3eb] bg-white p-5">
            {profileLoading ? (
              <p className="text-sm text-[#827a89]">Checking your account...</p>
            ) : canCreatePost ? (
              <>
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e9e1f0] font-medium text-[#75558c]">
                    {creatorAvatar}
                  </div>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What are you creating today?"
                    rows={3}
                    className="w-full resize-none rounded-2xl bg-[#faf8f5] p-4 text-sm outline-none placeholder:text-[#a49aa8] focus:ring-1 focus:ring-[#d9c9e5]"
                  />
                </div>
                {showTags && (
                  <div className="mt-3 ml-14">
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="Add tags (e.g. fantasy, art, wip)"
                      className="w-full rounded-xl border border-[#e9e3eb] bg-[#faf8f5] px-4 py-3 text-sm outline-none focus:border-[#b69ac8]"
                    />
                    <p className="mt-1 text-xs text-[#a19aa8]">
                      Separate tags with spaces or commas.
                    </p>
                  </div>
                )}
                {imagePreview && (
                  <div className="relative mt-4 ml-14">
                    <img
                      src={imagePreview}
                      alt="Post preview"
                      className="max-h-80 w-full rounded-2xl object-contain"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute right-2 top-2 rounded-full bg-black/60 px-3 py-1 text-sm text-white hover:bg-black/80"
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-4 text-sm text-[#827a89]">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="transition hover:text-[#75558c]"
                    >
                      ▧ Photo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <button
                      onClick={() => setShowTags(!showTags)}
                      className={`transition hover:text-[#75558c] ${
                        showTags ? "text-[#75558c]" : ""
                      }`}
                    >
                      ✧ Tags
                    </button>
                  </div>
                  <button
                    disabled={publishing || (!newPost.trim() && !imagePreview)}
                    onClick={publishPost}
                    className="rounded-full bg-[#75558c] px-5 py-2 text-sm text-white transition hover:bg-[#59406f] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {publishing ? "Publishing..." : "Post"}
                  </button>
                </div>
                {publishError && (
                  <p role="alert" className="mt-3 text-sm text-red-600">
                    {publishError}
                  </p>
                )}
              </>
            ) : user ? (
              <>
                <p className="text-sm text-[#827a89]">
                  Finish setting up your profile before sharing with the community.
                </p>
                <Link
                  href="/account/setup"
                  className="mt-4 inline-block rounded-full bg-[#75558c] px-5 py-2 text-sm text-white transition hover:bg-[#59406f]"
                >
                  Complete your profile
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-[#827a89]">
                  Log in to share what you&apos;re creating with the community.
                </p>
                <Link
                  href="/login?redirect=%2Fhome"
                  className="mt-4 inline-block rounded-full bg-[#75558c] px-5 py-2 text-sm text-white transition hover:bg-[#59406f]"
                >
                  Log in to create a post
                </Link>
              </>
            )}
          </div>

          {/* Feed selector */}
          <div className="mb-5 flex gap-2 rounded-2xl border border-[#e9e3eb] bg-white p-2">
              {[
                { label: "For you", value: "forYou" as const },
                { label: "Following", value: "following" as const },
              ].map((tab) => (
              <button
                  key={tab.value}
                  onClick={() => setActiveFeed(tab.value)}
                className={`flex-1 rounded-xl py-2.5 text-sm transition ${
                    activeFeed === tab.value
                    ? "bg-[#eee8f2] font-medium text-[#75558c]"
                    : "text-[#827a89] hover:bg-[#faf8f5]"
                }`}
              >
                  {tab.label}
              </button>
            ))}
          </div>
          {postActionError && (
            <p role="alert" className="mb-4 text-sm text-red-600">
              {postActionError}
            </p>
          )}
          {/* Posts */}
<div className="space-y-5">
  {activeFeed === "following" && displayedPosts.length === 0 ? (
    <div className="rounded-3xl border border-[#e9e3eb] bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eee8f2] text-3xl text-[#75558c]">
        ♡
      </div>

      <h2 className="mt-4 font-serif text-2xl text-[#59406f]">
        {followedCreators.length === 0
          ? "Your creative circle awaits"
          : "A little quiet in your circle"}
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#827a89]">
        {followedCreators.length === 0
          ? "Follow creators whose work you love, and their latest creations will find their way here."
          : "The creators you follow haven't shared anything yet. Check back soon, or discover someone new."}
      </p>

      <Link
        href="/discover"
        className="mt-5 inline-block rounded-full bg-[#75558c] px-5 py-2.5 text-sm text-white transition hover:bg-[#59406f]"
      >
        Discover creators
      </Link>
    </div>
  ) : (
    displayedPosts.map((post) => (
              <article key={post.id} className="overflow-hidden rounded-3xl border border-[#e9e3eb] bg-white">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/u/${post.username.replace("@", "").toLowerCase()}`}
                      aria-label={`View ${post.creator}'s profile`}
                      style={{ backgroundColor: post.avatarColor }}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-medium text-[#75558c] hover:opacity-80"
                    >
                      {post.avatar}
                    </Link>

                    <div className="min-w-0">
                      <Link
                        href={`/u/${post.username.replace("@", "").toLowerCase()}`}
                        className="block text-sm font-medium hover:text-[#75558c]"
                      >
                        {post.creator}
                      </Link>

                      <p className="text-xs text-[#827a89]">
                        @{post.username} · {post.time}
                      </p>
                    </div>
                  </div>
                  {user && post.authorUid === user.uid && (
                    <div className="relative">
                      <button
                        type="button"
                        aria-label={`Post options for ${post.creator}`}
                        aria-expanded={openPostMenuId === String(post.id)}
                        aria-controls={`post-actions-${post.id}`}
                        onClick={() =>
                          setOpenPostMenuId((openId) =>
                            openId === String(post.id) ? null : String(post.id),
                          )
                        }
                        className="rounded-full px-2 py-1 text-xl leading-none text-[#827a89] transition hover:bg-[#f3eef6] hover:text-[#75558c]"
                      >
                        ···
                      </button>
                      {openPostMenuId === String(post.id) && (
                        <div
                          id={`post-actions-${post.id}`}
                          role="menu"
                          aria-label={`Actions for ${post.creator}'s post`}
                          className="absolute right-0 top-10 z-20 w-40 rounded-xl border border-[#e9e3eb] bg-white p-1.5 shadow-lg"
                        >
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => beginEditingPost(post)}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#62596b] transition hover:bg-[#f3eef6] hover:text-[#75558c]"
                          >
                            Edit post
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            disabled={deletingPostId === String(post.id)}
                            onClick={() => void handleDeletePost(post)}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingPostId === String(post.id)
                              ? "Deleting..."
                              : "Delete post"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-5 pb-4">
                  {post.content && (
                    <p className="text-sm leading-7">{post.content}</p>
                  )}
                  {post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${encodeURIComponent(tag.toLowerCase().replace(/^#/, ""))}`}
                        className="text-xs text-[#866b9b] transition hover:text-[#75558c] hover:underline"
                      >
                        #{tag.replace(/^#/, "")}
                      </Link>
                    ))}
                    </div>
                  )}
                </div>

                {post.image && (
                  <div className="mb-4 overflow-hidden rounded-xl">
                    <img
                      src={post.image}
                      alt="Post attachment"
                      className="w-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex gap-5">
                   <button
  onClick={() => handleToggleLike(post)}
  aria-label={likedPostIds.includes(String(post.id)) ? "Unlike post" : "Like post"}
  className={`text-sm transition ${
    likedPostIds.includes(String(post.id))
      ? "text-[#b66d8a]"
      : "text-[#827a89] hover:text-[#b66d8a]"
  }`}
>
  {likedPostIds.includes(String(post.id)) ? "♥" : "♡"}{" "}
  {post.likes + (likedPostIds.includes(String(post.id)) ? 1 : 0)}
</button>
                    <button
  onClick={() => toggleComments(String(post.id))}
  className="text-sm text-[#827a89] hover:text-[#75558c]"
>
  ○ {postComments.filter((comment) => comment.postId === String(post.id)).length} comments
</button>
                    <button
  onClick={() => handleShare(String(post.id))}
  className="text-sm text-[#827a89] hover:text-[#75558c]"
>
  {sharedPostId === String(post.id) ? "Link copied!" : "↗ Share"}
</button>
                  </div>
                  <button
  onClick={() => handleBookmark(post)}
  aria-label={bookmarkedPosts.includes(String(post.id)) ? "Remove bookmark" : "Bookmark"}
  title={bookmarkedPosts.includes(String(post.id)) ? "Remove bookmark" : "Save post"}
  className={`text-lg transition ${
    bookmarkedPosts.includes(String(post.id))
      ? "text-[#75558c]"
      : "text-[#827a89] hover:text-[#75558c]"
  }`}
>
  {bookmarkedPosts.includes(String(post.id)) ? "♣" : "♧"}
</button>
                </div>
              {expandedComments.includes(String(post.id)) && (
                <div className="border-t border-[#e9e3eb] px-5 py-4">
                  <div className="space-y-3">
                    {postComments
                      .filter((comment) => comment.postId === String(post.id))
                      .map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e9e1f0] text-sm text-[#75558c]">
                            {comment.avatar}
                          </div>

                          <div className="min-w-0 flex-1 rounded-2xl bg-[#faf8f5] px-3 py-2">
                            <p className="text-xs font-medium">
                              {comment.displayName}{" "}
                              <span className="text-[#827a89]">@{comment.username}</span>
                            </p>
                            <p className="mt-1 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}

                    {postComments.filter((comment) => comment.postId === String(post.id)).length === 0 && (
                      <p className="text-sm text-[#827a89]">
                        No comments yet. Start the conversation.
                      </p>
                    )}
                  </div>

                  {user && profile ? (
                    <div className="mt-4 flex gap-2">
                      <input
                        value={commentInputs[String(post.id)] ?? ""}
                        onChange={(e) =>
                          setCommentInputs((previous) => ({
                            ...previous,
                            [String(post.id)]: e.target.value,
                          }))
                        }
                        placeholder="Write a comment..."
                        className="min-w-0 flex-1 rounded-full border border-[#e9e3eb] bg-[#faf8f5] px-4 py-2 text-sm outline-none focus:border-[#b69ac8]"
                      />
                      <button
                        onClick={() => void handleSubmitComment(String(post.id))}
                        disabled={!commentInputs[String(post.id)]?.trim()}
                        className="rounded-full bg-[#75558c] px-4 py-2 text-sm text-white hover:bg-[#59406f] disabled:opacity-40"
                      >
                        Send
                      </button>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-[#827a89]">
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
              </article>
            )))}
          </div>
        </section>

        {/* Right sidebar */}
        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-5">
            {/* Suggested creators */}
            <section className="rounded-3xl border border-[#e9e3eb] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-medium">People to discover</h2>
                <Link href="/discover" className="text-xs text-[#75558c]">See all</Link>
              </div>
              <div className="space-y-4">
                {suggestedCreators.map((creator) => (
                  <div key={creator.username} className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: creator.color }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-medium text-[#75558c]"
                    >
                      {creator.letter}
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col">
  <Link
    href={`/u/${creator.username.replace("@", "").toLowerCase()}`}
    className="block truncate text-sm font-medium hover:text-[#75558c]"
  >
    {creator.name}
  </Link>

  <Link
    href={`/u/${creator.username.replace("@", "").toLowerCase()}`}
    className="block truncate text-xs text-[#827a89] hover:text-[#75558c]"
  >
    {creator.username}
  </Link>
</div>
                    <button
                      onClick={() => toggleFollow(creator.username)}
                      className={`rounded-full px-3 py-1.5 text-xs transition ${
  following.includes(creator.username.replace("@", "").toLowerCase())
    ? "bg-[#75558c] text-white border border-[#75558c] hover:bg-[#59406f]"
    : "border border-[#dcd2e2] text-[#75558c] hover:bg-[#eee8f2]"
}`}
                    >
                      {following.includes(creator.username.replace("@", "").toLowerCase())
  ? "Following"
  : "Follow"}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Trending tags */}
            <section className="rounded-3xl border border-[#e9e3eb] bg-white p-5">
              <h2 className="mb-4 font-medium">Little things trending</h2>
              <div className="space-y-3">
                {[
                  ["#originalcharacters", "Creative worlds"],
                  ["#fantasy", "Stories & art"],
                  ["#wip", "Works in progress"],
                  ["#indiedev", "Game development"],
                  ["#handmade", "Made by hand"],
                ].map(([tag, description]) => (
                  <Link href="/discover" key={tag} className="block">
                    <p className="text-sm font-medium text-[#75558c]">{tag}</p>
                    <p className="mt-0.5 text-xs text-[#827a89]">{description}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Commissions */}
            <section className="rounded-3xl bg-[#e9e1f0] p-5">
              <span className="text-xl">✧</span>
              <h2 className="mt-2 font-serif text-xl text-[#59406f]">Support a creator</h2>
              <p className="mt-2 text-sm leading-6 text-[#756780]">
                Find artists and creatives offering commissions and bring an idea to life.
              </p>
              <Link href="/commissions" className="mt-4 inline-block text-sm font-medium text-[#75558c] hover:underline">
                Browse commissions →
              </Link>
            </section>

            <footer className="px-2 text-xs leading-6 text-[#a19aa8]">
              About · Guidelines · Privacy · Terms
              <p className="mt-1">© 2026 Kindred</p>
            </footer>
          </div>
        </aside>
      </div>
      {editingPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !savingEditedPost) {
              setEditingPost(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-post-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="edit-post-title" className="font-serif text-2xl">
                  Edit your post
                </h2>
                <p className="mt-1 text-sm text-[#827a89]">
                  Update your words, tags, or photo.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close edit post"
                disabled={savingEditedPost}
                onClick={() => setEditingPost(null)}
                className="rounded-full px-3 py-1 text-xl text-[#827a89] hover:bg-[#f3eef6] disabled:opacity-50"
              >
                ×
              </button>
            </div>
            <label
              htmlFor="edit-post-content"
              className="mt-5 block text-sm font-medium text-[#62596b]"
            >
              Post
            </label>
            <textarea
              id="edit-post-content"
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              rows={5}
              maxLength={5000}
              className="mt-2 w-full resize-y rounded-2xl border border-[#e9e3eb] bg-[#faf8f5] p-4 text-sm leading-6 outline-none focus:border-[#b69ac8]"
            />
            <label
              htmlFor="edit-post-tags"
              className="mt-4 block text-sm font-medium text-[#62596b]"
            >
              Tags
            </label>
            <input
              id="edit-post-tags"
              value={editTags}
              onChange={(event) => setEditTags(event.target.value)}
              placeholder="fantasy, art, wip"
              className="mt-2 w-full rounded-xl border border-[#e9e3eb] bg-[#faf8f5] px-4 py-3 text-sm outline-none focus:border-[#b69ac8]"
            />
            <div className="mt-4">
              {editImagePreview && (
                <div className="relative mb-3 overflow-hidden rounded-2xl bg-[#faf8f5]">
                  <img
                    src={editImagePreview}
                    alt="Edited post preview"
                    className="max-h-72 w-full object-contain"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => editFileInputRef.current?.click()}
                  className="rounded-full border border-[#dcd2e2] px-4 py-2 text-sm text-[#75558c] transition hover:bg-[#f3eef6]"
                >
                  {editImagePreview ? "Change photo" : "Add photo"}
                </button>
                {editImagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditImagePreview(null);
                      if (editFileInputRef.current) {
                        editFileInputRef.current.value = "";
                      }
                    }}
                    className="rounded-full px-4 py-2 text-sm text-[#827a89] transition hover:bg-[#f3eef6]"
                  >
                    Remove photo
                  </button>
                )}
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleEditImageUpload}
                />
              </div>
            </div>
            {editError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {editError}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={savingEditedPost}
                onClick={() => setEditingPost(null)}
                className="rounded-full px-5 py-2.5 text-sm text-[#827a89] transition hover:bg-[#f3eef6] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  savingEditedPost || (!editContent.trim() && !editImagePreview)
                }
                onClick={() => void handleSavePostEdit()}
                className="rounded-full bg-[#75558c] px-5 py-2.5 text-sm text-white transition hover:bg-[#59406f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingEditedPost ? "Saving..." : "Save changes"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
