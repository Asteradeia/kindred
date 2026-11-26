import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { after, before, beforeEach, test } from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteField,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref, uploadBytes } from "firebase/storage";

const projectId = "demo-kindred";
const notificationPreferences = {
  likes: true,
  comments: false,
  follows: true,
  commissions: false,
};

let testEnv;

function profile(uid, displayName, username, profileVisibility = "public") {
  return {
    uid,
    displayName,
    username,
    usernameNormalized: username,
    about: "",
    interests: [],
    profileVisibility,
    profileComplete: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function seedData() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const database = context.firestore();
    const users = [
      profile("publicUser", "Public Artist", "public_artist"),
      profile("privateUser", "Private Artist", "private_artist", "private"),
      profile("attacker", "Other Artist", "other_artist"),
      {
        ...profile("legacyUser", "Legacy Artist", "legacy_artist"),
        notificationPreferences,
      },
    ];

    for (const user of users) {
      await setDoc(doc(database, "users", user.uid), user);
      await setDoc(doc(database, "usernames", user.usernameNormalized), {
        uid: user.uid,
        username: user.usernameNormalized,
        updatedAt: new Date(),
      });
    }

    await setDoc(doc(database, "users", "legacyUser", "private", "settings"), {
      notificationPreferences,
    });

    await setDoc(doc(database, "posts", "owned-post"), {
      authorUid: "publicUser",
      creator: "Public Artist",
      username: "public_artist",
      avatar: "P",
      avatarColor: "#e9e1f0",
      content: "An owned post",
      tags: [],
      time: "Just now",
      likes: 0,
      comments: 0,
      createdAt: new Date(),
    });
    await setDoc(doc(database, "posts", "foreign-post"), {
      authorUid: "attacker",
      creator: "Other Artist",
      username: "other_artist",
      avatar: "O",
      avatarColor: "#e9e1f0",
      content: "Another user's post",
      tags: [],
      time: "Just now",
      likes: 0,
      comments: 0,
      createdAt: new Date(),
    });
    await setDoc(doc(database, "comments", "owned-comment"), {
      postId: "owned-post",
      authorUid: "publicUser",
      username: "public_artist",
      displayName: "Public Artist",
      avatar: "P",
      content: "An owned comment",
      createdAt: new Date(),
    });
    await setDoc(doc(database, "comments", "foreign-comment"), {
      postId: "foreign-post",
      authorUid: "attacker",
      username: "other_artist",
      displayName: "Other Artist",
      avatar: "O",
      content: "Another user's comment",
      createdAt: new Date(),
    });
  });
}

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: await readFile("firestore.rules", "utf8"),
    },
    storage: {
      host: "127.0.0.1",
      port: 9199,
      rules: await readFile("storage.rules", "utf8"),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.clearStorage();
  await seedData();
});

after(async () => {
  await testEnv?.cleanup();
});

test("public profiles are readable but private profiles and settings are owner-only", async () => {
  const visitor = testEnv.unauthenticatedContext();
  const owner = testEnv.authenticatedContext("privateUser");
  const privateSettings = doc(
    visitor.firestore(),
    "users",
    "privateUser",
    "private",
    "settings",
  );

  await assertSucceeds(getDoc(doc(visitor.firestore(), "users", "publicUser")));
  await assertFails(getDoc(doc(visitor.firestore(), "users", "privateUser")));
  await assertFails(getDoc(privateSettings));
  await assertSucceeds(
    getDoc(
      doc(
        owner.firestore(),
        "users",
        "privateUser",
        "private",
        "settings",
      ),
    ),
  );
});

test("users can update only their own public profile without exposing private fields", async () => {
  const owner = testEnv.authenticatedContext("publicUser").firestore();
  const attacker = testEnv.authenticatedContext("attacker").firestore();

  await assertSucceeds(
    updateDoc(doc(owner, "users", "publicUser"), {
      about: "Updated biography",
      updatedAt: new Date(),
    }),
  );
  await assertFails(
    updateDoc(doc(attacker, "users", "publicUser"), {
      about: "Impersonated update",
    }),
  );
  await assertFails(
    updateDoc(doc(owner, "users", "publicUser"), {
      email: "private@example.test",
    }),
  );
  await assertFails(
    updateDoc(doc(owner, "users", "publicUser"), {
      username: "other_artist",
      usernameNormalized: "other_artist",
    }),
  );
});

test("profile creation and username claims must be atomic and unique", async () => {
  const newUserDb = testEnv.authenticatedContext("newUser").firestore();
  const newProfile = profile("newUser", "New Artist", "new_artist");

  await assertSucceeds(
    runTransaction(newUserDb, async (transaction) => {
      transaction.set(doc(newUserDb, "usernames", "new_artist"), {
        uid: "newUser",
        username: "new_artist",
        updatedAt: new Date(),
      });
      transaction.set(doc(newUserDb, "users", "newUser"), newProfile);
    }),
  );

  const attackerDb = testEnv.authenticatedContext("attacker").firestore();
  const forgedProfile = profile("attacker", "Other Artist", "public_artist");
  await assertFails(
    runTransaction(attackerDb, async (transaction) => {
      transaction.set(doc(attackerDb, "usernames", "public_artist"), {
        uid: "attacker",
        username: "public_artist",
        updatedAt: new Date(),
      });
      transaction.set(doc(attackerDb, "users", "attacker"), forgedProfile);
    }),
  );
});

