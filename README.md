# Kindred
Kindred is a creative social platform concept designed to bring artists, writers, game developers, craftspeople and other creatives together in one community.

## Firebase security

Configure the `NEXT_PUBLIC_FIREBASE_*` environment variables for your Firebase project, then deploy the repository's Firestore and Storage rules before using account or content writes:

```sh
firebase deploy --only firestore:rules,storage
```

New posts and comments are stored in Firebase and tied to the authenticated profile. Existing browser-stored posts and comments remain read-only legacy content; they are not imported because their authors cannot be verified.

Account deletion removes the user's Firebase posts, comments, uploaded post images, profile, and username. Legacy/demo content is unaffected.

### Local Firebase integration tests

The emulator suite requires Java 21 or newer. Run the authentication lifecycle and Firestore/Storage rules tests with:

```sh
npm run test:integration
```

To run the app against the local emulators, start them with `firebase emulators:start --only auth,firestore,storage --project demo-kindred`, then set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` and `NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-kindred` before `npm run dev`. These settings keep local testing away from live Firebase services.
