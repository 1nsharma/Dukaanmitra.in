
import * as admin from 'firebase-admin';

// This function ensures that the Firebase Admin SDK is initialized only once.
export const initializeAdminApp = async () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. This is required for server-side operations.'
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
