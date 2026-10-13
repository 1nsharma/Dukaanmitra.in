
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { LedgerService } from '../modules/ledger/services/ledger-service';
import crypto from 'crypto';

/**
 * ActionEngine: The Multi-Layer Safety Boundary.
 * 
 * AI proposes -> Owner approves -> Service executes.
 */

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
type TransactionType = 'credit' | 'payment';

interface ExecuteActionPayload {
    shopId?: string;
    customerPhone?: string;
    transaction?: {
        customer_name?: string;
        amount?: number;
        items?: string;
        type?: TransactionType;
    };
}

interface ExecuteActionInput {
    type?: string;
    payload?: Partial<ExecuteActionPayload>;
}

interface ActionActor {
  id: string;
  role: string;
  shopId?: string;
}

interface ActionPolicy {
    risk: RiskLevel;
    requiresApproval: boolean;
}

const ACTION_POLICIES: Record<string, ActionPolicy> = {
    'ADD_LEDGER_ENTRY': { risk: 'HIGH', requiresApproval: true },
    'SEND_REMINDER': { risk: 'LOW', requiresApproval: false },
};

export async function executeAction(
  action: ExecuteActionInput | null | undefined, 
  actor: Partial<ActionActor> | null | undefined,
  correlationId: string = crypto.randomUUID()
): Promise<{ success: boolean; message?: string }> {
  try {
    if (!action?.type || !action?.payload?.shopId || !actor?.id || !actor?.role) {
      return { success: false, message: "Malformed action." };
    }

    const shopId = action.payload.shopId;
    const shopDoc = await adminDb.collection('shops').doc(shopId).get();
    const shopData = shopDoc.data();

    if (shopData?.status === 'locked' || shopData?.status === 'suspended') {
        return { success: false, message: "Subscription required." };
    }

    const policy = ACTION_POLICIES[action.type] || { risk: 'HIGH', requiresApproval: true };

    // Layer 1: Proposal Logic (System-generated proposals)
    if (policy.requiresApproval && actor.role === 'system') {
        await createProposal(action, correlationId);
        return { success: true, message: "Aapka entry check ke liye dashboard par bhej diya gaya hai. 👍" };
    }

    // Layer 2: Domain Execution
    if (action.type === 'ADD_LEDGER_ENTRY') {
        const { shopId, customerPhone, transaction } = action.payload;
        const transactionType = transaction?.type;
        const safeAmount = typeof transaction?.amount === 'number' && Number.isFinite(transaction.amount) ? transaction.amount : 0;
        if (!customerPhone || !transaction || !transactionType || (transactionType !== 'credit' && transactionType !== 'payment')) {
          return { success: false, message: 'Invalid ledger transaction payload.' };
        }

        await LedgerService.addEntry(actor as ActionActor, shopId, {
            customerPhone,
            customerName: transaction.customer_name || undefined,
            amount: safeAmount,
            item: transaction.items || undefined,
            type: transactionType,
            source: actor.role === 'system' ? 'whatsapp-ai' : 'app-ai'
        }, correlationId);
    }

    return { success: true };

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Execution error.";
    console.error('[API_ERROR] Action execution failed', { correlationId, message });
    return { success: false, message };
  }
}

async function createProposal(action: ExecuteActionInput, correlationId: string) {
    try {
      const { shopId, customerPhone, transaction } = action.payload || {};
      if (!shopId) {
        throw new Error('Missing shopId for proposal creation.');
      }
      const insightRef = adminDb.collection('shops').doc(shopId).collection('insights').doc();
      
      await insightRef.set({
          id: insightRef.id,
          type: 'ACTION_REQUIRED',
          title: `Verify ${transaction?.type || 'transaction'} entry`,
          message: `${transaction?.customer_name || customerPhone || 'Customer'} ke liye ₹${transaction?.amount ?? 0} add karein?`,
          action_label: "Approve & Add",
          action_type: action.type,
          action_payload: action.payload,
          correlationId,
          createdAt: FieldValue.serverTimestamp(),
          isRead: false
      });
    } catch (error) {
      console.error('[API_ERROR] createProposal failed', { correlationId, error });
      throw error;
    }
}
