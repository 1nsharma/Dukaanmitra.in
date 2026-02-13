import { cert, getApps, initializeApp, applicationDefault } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// This function ensures a single instance of the Firebase Admin app is initialized.
// It implements the correct singleton pattern for server-side environments.
function initAdmin() {
  // If the app is already initialized, do nothing.
  if (getApps().length) {
    return;
  }

  // In a production environment (like Firebase App Hosting or Cloud Run),
  // we use Application Default Credentials (ADC). The SDK finds the credentials automatically.
  try {
    initializeApp({
      credential: applicationDefault(),
    });
    console.log("✅ Firebase Admin initialized with Application Default Credentials (Production)");
    return;
  } catch (prodError) {
    console.warn("Production ADC initialization failed, attempting local development setup.", prodError);
  }
  
  // For local development, we fall back to a service account key from environment variables.
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    throw new Error("CRITICAL: FIREBASE_SERVICE_ACCOUNT_KEY is not set. Cannot initialize Firebase Admin SDK for local development.");
  }

  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log("⚠️  Firebase Admin initialized with a service account key (Local Development)");
  } catch (devError: any) {
    console.error("CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it's a valid, single-line JSON string.", devError.message);
    throw new Error("Could not initialize Firebase Admin SDK.");
  }
}

// Initialize the app when this module is first imported.
initAdmin();

// Export a single, shared instance of the Firestore database.
// All backend services will import and use this instance.
export const adminDb = getFirestore();
