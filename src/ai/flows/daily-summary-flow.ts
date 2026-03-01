
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { sendWhatsAppMessage } from '@/lib/services/whatsapp';
import { format } from 'date-fns';

const dailySummaryFlow = ai.defineFlow(
  {
    name: 'dailySummaryFlow',
    inputSchema: z.void(),
    outputSchema: z.object({
      processed: z.number(),
    }),
  },
  async () => {
    const todayStr = format(new Date(), 'yyyyMMdd');
    const lockId = `dailySummary_${todayStr}`;
    const lockRef = adminDb.collection('cron_locks').doc(lockId);

    // 1. Transactional Lock with Expiry
    const canRun = await adminDb.runTransaction(async (tx) => {
        const lockDoc = await tx.get(lockRef);
        const now = Date.now();
        
        if (lockDoc.exists) {
            const data = lockDoc.data()!;
            const expiresAt = data.expiresAt?.toMillis() || 0;
            if (now < expiresAt) {
                return false; // Lock is active
            }
        }
        
        tx.set(lockRef, {
            lockedAt: FieldValue.serverTimestamp(),
            expiresAt: Timestamp.fromMillis(now + 30 * 60 * 1000) // 30 min TTL
        });
        return true;
    });

    if (!canRun) {
        console.log(`[DailySummary] Job already running or completed for ${todayStr}.`);
        return { processed: 0 };
    }

    console.log('[DailySummary] Running summaries...');
    const shopsSnapshot = await adminDb.collection('shops').where('status', 'in', ['active', 'trial']).get();
    
    let count = 0;
    for (const shopDoc of shopsSnapshot.docs) {
        const shop = shopDoc.data();
        const ownerNumber = shop.phone;
        const message = `📊 *Aaj ka DukaanMitra Summary*\n\nBikri: ₹${shop.mrr || 0}\nCustomers: ${shop.visit_count || 0}\n\nDhanyavaad! 🙏`;
        
        await sendWhatsAppMessage(ownerNumber, message);
        count++;
    }

    return { processed: count };
  }
);

export async function runDailySummary() {
    return dailySummaryFlow();
}
