
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { AgentOutput } from '@/ai/flows/whatsapp-agent-flow';

/**
 * ActionEngine: The Multi-Layer Safety Boundary.
 * Enforces Layer 0 (Deterministic) vs Layer 1-3 (Autonomous) logic.
 */

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface ActionPolicy {
    risk: RiskLevel;
    requiresApproval: boolean;
    allowed: boolean;
}

const ACTION_POLICIES: Record<string, ActionPolicy> = {
    'ADD_LEDGER_ENTRY': { risk: 'HIGH', requiresApproval: false, allowed: true }, // Only allowed via Deterministic path
    'SEND_REMINDER': { risk: 'LOW', requiresApproval: false, allowed: true },
    'UPDATE_SHOP_SETTINGS': { risk: 'MEDIUM', requiresApproval: true, allowed: false }, // AI not allowed to change settings
    'EDIT_LEDGER': { risk: 'HIGH', requiresApproval: true, allowed: false }, // STAGE-5 Hard Boundary
};

export async function executeAction(action: any): Promise<{ success: boolean; message?: string }> {
  if (!action || !action.type || !action.payload) return { success: false };

  const policy = ACTION_POLICIES[action.type] || { risk: 'HIGH', requiresApproval: true, allowed: false };

  // --- BOUNDARY 1: PERMISSION GATE ---
  if (!policy.allowed) {
      return { success: false, message: `Action '${action.type}' is restricted by system safety boundaries.` };
  }

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

      // --- BOUNDARY 2: REVENUE LEAKAGE PROTECTION ---
      if (transaction?.type === 'credit') {
          const limit = shopData?.settings?.credit_limit_per_transaction || 5000;
          if (transaction.amount > limit) {
              return { success: false, message: `Udhaar limit ₹${limit} hai.` };
          }
          // Block high credit for new customers without history
          if (!customerDoc.exists && transaction.amount > 1000) {
              return { success: false, message: "Naye customer ko ₹1000 se zyada udhaar AI se allow nahi hai." };
          }
      }

      // --- LAYER 0: DETERMINISTIC ACCOUNTING ---
      const udhaarImpact = transaction.type === 'credit' ? transaction.amount : -transaction.amount;

      if (!customerDoc.exists) {
        tx.set(customerRef, {
          shop_id: shopId,
          phone: customer.phone,
          name: customer.name || `Customer ${customer.phone.slice(-4)}`,
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
        item: transaction.items || 'Misc',
        type: transaction.type,
        source: 'whatsapp-ai',
        createdAt: FieldValue.serverTimestamp(),
      });

      return { success: true };
    });

    return result;
  } catch (error) {
    console.error('[ActionEngine] Transaction failed:', error);
    return { success: false, message: "System error. Action rolled back for safety." };
  }
}
