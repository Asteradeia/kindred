import assert from "node:assert/strict";
import { after, test } from "node:test";
import { initializeApp, deleteApp } from "firebase/app";
import {
  applyActionCode,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";

const projectId = "demo-kindred";
const app = initializeApp(
  {
    apiKey: "demo-api-key",
    authDomain: `${projectId}.firebaseapp.com`,
    projectId,
    appId: "1:1234567890:web:kindred-emulator-test",
  },
  `auth-flow-${Date.now()}`,
);
const auth = getAuth(app);
connectAuthEmulator(auth, "http://127.0.0.1:9099", {
  disableWarnings: true,
});

after(async () => {
  if (auth.currentUser) {
    await signOut(auth);
  }
  await deleteApp(app);
});

async function getActionCode(kind, email) {
  const response = await fetch(
    `http://127.0.0.1:9099/emulator/v1/projects/${projectId}/oobCodes`,
  );
  assert.equal(response.ok, true, "Auth emulator should expose action codes");
  const { oobCodes } = await response.json();
  const matchingCode = [...oobCodes]
    .reverse()
    .find((entry) => entry.email === email && entry.requestType === kind);

  assert.ok(matchingCode?.oobCode, `Expected a ${kind} code for ${email}`);
  return matchingCode.oobCode;
}

test("registration, email verification, and password recovery work in Firebase Auth", async () => {
  const email = `kindred-${Date.now()}@example.test`;
  const initialPassword = "Kindred-test-21!";
  const replacementPassword = "Kindred-updated-21!";

  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    initialPassword,
  );
  try {
    await sendEmailVerification(credential.user);
    const verificationCode = await getActionCode("VERIFY_EMAIL", email);
    await applyActionCode(auth, verificationCode);
    await reload(credential.user);
    assert.equal(credential.user.emailVerified, true);

    await sendPasswordResetEmail(auth, email);
    const resetCode = await getActionCode("PASSWORD_RESET", email);
    assert.equal(await verifyPasswordResetCode(auth, resetCode), email);
    await confirmPasswordReset(auth, resetCode, replacementPassword);
    await signOut(auth);

    const signedIn = await signInWithEmailAndPassword(
      auth,
      email,
      replacementPassword,
    );
    assert.equal(signedIn.user.emailVerified, true);
    await deleteUser(signedIn.user);
  } finally {
    if (auth.currentUser) {
      await deleteUser(auth.currentUser);
    }
  }
});
