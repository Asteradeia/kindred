
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadProfileImage(
  uid: string,
  file: File
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be smaller than 5 MB.");
  }

  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

  const imageRef = ref(
    storage,
    `users/${uid}/profile/${Date.now()}-${safeFileName}`
  );

  await uploadBytes(imageRef, file);

  return await getDownloadURL(imageRef);
}
