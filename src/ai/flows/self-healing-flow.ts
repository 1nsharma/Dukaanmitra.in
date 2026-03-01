
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

/**
 * Autonomous Self-Healing Flow.
 * Scans for failed interactions and stuck messages to perform recovery.
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
    console.log('[SelfHealing] Starting job...');
    
    // 1. Identify "Stuck" interactions from the last 2 hours
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const failedSnapshot = await adminDb.collection('interactions')
        .where('processing_status', '==', 'received')
        .where('created_at', '<', Timestamp.fromDate(oneHourAgo))
        .limit(20)
        .get();

    let healedCount = 0;
    let escalatedCount = 0;

    for (const doc of failedSnapshot.docs) {
        const data = doc.data();
        
        // Strategy: If it was stuck in 'received' for an hour, it likely crashed.
        // We move it to 'escalated' so it appears on the Super Admin radar.
        await doc.ref.update({
            processing_status: 'escalated',
            escalation_reason: 'Stuck process auto-escalated by Self-Healing Job.',
            updated_at: FieldValue.serverTimestamp()
        });
        escalatedCount++;
    }

    // 2. Identify failed WhatsApp Outbox sends and reset them for retry if retryCount < 3
    const outboxSnapshot = await adminDb.collection('whatsapp_outbox')
        .where('status', '==', 'failed')
        .limit(20)
        .get();

    for (const doc of outboxSnapshot.docs) {
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
