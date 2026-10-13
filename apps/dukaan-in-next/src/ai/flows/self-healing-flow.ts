'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

/**
 * Autonomous Self-Healing Flow.
 * Recovery Engine for Stage-5 Architecture.
 * Fixes "Stuck" interactions and retries failed messaging ops.
 */
const selfHealingFlow = ai.defineFlow(
  {
    name: 'selfHealingFlow',
    inputSchema: z.void(),
    outputSchema: z.object({
      healedInteractions: z.number(),
      healedOutbox: z.number(),
    }),
  },
  async () => {
    console.log('[SelfHealing] Starting autonomous recovery job...');
    
    // 1. Recovery: Stuck interactions (> 1 hour in 'received' or 'processing')
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const stuckInteractions = await adminDb.collection('interactions')
        .where('processing_status', 'in', ['received', 'processing'])
        .where('created_at', '<', Timestamp.fromDate(oneHourAgo))
        .limit(50)
        .get();

    let healedInteractions = 0;
    for (const doc of stuckInteractions.docs) {
        await doc.ref.update({
            processing_status: 'failed',
            error_details: 'Auto-escalated: Stuck process detected during self-healing.',
            updated_at: FieldValue.serverTimestamp()
        });
        healedInteractions++;
    }

    // 2. Recovery: Failed WhatsApp Outbox (Retry up to 3 times)
    const failedOutbox = await adminDb.collection('whatsapp_outbox')
        .where('status', '==', 'failed')
        .limit(20)
        .get();

    let healedOutbox = 0;
    for (const doc of failedOutbox.docs) {
        const data = doc.data();
        if ((data.retryCount || 0) < 3) {
            await doc.ref.update({
                status: 'pending',
                retryCount: FieldValue.increment(1),
                updated_at: FieldValue.serverTimestamp()
            });
            healedOutbox++;
        }
    }

    return { healedInteractions, healedOutbox };
  }
);

export async function runSelfHealing() {
    return selfHealingFlow();
}
