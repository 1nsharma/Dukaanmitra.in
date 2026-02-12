import { cert, getApps, initializeApp, applicationDefault } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

function initAdmin() {
  if (getApps().length) return

  try {
    // ✅ PRODUCTION: Managed Identity (ADC)
    initializeApp({
      credential: applicationDefault(),
    })

    console.log("✅ Firebase Admin initialized with Managed Identity")

  } catch (err) {
    // 🧪 LOCAL DEV FALLBACK
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY for local dev")
    }

    try {
        const serviceAccount = JSON.parse(
          process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        )

        initializeApp({
          credential: cert(serviceAccount),
        })

        console.log("⚠️ Firebase Admin initialized with service account key (dev)")
    } catch(e: any) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it is a valid JSON string.", e.message);
        throw new Error("Could not initialize Firebase Admin SDK.");
    }
  }
}

initAdmin()

export const adminDb = getFirestore()
