import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import {
  deleteObject,
  listAll,
  ref,
  type StorageReference,
} from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";

async function getStorageFiles(folder: StorageReference): Promise<StorageReference[]> {
  const result = await listAll(folder);
  const nestedFiles = await Promise.all(
    result.prefixes.map((prefix) => getStorageFiles(prefix)),
  );

  return [...result.items, ...nestedFiles.flat()];
}

export async function deleteUserContent(uid: string): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    throw new Error("You can only delete content owned by the signed-in account.");
  }

  const [posts, comments] = await Promise.all([
    getDocs(query(collection(db, "posts"), where("authorUid", "==", uid))),
    getDocs(query(collection(db, "comments"), where("authorUid", "==", uid))),
  ]);
  const ownedDocuments = [...posts.docs, ...comments.docs];

  for (let offset = 0; offset < ownedDocuments.length; offset += 500) {
    const batch = writeBatch(db);
    ownedDocuments
      .slice(offset, offset + 500)
      .forEach((document) => batch.delete(document.ref));
    await batch.commit();
  }

  const imageFiles = await getStorageFiles(
    ref(storage, `users/${uid}/posts`),
  );
  for (let offset = 0; offset < imageFiles.length; offset += 20) {
    await Promise.all(
      imageFiles
        .slice(offset, offset + 20)
        .map((image) => deleteObject(image)),
    );
  }
}
