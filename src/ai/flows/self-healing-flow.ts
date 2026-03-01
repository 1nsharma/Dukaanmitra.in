
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

/**
 * Autonomous Self-Healing Flow.
 * Recovery Engine for Stage-5 Architecture.
 */
export const selfHealingFlow = ai.defineFlow(
  {
    name: 'selfHealingFlow',
    inputSchema: z.void(),
    outputSchema: z.object({
      healed: z.number(),
      escalated: z.number(),
    }),
  },
  async () => {
    console.log('[SelfHealing] Starting recovery job...');
    
    // 1. Recovery: Stuck interactions (> 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const stuckInteractions = await adminDb.collection('interactions')
        .where('processing_status', '==', 'received')
        .where('created_at', '<', Timestamp.fromDate(oneHourAgo))
        .limit(50)
        .get();

    let escalatedCount = 0;
    for (const doc of stuckInteractions.docs) {
        await doc.ref.update({
            processing_status: 'escalated',
            escalation_reason: 'Auto-escalated: Stuck process detected.',
            updated_at: FieldValue.serverTimestamp()
        });
        escalatedCount++;
    }

    // 2. Recovery: Failed WhatsApp Outbox (Retry up to 3 times)
    const failedOutbox = await adminDb.collection('whatsapp_outbox')
        .where('status', '==', 'failed')
        .limit(20)
        .get();

    let healedCount = 0;
    for (const doc of failedOutbox.docs) {
        const data = doc.data();
        if ((data.retryCount || 0) < 3) {
            await doc.ref.update({
                status: 'pending',
                retryCount: FieldValue.increment(1),
                updated_at: FieldValue.serverTimestamp()
            });
            healedCount++;
        }
    }

    return { healed: healedCount, escalated: escalatedCount };
  }
);

export async function runSelfHealing() {
    return selfHealingFlow();
}
