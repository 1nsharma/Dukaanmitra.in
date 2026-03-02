
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';

/**
 * ActionEngine: The Multi-Layer Safety Boundary.
 * 
 * SCALING OPTIMIZATION:
 * Removed Transactions for counter updates. Using FieldValue.increment() instead.
 * This prevents the "Customer Document Contention" identified in the audit.
 */

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface ActionPolicy {
    risk: RiskLevel;
    requiresApproval: boolean;
    allowed: boolean;
}

const ACTION_POLICIES: Record<string, ActionPolicy> = {
    'ADD_LEDGER_ENTRY': { risk: 'HIGH', requiresApproval: true, allowed: true },
    'SEND_REMINDER': { risk: 'LOW', requiresApproval: false, allowed: true },
    'UPDATE_SHOP_SETTINGS': { risk: 'MEDIUM', requiresApproval: true, allowed: false },
};

export async function executeAction(action: any, actorType: 'system' | 'owner' = 'system'): Promise<{ success: boolean; message?: string }> {
  if (!action || !action.type || !action.payload) return { success: false, message: "Invalid action structure." };

  const policy = ACTION_POLICIES[action.type] || { risk: 'HIGH', requiresApproval: true, allowed: false };

  // --- BOUNDARY 1: PERMISSION GATE ---
  if (!policy.allowed) {
      return { success: false, message: `Action '${action.type}' is restricted.` };
  }

  // --- BOUNDARY 2: APPROVAL GATE ---
  if (policy.requiresApproval && actorType === 'system') {
      console.log(`[ActionEngine] Action ${action.type} requires manual approval.`);
      await createActionableInsight(action);
      return { success: true, message: "Action queued for owner approval." };
  }

  const { shopId, customerPhone, transaction } = action.payload;

  try {
    const shopRef = adminDb.collection('shops').doc(shopId);
    const customerRef = shopRef.collection('customers').doc(customerPhone);
    const ledgerRef = shopRef.collection('ledger').doc();

    const udhaarImpact = transaction.type === 'credit' ? transaction.amount : -transaction.amount;

    // SCALING FIX: Parallel writes without transactional locks.
    // increment() is atomic and does not require a read lock.
    const batch = adminDb.batch();

    const customerDoc = await customerRef.get();
    if (!customerDoc.exists) {
        batch.set(customerRef, {
            shop_id: shopId,
            phone: customerPhone,
            name: transaction.customerName || `Customer ${customerPhone.slice(-4)}`,
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
        batch.update(customerRef, {
            totalUdhaar: FieldValue.increment(udhaarImpact),
            total_spent: FieldValue.increment(transaction.amount),
            visit_count: FieldValue.increment(1),
            last_visit: FieldValue.serverTimestamp(),
            updated_at: FieldValue.serverTimestamp(),
        });
    }

    batch.set(ledgerRef, {
        id: ledgerRef.id,
        shop_id: shopId,
        customerPhone: customerPhone,
        customerName: transaction.customerName,
        amount: transaction.amount,
        item: transaction.items || 'Misc',
        type: transaction.type,
        source: actorType === 'owner' ? 'app-ai' : 'whatsapp-ai',
        createdAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();
    return { success: true };

  } catch (error) {
    console.error('[ActionEngine] Execution failed:', error);
    return { success: false, message: "System error during execution." };
  }
}

async function createActionableInsight(action: any) {
    const { shopId, customerPhone, transaction } = action.payload;
    const insightRef = adminDb.collection('shops').doc(shopId).collection('insights').doc();
    
    await insightRef.set({
        id: insightRef.id,
        type: 'ACTION_REQUIRED',
        title: `Verify ${transaction.type} entry`,
        message: `${transaction.customerName || customerPhone} ke liye ₹${transaction.amount} ki entry add karein?`,
        action_label: 'Approve & Add',
        action_type: action.type,
        action_payload: action.payload,
        createdAt: FieldValue.serverTimestamp(),
        isRead: false
    });
}
