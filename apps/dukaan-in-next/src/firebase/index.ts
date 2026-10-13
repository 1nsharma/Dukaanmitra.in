'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { Analytics, getAnalytics } from 'firebase/analytics';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase(): {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  analytics: Analytics | null;
} {
  try {
    if (getApps().length) {
      const app = getApp();
      return getSdks(app);
    }
  } catch (e) {
    // This can happen in certain SSR scenarios. We will proceed to initialize.
  }
  

  // Conditionally initialize Firebase only if the config is valid.
  // This prevents the app from crashing if environment variables are missing.
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    try {
      const firebaseApp = initializeApp(firebaseConfig);
      return getSdks(firebaseApp);
    } catch(e) {
      console.error("[Firebase] Error during initialization:", e);
      // Fall through to return null services if init fails
    }
  }

  // If config is not present, we cannot initialize Firebase.
  // Return null services to allow the app to run in a degraded mode.
  if (process.env.NODE_ENV !== 'production') {
    console.warn("[Firebase] Initialization skipped. Missing client-side 'NEXT_PUBLIC_FIREBASE_*' variables. Please create and populate .env.local");
  }
  return { firebaseApp: null, auth: null, firestore: null, analytics: null };
}

export function getSdks(firebaseApp: FirebaseApp | null): {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  analytics: Analytics | null;
} {
  if (!firebaseApp) {
    return { firebaseApp: null, auth: null, firestore: null, analytics: null };
  }
  try {
    // Check if window is defined to safely call getAnalytics
    const analytics = typeof window !== 'undefined' ? getAnalytics(firebaseApp) : null;
    return {
      firebaseApp,
      auth: getAuth(firebaseApp),
      firestore: getFirestore(firebaseApp),
      analytics,
    };
  } catch (e) {
    console.error("[Firebase] Failed to get SDK instances. This is likely due to an invalid configuration (e.g., API key).", e);
    return { firebaseApp: null, auth: null, firestore: null, analytics: null };
  }
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
