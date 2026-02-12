'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { sendWhatsAppMessage } from '@/lib/services/whatsapp';
import { type Shop, type LedgerEntry, type Customer } from '@/docs/backend-types';

const firestore = getFirestore(initializeFirebase().firebaseApp);

// This flow is designed to be triggered by a scheduler (e.g., a cron job).
export const dailySummaryFlow = ai.defineFlow(
  {
    name: 'dailySummaryFlow',
    inputSchema: z.void(),
    outputSchema: z.object({
      processedShops: z.number(),
      failedShops: z.number(),
    }),
  },
  async () => {
    console.log('[DailySummaryFlow] Starting daily summary generation...');
    const shopsRef = collection(firestore, 'shops');
    const q = query(shopsRef, where('status', 'in', ['active', 'trial']));
    
    const shopsSnapshot = await getDocs(q);
    if (shopsSnapshot.empty) {
      console.log('[DailySummaryFlow] No active or trial shops found.');
      return { processedShops: 0, failedShops: 0 };
    }

    let processedCount = 0;
    let failedCount = 0;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStartTimestamp = Timestamp.fromDate(todayStart);

    for (const shopDoc of shopsSnapshot.docs) {
      const shop = shopDoc.data() as Shop;
      const shopId = shopDoc.id;

      try {
        // 1. Calculate Total Sales and Visits for today
        const ledgerRef = collection(firestore, 'shops', shopId, 'ledger');
        const ledgerQuery = query(ledgerRef, where('createdAt', '>=', todayStartTimestamp));
        const ledgerSnapshot = await getDocs(ledgerQuery);
        
        let totalSales = 0;
        ledgerSnapshot.forEach(doc => {
          totalSales += (doc.data() as LedgerEntry).amount;
        });
        const totalVisits = ledgerSnapshot.size;

        // 2. Calculate New and Loyal Customers
        const customersRef = collection(firestore, 'shops', shopId, 'customers');
        const newCustomersQuery = query(customersRef, where('created_at', '>=', todayStartTimestamp));
        const loyalCustomersQuery = query(customersRef, where('visit_count', '>=', 5));
        
        const newCustomersSnapshot = await getDocs(newCustomersQuery);
        const loyalCustomersSnapshot = await getDocs(loyalCustomersQuery);

        const newCustomersCount = newCustomersSnapshot.size;
        const loyalCustomersCount = loyalCustomersSnapshot.size;

        // 3. Construct and send the message
        const summaryMessage = `
📊 *Aaj ka DukaanMitra Summary*

Total Sales: *₹${totalSales.toLocaleString('en-IN')}*
Total Visits: *${totalVisits}*
New Customers: *${newCustomersCount}*
Loyal Customers: *${loyalCustomersCount}*

Keep growing 💪
        `.trim();
        
        // Assuming shop.phone is the owner's WhatsApp number for notifications
        if (shop.phone) {
            // Using the full international format for the WhatsApp API
            const ownerNumber = shop.phone.startsWith('+') ? shop.phone : `+91${shop.phone}`;
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

    console.log(`[DailySummaryFlow] Finished. Processed: ${processedCount}, Failed: ${failedCount}`);
    return { processedShops: processedCount, failedShops: failedCount };
  }
);

/**
 * A simple wrapper function to easily call the flow for testing or manual triggers.
 */
export async function runDailySummary() {
    return dailySummaryFlow();
}
