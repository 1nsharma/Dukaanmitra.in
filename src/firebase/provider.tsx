'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, onSnapshot } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import type { UserProfile } from '@/docs/backend-types';

// The new combined user type, including Auth data and Firestore profile data.
export type AppUser = User & Partial<UserProfile>;

// Internal state for user authentication from Firebase Auth
interface AuthUserState {
  authUser: User | null;
  isAuthLoading: boolean;
  authError: Error | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean; // True if core services (app, firestore, auth instance) are provided
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // The Auth service instance
  // The fully combined user object
  user: AppUser | null;
  isUserLoading: boolean; // A single loading flag for the entire user state
  userError: Error | null; // Any error from auth or profile fetching
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: AppUser | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useUser() - specific to the combined user state
export interface UserHookResult {
  user: AppUser | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [authUserState, setAuthUserState] = useState<AuthUserState>({
    authUser: null,
    isAuthLoading: true, // Start loading until first auth event
    authError: null,
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<Error | null>(null);

  // Effect to subscribe to Firebase Auth state changes
  useEffect(() => {
    if (!auth) {
      setAuthUserState({ authUser: null, isAuthLoading: false, authError: new Error("Auth service not provided.") });
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setAuthUserState({ authUser: firebaseUser, isAuthLoading: false, authError: null });
      },
      (error) => {
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setAuthUserState({ authUser: null, isAuthLoading: false, authError: error });
      }
    );
    return () => unsubscribe();
  }, [auth]);

  // Effect to subscribe to the user's profile in Firestore, dependent on auth state
  useEffect(() => {
    if (!authUserState.authUser || !firestore) {
      setUserProfile(null);
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);
    const profileRef = doc(firestore, 'users', authUserState.authUser.uid);

    const unsubscribe = onSnapshot(profileRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          // User profile doesn't exist. This might be a new user.
          setUserProfile(null);
        }
        setProfileLoading(false);
        setProfileError(null);
      },
      (error) => {
        console.error("Error fetching user profile:", error);
        setProfileError(error);
        setUserProfile(null);
        setProfileLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authUserState.authUser, firestore]);

  // Memoize the final combined context value
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    const combinedUser = authUserState.authUser
      ? { ...authUserState.authUser, ...(userProfile || {}) } as AppUser
      : null;
    
    // The user is loading if auth is loading, OR if we have an auth user but are still waiting for their profile.
    const isUserLoading = authUserState.isAuthLoading || (!!authUserState.authUser && isProfileLoading);

    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: combinedUser,
      isUserLoading: isUserLoading,
      userError: authUserState.authError || profileError,
    };
  }, [firebaseApp, firestore, auth, authUserState, userProfile, isProfileLoading, profileError]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

/**
 * Hook specifically for accessing the complete authenticated user's state,
 * including both auth details and Firestore profile data.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError } = useFirebase();
  return { user, isUserLoading, userError };
};
