const ENV = process.env.NEXT_PUBLIC_APP_ENV;

// Environment Guard: Prevent production configs from running in non-production environments.
if (ENV === "production" && process.env.NODE_ENV !== "production") {
  throw new Error("FATAL: Production environment variables are being used in a non-production build. Aborting.");
}

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

// Runtime validation to ensure all required Firebase environment variables are set.
// This prevents the app from running with a silent misconfiguration.
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`[Firebase Config] Missing required environment variable: ${envVar}. Please check your .env file.`);
  }
}

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
