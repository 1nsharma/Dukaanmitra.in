
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { collection, query, where, getDocs, Timestamp, writeBatch, doc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { sendWhatsAppMessage } from '@/lib/services/whatsapp';
import { type Shop } from '@/docs/backend-types';
import { addDays } from 'date-fns';

const firestore = getFirestore(initializeFirebase().firebaseApp);

const subscriptionRenewalFlow = ai.defineFlow(
  {
    name: 'subscriptionRenewalFlow',
    inputSchema: z.void(),
    outputSchema: z.object({
      remindersSent: z.number(),
      failedShops: z.number(),
    }),
  },
  async () => {
    console.log('[SubscriptionRenewalFlow] Starting subscription renewal reminder check...');
    
    const now = new Date();
    const threeDaysFromNow = addDays(now, 3);

    const shopsRef = collection(firestore, 'shops');
    // Query for active shops whose subscription is ending within the next 3 days.
    const q = query(
        shopsRef, 
        where('status', '==', 'active'),
        where('paid_till', '>=', Timestamp.fromDate(now)),
        where('paid_till', '<=', Timestamp.fromDate(threeDaysFromNow))
    );
    
    const shopsSnapshot = await getDocs(q);
    if (shopsSnapshot.empty) {
      console.log('[SubscriptionRenewalFlow] No shops need a renewal reminder today.');
      return { remindersSent: 0, failedShops: 0 };
    }

    let remindersSent = 0;
    let failedShops = 0;
    const batch = writeBatch(firestore);


    for (const shopDoc of shopsSnapshot.docs) {
      const shop = shopDoc.data() as Shop;
      const shopId = shopDoc.id;
      const ownerNumber = shop.phone.startsWith('+') ? shop.phone : `+91${shop.phone}`;

      try {
        if (!ownerNumber) {
            console.warn(`[SubscriptionRenewalFlow] Shop ${shopId} has no phone number. Skipping.`);
            failedShops++;
            continue;
        }
            
        const reminderMessage = `🔔 Reminder: Aapka DukaanMitra subscription 3 din me expire ho raha hai.

Service bina ruke continue karne ke liye, 'PAY' likh kar bhejein ya apne dashboard se payment karein.`;
        
        await sendWhatsAppMessage(ownerNumber, reminderMessage);
        
        // Log that a notification was sent
        const notificationRef = doc(collection(firestore, 'notifications'));
        batch.set(notificationRef, {
            id: notificationRef.id,
            shopId: shopId,
            customerPhone: ownerNumber, // In this case, the customer is the owner
            type: 'SUBSCRIPTION_REMINDER',
            sentAt: Timestamp.now(),
            status: 'sent'
        });
        
        remindersSent++;

      } catch (error) {
        console.error(`[SubscriptionRenewalFlow] Failed to process reminder for shop ${shopId}:`, error);
        failedShops++;
      }
    }
    
    await batch.commit();

    console.log(`[SubscriptionRenewalFlow] Finished. Sent: ${remindersSent}, Failed: ${failedShops}`);
    return { remindersSent, failedShops };
  }
);

/**
 * A simple wrapper function to easily call the flow for testing or manual triggers.
 */
export async function runSubscriptionReminders() {
    return subscriptionRenewalFlow();
}
