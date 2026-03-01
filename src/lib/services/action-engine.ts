
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { AgentOutput } from '@/ai/flows/whatsapp-agent-flow';

/**
 * ActionEngine: The Safety Boundary Layer.
 * Ensures business rules are never bypassed by AI.
 */
export async function executeAction(action: AgentOutput['action']): Promise<{ success: boolean; message?: string }> {
  if (!action || !action.type || !action.payload) return { success: false };

  const { shopId, customer, transaction } = action.payload;

  try {
    const result = await adminDb.runTransaction(async (tx) => {
      const shopRef = adminDb.collection('shops').doc(shopId);
      const customerRef = shopRef.collection('customers').doc(customer.phone);
      const ledgerRef = shopRef.collection('ledger').doc();

      const [shopDoc, customerDoc] = await Promise.all([
        tx.get(shopRef),
        tx.get(customerRef)
      ]);

      if (!shopDoc.exists) return { success: false, message: "Shop not found." };
      const shopData = shopDoc.data();

      // --- BOUNDARY 1: REVENUE LEAKAGE PROTECTION ---
      if (transaction.type === 'credit') {
          // If customer is NEW and requesting credit > 1000, block it.
          if (!customerDoc.exists && transaction.amount > 1000) {
              return { success: false, message: "Naye customer ko ₹1000 se zyada udhaar allow nahi hai. Dashboard se karein." };
          }
          
          // Check shop-specific credit limit
          const limit = shopData?.settings?.credit_limit_per_transaction || 5000;
          if (transaction.amount > limit) {
              return { success: false, message: `Udhaar limit ₹${limit} hai.` };
          }
      }

      // --- ATOMIC STATE UPDATE ---
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

      return { success: true };
    });

    return result;
  } catch (error) {
    console.error('[ActionEngine] Transaction failed:', error);
    return { success: false, message: "Internal Error. Transaction Rolled Back." };
  }
}
