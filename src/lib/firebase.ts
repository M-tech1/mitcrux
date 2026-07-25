"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Next.js server-renders "use client" pages once during build/prerender, where
// there's no window and these NEXT_PUBLIC_* vars may be unset — initializing
// Firebase there throws and fails the build. Defer to the browser, where the
// app is actually used (auth/firestore calls only ever happen client-side).
let app: FirebaseApp | undefined;
if (typeof window !== "undefined") {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

export const db   = app ? getFirestore(app) : (undefined as unknown as Firestore);
export const auth = app ? getAuth(app) : (undefined as unknown as Auth);
