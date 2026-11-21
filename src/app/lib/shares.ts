export async function sharePost(postId: string): Promise<boolean> {
  const shareUrl = `${window.location.origin}/post/${postId}`;

  try {
    await navigator.clipboard.writeText(shareUrl);
    return true;
  } catch (error) {
    console.error("Could not copy share link:", error);
    return false;
  }
}