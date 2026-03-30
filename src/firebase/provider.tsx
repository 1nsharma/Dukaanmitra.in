
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

// Return type for useUser() - specific to the combined user state
export interface UserHookResult {
  user: AppUser | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}


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
      setAuthUserState({ authUser: null, isAuthLoading: false, authError: null }); // No auth service, so not loading, no user.
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
      setProfileLoading(false); // Not loading if we can't fetch.
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
 * Raw hook to access the entire Firebase context state.
 */
export const useFirebase = (): FirebaseContextState => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider.');
    }
    return context;
};

/** Hook to access Firebase Auth instance. Throws if unavailable. */
export const useAuth = (): Auth => {
  const { auth, areServicesAvailable } = useFirebase();
  if (!areServicesAvailable || !auth) {
    throw new Error('Firebase Auth is not available in the current context.');
  }
  return auth;
};

/** Hook to access Firestore instance. Throws if unavailable. */
export const useFirestore = (): Firestore => {
  const { firestore, areServicesAvailable } = useFirebase();
  if (!areServicesAvailable || !firestore) {
    throw new Error('Firestore is not available in the current context.');
  }
  return firestore;
};

/** Hook to access Firebase App instance. Throws if unavailable. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp, areServicesAvailable } = useFirebase();
  if (!areServicesAvailable || !firebaseApp) {
    throw new Error('Firebase App is not available in the current context.');
  }
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
 * Hook specifically for accessing the complete authenticated user's state.
 * Returns a safe "logged out" state if Firebase services are unavailable.
 */
export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError, areServicesAvailable } = useFirebase();
  if (!areServicesAvailable) {
      return { user: null, isUserLoading: false, userError: null };
  }
  return { user, isUserLoading, userError };
};
