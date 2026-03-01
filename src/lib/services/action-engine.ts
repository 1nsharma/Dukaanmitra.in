
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { AgentOutput } from '@/ai/flows/whatsapp-agent-flow';

/**
 * The only service allowed to write business data initiated by agents.
 * Uses atomic transactions to ensure data consistency.
 */
export async function executeAction(action: AgentOutput['action']): Promise<{ success: boolean }> {
  if (!action || !action.type || !action.payload) return { success: false };

  const { shopId, customer, transaction } = action.payload;

  try {
    await adminDb.runTransaction(async (tx) => {
      const customerRef = adminDb.collection('shops').doc(shopId).collection('customers').doc(customer.phone);
      const ledgerRef = adminDb.collection('shops').doc(shopId).collection('ledger').doc();

      const customerDoc = await tx.get(customerRef);
      const udhaarImpact = transaction.type === 'credit' ? transaction.amount : -transaction.amount;

      if (!customerDoc.exists) {
        tx.set(customerRef, {
          shop_id: shopId,
          phone: customer.phone,
          name: customer.name || 'Naya Customer',
          totalUdhaar: udhaarImpact,
          total_spent: transaction.amount,
          visit_count: 1,
          status: 'NEW',
          first_visit: FieldValue.serverTimestamp(),
          last_visit: FieldValue.serverTimestamp(),
          created_at: FieldValue.serverTimestamp(),
          updated_at: FieldValue.serverTimestamp(),
        });
      } else {
        tx.update(customerRef, {
          totalUdhaar: FieldValue.increment(udhaarImpact),
          total_spent: FieldValue.increment(transaction.amount),
          visit_count: FieldValue.increment(1),
          last_visit: FieldValue.serverTimestamp(),
          updated_at: FieldValue.serverTimestamp(),
        });
      }

      tx.set(ledgerRef, {
        shop_id: shopId,
        customerPhone: customer.phone,
        customerName: customer.name,
        amount: transaction.amount,
        item: transaction.items || 'Samaan',
        type: transaction.type,
        source: 'whatsapp',
        createdAt: FieldValue.serverTimestamp(),
      });
    });

    return { success: true };
  } catch (error) {
    console.error('[ActionEngine] Transaction failed:', error);
    return { success: false };
  }
}
