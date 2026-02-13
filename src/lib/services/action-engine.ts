

import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { AgentOutput } from '@/ai/flows/whatsapp-agent-flow';
import type { LedgerEntry, Customer } from '@/docs/backend-types';

type ActionPayload = AgentOutput['action']['payload'];

/**
 * The Action Engine. (Legacy for AI Agent)
 * This service is responsible for taking the structured action object from the AI agent,
 * validating it, and safely executing it against the database.
 * @param action - The action object from the agent's output.
 */
export async function executeAction(action: AgentOutput['action']): Promise<{ success: boolean; message: string }> {
  if (!action || !action.type || !action.payload) {
    return { success: false, message: 'Invalid action object.' };
  }

  console.log(`[ActionEngine] Executing action: ${action.type}`);

  switch (action.type) {
    case 'ADD_LEDGER_ENTRY':
      return await handleAddLedgerEntry(action.payload);
    
    default:
      console.warn(`[ActionEngine] Unknown action type: ${action.type}`);
      return { success: false, message: `Unknown action type: ${action.type}` };
  }
}

/**
 * Handles the 'ADD_LEDGER_ENTRY' action from the AI.
 * This function performs a transaction to:
 * 1. Create the new ledger entry.
 * 2. Create or update the associated customer's statistics.
 * @param payload - The data for the ledger entry from the agent.
 */
async function handleAddLedgerEntry(payload: ActionPayload): Promise<{ success: boolean; message: string }> {
  const { shopId, customer, transaction } = payload;

  if (!shopId || !customer || !transaction) {
    return { success: false, message: 'Missing required payload for ADD_LEDGER_ENTRY.' };
  }

  try {
     await adminDb.runTransaction(async (tx) => {
        const customerRef = adminDb.collection('shops').doc(shopId).collection('customers').doc(customer.phone);
        const ledgerRef = adminDb.collection('shops').doc(shopId).collection('ledger').doc();

        const customerDoc = await tx.get(customerRef);
        const udhaarAmount = transaction.type === 'credit' ? transaction.amount : -transaction.amount;

        if (!customerDoc.exists) {
             tx.set(customerRef, {
                shop_id: shopId,
                phone: customer.phone,
                name: customer.name,
                totalUdhaar: udhaarAmount,
                total_spent: transaction.amount,
                visit_count: 1,
                status: 'new',
                first_visit: FieldValue.serverTimestamp(),
                last_visit: FieldValue.serverTimestamp(),
                created_at: FieldValue.serverTimestamp(),
                updated_at: FieldValue.serverTimestamp(),
            });
        } else {
            tx.update(customerRef, {
                totalUdhaar: FieldValue.increment(udhaarAmount),
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
            item: transaction.items,
            type: transaction.type as 'credit' | 'payment',
            source: 'whatsapp',
            createdAt: FieldValue.serverTimestamp(),
        });
    });

    console.log(`[ActionEngine] Successfully added ledger entry for ${customer.name} in shop ${shopId}.`);
    return { success: true, message: 'Ledger entry added successfully.' };

  } catch (error) {
    console.error('[ActionEngine] Failed to execute ADD_LEDGER_ENTRY transaction:', error);
    return { success: false, message: 'Failed to write to database.' };
  }
}
