
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';

export const dynamic = 'force-dynamic';

/**
 * MITRAOS RUNTIME WARMUP
 * 
 * This endpoint is hit by a 5-min scheduler to:
 * 1. Prevent Cloud Function cold starts.
 * 2. Ensure Next.js runtimes are ready for WhatsApp webhooks.
 * 3. Heartbeat check for Firebase connection.
 */
export async function GET() {
  const start = Date.now();
  
  try {
    const { firestore } = initializeFirebase();
    const isConfigured = !!firestore;

    return NextResponse.json({
      status: 'hot',
      timestamp: new Date().toISOString(),
      latency_ms: Date.now() - start,
      configured: isConfigured
    });
  } catch (e) {
    return NextResponse.json({ status: 'error', message: (e as Error).message }, { status: 500 });
  }
}
