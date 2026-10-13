
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { collection, query, where, getDocs, Timestamp, writeBatch, doc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { sendWhatsAppMessage } from '@/lib/services/whatsapp';
import { type Shop, type Customer } from '@/docs/backend-types';
import { subDays, subHours } from 'date-fns';

const firestore = getFirestore(initializeFirebase().firebaseApp);

const paymentReminderFlow = ai.defineFlow(
  {
    name: 'paymentReminderFlow',
    inputSchema: z.void(),
    outputSchema: z.object({
      processedShops: z.number(),
      remindersSent: z.number(),
      failedShops: z.number(),
    }),
  },
  async () => {
    console.log('[PaymentReminderFlow] Starting daily payment reminder check...');
    const shopsRef = collection(firestore, 'shops');
    const q = query(shopsRef, where('status', 'in', ['active', 'trial']));
    
    const shopsSnapshot = await getDocs(q);
    if (shopsSnapshot.empty) {
      console.log('[PaymentReminderFlow] No active or trial shops found.');
      return { processedShops: 0, remindersSent: 0, failedShops: 0 };
    }

    let processedShops = 0;
    let remindersSent = 0;
    let failedShops = 0;

    const threeDaysAgo = subDays(new Date(), 3);
    const twentyFourHoursAgo = subHours(new Date(), 24);

    for (const shopDoc of shopsSnapshot.docs) {
      const shop = shopDoc.data() as Shop;
      const shopId = shopDoc.id;

      try {
        const customersRef = collection(firestore, 'shops', shopId, 'customers');
        const udhaarQuery = query(customersRef, where('totalUdhaar', '>', 0));
        const customersSnapshot = await getDocs(udhaarQuery);

        if (customersSnapshot.empty) {
            processedShops++;
            continue;
        }

        const batch = writeBatch(firestore);

        for (const customerDoc of customersSnapshot.docs) {
            const customer = customerDoc.data() as Customer;

            // Reminder Eligibility Logic
            const lastPayment = customer.lastPaymentDate?.toDate();
            // Rule 1: Balance > 0 (handled by query)
            // Rule 2: Last payment > 3 days ago OR no payment ever
            if (lastPayment && lastPayment > threeDaysAgo) {
                continue;
            }
            
            // Rule 3: Last reminder > 24 hours ago
            const lastReminder = customer.lastReminderSentAt?.toDate();
            if (lastReminder && lastReminder > twentyFourHoursAgo) {
                continue;
            }

            // Rule 4: Reminder count < 7
            const reminderCount = customer.reminderCount || 0;
            if (reminderCount >= 7) {
                continue;
            }
            
            // All checks passed, send reminder.
            const reminderMessage = `🙏 Namaste ${customer.name || 'ji'},

Aapka ₹${customer.totalUdhaar} ka udhaar pending hai DukaanMitra par.
Jab bhi convenient ho, payment kar dein.

Dhanyavaad 🙂
— ${shop.name}`;
            
            await sendWhatsAppMessage(customer.phone, reminderMessage);
            
            // Log notification and update customer in a batch
            const notificationRef = doc(collection(firestore, 'notifications'));
            batch.set(notificationRef, {
                id: notificationRef.id,
                shopId: shopId,
                customerPhone: customer.phone,
                type: 'PAYMENT_REMINDER',
                sentAt: Timestamp.now(),
                status: 'sent'
            });

            const customerRef = doc(firestore, 'shops', shopId, 'customers', customer.phone);
            batch.update(customerRef, {
                lastReminderSentAt: Timestamp.now(),
                reminderCount: reminderCount + 1
            });
            
            remindersSent++;
        }
        
        await batch.commit();
        processedShops++;

      } catch (error) {
        console.error(`[PaymentReminderFlow] Failed to process reminders for shop ${shopId}:`, error);
        failedShops++;
      }
    }

    console.log(`[PaymentReminderFlow] Finished. Processed: ${processedShops}, Sent: ${remindersSent}, Failed: ${failedShops}`);
    return { processedShops, remindersSent, failedShops };
  }
);

/**
 * A simple wrapper function to easily call the flow for testing or manual triggers.
 */
export async function runPaymentReminders() {
    return paymentReminderFlow();
}
