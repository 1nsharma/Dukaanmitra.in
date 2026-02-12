
import * as admin from 'firebase-admin';

// This function ensures that the Firebase Admin SDK is initialized only once.
export const initializeAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // First, try to initialize with managed identity (for production on GCP/Firebase).
  // This is the most secure method as it doesn't require storing key files.
  try {
    return admin.initializeApp();
  } catch (e) {
    console.log('Managed identity initialization failed, falling back to service account key. This is expected in local development.');
  }

  // If managed identity fails, fall back to the service account key from env variables.
  // This is primarily for local development or non-GCP environments.
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set and managed identity is not available. This is required for server-side operations.'
    );
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error.message);
    throw new Error('Could not initialize Firebase Admin SDK. Make sure the service account key is a valid JSON string.');
  }
};
