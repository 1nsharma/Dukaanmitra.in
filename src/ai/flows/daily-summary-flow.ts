

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { collection, query, where, getDocs, Timestamp, writeBatch, doc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { sendWhatsAppMessage } from '@/lib/services/whatsapp';
import { type Shop, type LedgerEntry, type Customer } from '@/docs/backend-types';
import { isPast } from 'date-fns';

const firestore = getFirestore(initializeFirebase().firebaseApp);

// This flow is designed to be triggered by a scheduler (e.g., a cron job).
export const dailySummaryFlow = ai.defineFlow(
  {
    name: 'dailySummaryFlow',
    inputSchema: z.void(),
    outputSchema: z.object({
      processedShops: z.number(),
      failedShops: z.number(),
      lockedShops: z.number(),
    }),
  },
  async () => {
    console.log('[DailySummaryFlow] Starting daily summary and subscription management...');
    // Process all shops that are not cancelled or suspended
    const shopsRef = collection(firestore, 'shops');
    const q = query(shopsRef, where('status', 'in', ['active', 'trial']));
    
    const shopsSnapshot = await getDocs(q);
    if (shopsSnapshot.empty) {
      console.log('[DailySummaryFlow] No relevant shops found.');
      return { processedShops: 0, failedShops: 0, lockedShops: 0 };
    }

    let processedCount = 0;
    let failedCount = 0;
    let lockedCount = 0;
    
    const batch = writeBatch(firestore);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStartTimestamp = Timestamp.fromDate(todayStart);

    for (const shopDoc of shopsSnapshot.docs) {
      const shop = shopDoc.data() as Shop;
      const shopId = shopDoc.id;
      const ownerNumber = shop.phone.startsWith('+') ? shop.phone : `+91${shop.phone}`;

      try {
        // --- Subscription & Trial Management Logic ---
        let shouldLock = false;
        let lockReason = '';

        if (shop.status === 'trial' && shop.trial_ends_at && isPast(shop.trial_ends_at.toDate())) {
            console.log(`[DailySummaryFlow] Trial for shop ${shopId} has expired. Locking account.`);
            shouldLock = true;
            lockReason = 'Trial Expired';
        } else if (shop.status === 'active' && shop.paid_till && isPast(shop.paid_till.toDate())) {
            console.log(`[DailySummaryFlow] Subscription for shop ${shopId} has expired. Locking account.`);
            shouldLock = true;
            lockReason = 'Subscription Expired';
        }

        if (shouldLock) {
            const shopRef = shopDoc.ref;
            batch.update(shopRef, { status: 'locked' });
            lockedCount++;
            
            // Send notification to shopkeeper about expiry
            if(ownerNumber) {
                await sendWhatsAppMessage(ownerNumber, `Aapka DukaanMitra plan expire ho gaya hai (${lockReason}). Service continue karne ke liye, apne customer number se 'PAY' likh kar bhejein ya dashboard se payment karein.`);
            }
            
            // Don't send a summary to a newly locked shop
            continue;
        }
        
        // --- Daily Summary Logic (only for 'active' or 'trial' shops) ---
        if (shop.status !== 'active' && shop.status !== 'trial') {
            processedCount++;
            continue;
        }

        const ledgerRef = collection(firestore, 'shops', shopId, 'ledger');
        const ledgerQuery = query(ledgerRef, where('createdAt', '>=', todayStartTimestamp));
        const ledgerSnapshot = await getDocs(ledgerQuery);
        
        let totalSales = 0;
        ledgerSnapshot.forEach(doc => {
          totalSales += (doc.data() as LedgerEntry).amount;
        });
        const totalVisits = ledgerSnapshot.size;

        const customersRef = collection(firestore, 'shops', shopId, 'customers');
        const newCustomersQuery = query(customersRef, where('created_at', '>=', todayStartTimestamp));
        const loyalCustomersQuery = query(customersRef, where('visit_count', '>=', 5));
        
        const newCustomersSnapshot = await getDocs(newCustomersQuery);
        const loyalCustomersSnapshot = await getDocs(loyalCustomersQuery);

        const newCustomersCount = newCustomersSnapshot.size;
        const loyalCustomersCount = loyalCustomersSnapshot.size;

        const summaryMessage = `
📊 *Aaj ka DukaanMitra Summary*

Total Sales: *₹${totalSales.toLocaleString('en-IN')}*
Total Visits: *${totalVisits}*
New Customers: *${newCustomersCount}*
Loyal Customers: *${loyalCustomersCount}*

Kal ke liye shubhkamnayein! 💪
        `.trim();
        
        if (ownerNumber) {
            await sendWhatsAppMessage(ownerNumber, summaryMessage);
            console.log(`[DailySummaryFlow] Sent summary to shop ${shopId} (${shop.name})`);
            processedCount++;
        } else {
            console.warn(`[DailySummaryFlow] Shop ${shopId} has no phone number. Skipping.`);
            failedCount++;
        }

      } catch (error) {
        console.error(`[DailySummaryFlow] Failed to process summary for shop ${shopId}:`, error);
        failedCount++;
      }
    }
    
    // Commit any status changes for expired trials or subscriptions
    if (lockedCount > 0) {
        await batch.commit();
        console.log(`[DailySummaryFlow] Committed ${lockedCount} shop(s) to 'locked' status.`);
    }


    console.log(`[DailySummaryFlow] Finished. Processed: ${processedCount}, Failed: ${failedCount}, Locked: ${lockedCount}`);
    return { processedShops: processedCount, failedShops: failedCount, lockedShops: lockedCount };
  }
);

/**
 * A simple wrapper function to easily call the flow for testing or manual triggers.
 */
export async function runDailySummary() {
    return dailySummaryFlow();
}