test("legacy notification preferences cannot be publicly read and can be migrated by their owner", async () => {
  const visitor = testEnv.unauthenticatedContext().firestore();
  const owner = testEnv.authenticatedContext("legacyUser").firestore();
  const userRef = doc(owner, "users", "legacyUser");
  const settingsRef = doc(owner, "users", "legacyUser", "private", "settings");

  await assertFails(getDoc(doc(visitor, "users", "legacyUser")));
  await assertSucceeds(
    runTransaction(owner, async (transaction) => {
      const [userSnapshot, settingsSnapshot] = await Promise.all([
        transaction.get(userRef),
        transaction.get(settingsRef),
      ]);
      assert.equal(userSnapshot.exists(), true);
      assert.equal(settingsSnapshot.exists(), true);
      transaction.update(userRef, {
        notificationPreferences: deleteField(),
      });
    }),
  );
  await assertSucceeds(getDoc(doc(visitor, "users", "legacyUser")));
});

test("post writes require the authenticated author's profile identity", async () => {
  const owner = testEnv.authenticatedContext("publicUser").firestore();
  const attacker = testEnv.authenticatedContext("attacker").firestore();
  const post = {
    authorUid: "publicUser",
    creator: "Public Artist",
    username: "public_artist",
    avatar: "P",
    avatarColor: "#e9e1f0",
    content: "A new post",
    tags: [],
    time: "Just now",
    likes: 0,
    comments: 0,
    createdAt: new Date(),
  };

  await assertSucceeds(setDoc(doc(owner, "posts", "new-post"), post));
  await assertFails(
    setDoc(doc(attacker, "posts", "forged-post"), post),
  );
  await assertSucceeds(
    updateDoc(doc(owner, "posts", "owned-post"), {
      content: "Edited post",
      tags: ["updated"],
      updatedAt: new Date(),
    }),
  );
  await assertFails(
    updateDoc(doc(attacker, "posts", "owned-post"), {
      content: "Edited by someone else",
    }),
  );
  await assertFails(
    updateDoc(doc(owner, "posts", "owned-post"), {
      creator: "A different creator",
    }),
  );
  await assertFails(deleteDoc(doc(attacker, "posts", "owned-post")));
  await assertSucceeds(deleteDoc(doc(owner, "posts", "owned-post")));
});

test("comment writes bind display name and username to the authenticated profile", async () => {
  const owner = testEnv.authenticatedContext("publicUser").firestore();
  const attacker = testEnv.authenticatedContext("attacker").firestore();
  const comment = {
    postId: "owned-post",
    authorUid: "publicUser",
    username: "public_artist",
    displayName: "Public Artist",
    avatar: "P",
    content: "A comment",
    createdAt: new Date(),
  };

  await assertSucceeds(setDoc(doc(owner, "comments", "own-comment"), comment));
  await assertFails(
    setDoc(doc(owner, "comments", "forged-comment"), {
      ...comment,
      displayName: "Other Artist",
    }),
  );
  await assertFails(deleteDoc(doc(attacker, "comments", "own-comment")));
  await assertSucceeds(deleteDoc(doc(owner, "comments", "own-comment")));
});

test("account content cleanup can delete only the signed-in user's documents", async () => {
  const owner = testEnv.authenticatedContext("publicUser").firestore();
  const [ownedPosts, ownedComments] = await Promise.all([
    getDocs(query(collection(owner, "posts"), where("authorUid", "==", "publicUser"))),
    getDocs(
      query(collection(owner, "comments"), where("authorUid", "==", "publicUser")),
    ),
  ]);
  const batch = writeBatch(owner);
  [...ownedPosts.docs, ...ownedComments.docs].forEach((document) => {
    batch.delete(document.ref);
  });

  await assertSucceeds(batch.commit());
  assert.equal((await getDoc(doc(owner, "posts", "foreign-post"))).exists(), true);
  assert.equal(
    (await getDoc(doc(owner, "comments", "foreign-comment"))).exists(),
    true,
  );
  assert.equal((await getDoc(doc(owner, "posts", "owned-post"))).exists(), false);
  assert.equal(
    (await getDoc(doc(owner, "comments", "owned-comment"))).exists(),
    false,
  );
});

test("storage uploads are owner-only, image-only, and limited to five megabytes", async () => {
  const owner = testEnv.authenticatedContext("publicUser").storage();
  const otherUser = testEnv.authenticatedContext("attacker").storage();
  const image = new Uint8Array([137, 80, 78, 71]);
  const ownerImage = ref(owner, "users/publicUser/posts/image.png");

  await assertSucceeds(
    uploadBytes(ownerImage, image, {
      contentType: "image/png",
    }),
  );
  await assertFails(
    uploadBytes(ref(otherUser, "users/publicUser/posts/forged.png"), image, {
      contentType: "image/png",
    }),
  );
  await assertFails(
    uploadBytes(ref(owner, "users/publicUser/posts/not-image.txt"), image, {
      contentType: "text/plain",
    }),
  );
  await assertFails(
    uploadBytes(
      ref(owner, "users/publicUser/posts/too-large.png"),
      new Uint8Array(5 * 1024 * 1024 + 1),
      { contentType: "image/png" },
    ),
  );
  await assertFails(
    deleteObject(ref(otherUser, "users/publicUser/posts/image.png")),
  );
  await assertSucceeds(deleteObject(ownerImage));
});
