
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { LedgerService } from '../modules/ledger/services/ledger-service';
import crypto from 'crypto';

/**
 * ActionEngine: The Multi-Layer Safety Boundary.
 * 
 * AI proposes -> Owner approves -> Service executes.
 * Injects correlation IDs into all domain service calls.
 * Enforces Integrity Locks at the routing layer.
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
};

export async function executeAction(
  action: any, 
  actor: { id: string; role: string; shopId?: string },
  correlationId: string = crypto.randomUUID()
): Promise<{ success: boolean; message?: string }> {
  
  if (!action?.type || !action?.payload) return { success: false, message: "Malformed action." };

  const shopId = action.payload.shopId;
  if (!shopId) return { success: false, message: "Missing shopId in payload." };

  // DETERMINISTIC GUARD: Check for Integrity Lock
  const shopDoc = await adminDb.collection('shops').doc(shopId).get();
  if (shopDoc.data()?.status === 'integrity_lock') {
      return { success: false, message: "CRITICAL: This shop is locked due to an integrity failure. Manual audit required." };
  }

  const policy = ACTION_POLICIES[action.type] || { risk: 'HIGH', requiresApproval: true, allowed: false };

  if (!policy.allowed) {
      return { success: false, message: `Action '${action.type}' is restricted.` };
  }

  // Layer 1: Approval Gate (Human-in-the-loop)
  if (policy.requiresApproval && actor.id === 'system') {
      await createActionableInsight(action, correlationId);
      return { success: true, message: "Action queued for manual approval." };
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
            source: actor.id === 'system' ? 'whatsapp-ai' : 'app-ai'
        }, correlationId);
    }

    return { success: true };

  } catch (error: any) {
    console.error('[ActionEngine] Execution failed:', error);
    return { success: false, message: error.message || "Execution error." };
  }
}

async function createActionableInsight(action: any, correlationId: string) {
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
