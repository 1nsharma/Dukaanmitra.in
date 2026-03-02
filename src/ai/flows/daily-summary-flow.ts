'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { sendWhatsAppMessage } from '@/lib/services/whatsapp';
import { format, subDays } from 'date-fns';

/**
 * Daily Summary Flow (Level 5 Optimized).
 * Aggregates sales, visits, and retention signals.
 */
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

    const canRun = await adminDb.runTransaction(async (tx) => {
        const lockDoc = await tx.get(lockRef);
        const now = Date.now();
        
        if (lockDoc.exists) {
            const data = lockDoc.data()!;
            const expiresAt = data.expiresAt?.toMillis() || 0;
            if (now < expiresAt) return false;
        }
        
        tx.set(lockRef, {
            lockedAt: FieldValue.serverTimestamp(),
            expiresAt: Timestamp.fromMillis(now + 30 * 60 * 1000)
        });
        return true;
    });

    if (!canRun) {
        console.log(`[DailySummary] Job already running or completed for ${todayStr}.`);
        return { processed: 0 };
    }

    const thirtyDaysAgo = subDays(new Date(), 30);
    const shopsSnapshot = await adminDb.collection('shops').where('status', 'in', ['active', 'trial']).get();
    
    let count = 0;
    for (const shopDoc of shopsSnapshot.docs) {
        const shopId = shopDoc.id;
        const shop = shopDoc.data();
        
        // Retention Check (Level 5 Scenario C)
        const atRiskSnapshot = await adminDb.collection('shops').doc(shopId)
            .collection('customers')
            .where('last_visit', '<', Timestamp.fromDate(thirtyDaysAgo))
            .limit(10)
            .get();

        const atRiskCount = atRiskSnapshot.size;
        if (atRiskCount > 0) {
            await adminDb.collection('shops').doc(shopId).collection('insights').add({
                type: 'RISK_ALERT',
                title: 'Retention Alert',
                message: `${atRiskCount} customers haven't visited in 30 days. Win-back campaign run karein?`,
                createdAt: FieldValue.serverTimestamp(),
                isRead: false
            });
        }

        const message = `📊 *Aaj ka DukaanMitra Summary*\n\nBikri: ₹${shop.mrr || 0}\nCustomers: ${shop.visit_count || 0}\n\n*Retention Note:* ${atRiskCount} customers at risk.\n\nKal aur better karein 🚀`;
        
        if (shop.phone) {
            await sendWhatsAppMessage(shop.phone, message);
        }
        count++;
    }

    return { processed: count };
  }
);

export async function runDailySummary() {
    return dailySummaryFlow();
}
