
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

interface ActionPolicy {
    risk: RiskLevel;
    requiresApproval: boolean;
}

const ACTION_POLICIES: Record<string, ActionPolicy> = {
    'ADD_LEDGER_ENTRY': { risk: 'HIGH', requiresApproval: true },
    'SEND_REMINDER': { risk: 'LOW', requiresApproval: false },
};

export async function executeAction(
  action: any, 
  actor: { id: string; role: string; shopId?: string },
  correlationId: string = crypto.randomUUID()
): Promise<{ success: boolean; message?: string }> {
  
  if (!action?.type || !action?.payload) return { success: false, message: "Malformed action." };

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
  try {
    if (action.type === 'ADD_LEDGER_ENTRY') {
        const { shopId, customerPhone, transaction } = action.payload;
        await LedgerService.addEntry(actor, shopId, {
            customerPhone,
            customerName: transaction.customer_name,
            amount: transaction.amount,
            item: transaction.items,
            type: transaction.type,
            source: actor.role === 'system' ? 'whatsapp-ai' : 'app-ai'
        }, correlationId);
    }

    return { success: true };

  } catch (error: any) {
    return { success: false, message: error.message || "Execution error." };
  }
}

async function createProposal(action: any, correlationId: string) {
    const { shopId, customerPhone, transaction } = action.payload;
    const insightRef = adminDb.collection('shops').doc(shopId).collection('insights').doc();
    
    await insightRef.set({
        id: insightRef.id,
        type: 'ACTION_REQUIRED',
        title: `Verify ${transaction.type} entry`,
        message: `${transaction.customer_name || customerPhone} ke liye ₹${transaction.amount} add karein?`,
        action_label: "Approve & Add",
        action_type: action.type,
        action_payload: action.payload,
        correlationId,
        createdAt: FieldValue.serverTimestamp(),
        isRead: false
    });
}
