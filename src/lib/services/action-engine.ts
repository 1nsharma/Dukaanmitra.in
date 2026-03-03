
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { LedgerService } from '../modules/ledger/services/ledger-service';

/**
 * ActionEngine: The Multi-Layer Safety Boundary (Modular Monolith Refactored).
 * 
 * Routes actions to domain services and enforces the "Human-in-the-loop" 
 * requirement for high-risk operations.
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
    'REQUEST_REVIEW': { risk: 'LOW', requiresApproval: true, allowed: true },
    'UPDATE_SHOP_SETTINGS': { risk: 'MEDIUM', requiresApproval: true, allowed: false },
};

export async function executeAction(action: any, actorType: 'system' | 'owner' = 'system'): Promise<{ success: boolean; message?: string }> {
  if (!action || !action.type || !action.payload) return { success: false, message: "Invalid action structure." };

  const policy = ACTION_POLICIES[action.type] || { risk: 'HIGH', requiresApproval: true, allowed: false };

  if (!policy.allowed) {
      return { success: false, message: `Action '${action.type}' is restricted.` };
  }

  // Approval Gate: AI is a proposer, not an executor
  if (policy.requiresApproval && actorType === 'system') {
      console.log(`[ActionEngine] Action ${action.type} queued for manual approval.`);
      await createActionableInsight(action);
      return { success: true, message: "Action queued for owner approval." };
    }

  try {
    const actor = { id: actorType === 'system' ? 'system' : 'owner', role: actorType === 'system' ? 'system' : 'owner' };

    if (action.type === 'ADD_LEDGER_ENTRY') {
        const { shopId, customerPhone, transaction } = action.payload;
        await LedgerService.addEntry(actor, shopId, {
            customerPhone,
            customerName: transaction.customerName,
            amount: transaction.amount,
            item: transaction.items,
            type: transaction.type,
            source: actorType === 'owner' ? 'app-ai' : 'whatsapp-ai'
        });
    }

    return { success: true };

  } catch (error) {
    console.error('[ActionEngine] Execution failed:', error);
    return { success: false, message: "System error during execution." };
  }
}

async function createActionableInsight(action: any) {
    const { shopId, customerPhone, transaction } = action.payload;
    const insightRef = adminDb.collection('shops').doc(shopId).collection('insights').doc();
    
    let title = "Intelligence Alert";
    let message = "Action required";
    let label = "Approve";

    if (action.type === 'ADD_LEDGER_ENTRY') {
        title = `Verify ${transaction.type} entry`;
        message = `${transaction.customerName || customerPhone} ke liye ₹${transaction.amount} ki entry add karein?`;
        label = "Approve & Add";
    }
    
    await insightRef.set({
        id: insightRef.id,
        type: 'ACTION_REQUIRED',
        title,
        message,
        action_label: label,
        action_type: action.type,
        action_payload: action.payload,
        createdAt: FieldValue.serverTimestamp(),
        isRead: false
    });
}
