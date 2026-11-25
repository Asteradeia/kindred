export function getSafeInternalRedirect(
  redirect: string | null,
  fallback = "/home",
): string {
  if (!redirect?.startsWith("/") || redirect.startsWith("//")) {
    return fallback;
  }

  try {
    const destination = new URL(redirect, "https://kindred.invalid");

    if (destination.origin !== "https://kindred.invalid") {
      return fallback;
    }

    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return fallback;
  }
}
