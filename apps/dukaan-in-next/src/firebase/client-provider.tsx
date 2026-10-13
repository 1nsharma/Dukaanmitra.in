
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, AlertCircle } from 'lucide-react';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  const servicesAvailable = !!(firebaseServices.firebaseApp && firebaseServices.auth && firebaseServices.firestore);

  // Identify which specific core config is missing for better debugging
  const missingKeys = [];
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) missingKeys.push('API_KEY');
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) missingKeys.push('PROJECT_ID');

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {!servicesAvailable && (
        <div className="container py-8 max-w-4xl mx-auto">
            <Alert variant="destructive" className="border-2 shadow-lg">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="text-lg font-bold">Action Required: Configuration Missing</AlertTitle>
                <AlertDescription className="mt-2 space-y-3">
                    <p>
                        DukaanMitra cannot connect to your database. Please ensure you have added the following keys to your <strong>Vercel Environment Variables</strong> (for production) or <strong>.env.local</strong> (for local development):
                    </p>
                    <ul className="list-disc list-inside font-mono text-xs bg-black/10 p-3 rounded">
                        {missingKeys.length > 0 ? (
                          missingKeys.map(key => <li key={key}>{`NEXT_PUBLIC_FIREBASE_${key}`}</li>)
                        ) : (
                          <li>Missing one or more required Firebase SDK fields.</li>
                        )}
                    </ul>
                    <p className="text-sm italic">
                        Note: After adding keys to Vercel, you must <strong>Redeploy</strong> your project for changes to take effect.
                    </p>
                </AlertDescription>
            </Alert>
        </div>
      )}
      {children}
    </FirebaseProvider>
  );
}
