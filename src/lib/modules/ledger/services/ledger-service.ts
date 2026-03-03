
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { LedgerEntry } from '@/docs/backend-types';
import { AuditService } from '../../audit/services/audit-service';
import { eventBus } from '@/lib/services/domain-event-bus';
import crypto from 'crypto';

/**
 * LedgerService: The Deterministic Fortress.
 * STRICTLY APPEND-ONLY. NO UPDATES. NO DELETES.
 * Implements Hash-Chaining for financial integrity.
 */
export class LedgerService {
  static async addEntry(
    actor: { id: string; role: string; shopId?: string },
    shopId: string,
    payload: {
      customerPhone: string;
      customerName?: string;
      amount: number;
      item?: string;
      type: 'credit' | 'payment';
      source: LedgerEntry['source'];
    }
  ) {
    // 1. Tenant Isolation Guard
    if (actor.role !== 'super_admin' && actor.shopId !== shopId) {
      throw new Error('[LedgerService] Tenant violation: Unauthorized shop access.');
    }

    const shopRef = adminDb.collection('shops').doc(shopId);
    
    // 2. Fetch Previous Hash for Integrity Chain
    const lastEntryQuery = await shopRef.collection('ledger')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    
    const previousEntryHash = lastEntryQuery.empty 
      ? '00000000000000000000000000000000' 
      : (lastEntryQuery.docs[0].data().entryHash || 'genesis');

    // 3. Prepare Entry
    const ledgerRef = shopRef.collection('ledger').doc();
    const entryId = ledgerRef.id;
    const currentEntryHash = crypto
      .createHash('sha256')
      .update(`${previousEntryHash}:${entryId}:${payload.amount}:${payload.type}`)
      .digest('hex');

    const udhaarImpact = payload.type === 'credit' ? payload.amount : -payload.amount;

    await adminDb.runTransaction(async (transaction) => {
      const customerRef = shopRef.collection('customers').doc(payload.customerPhone);
      
      transaction.set(ledgerRef, {
        id: entryId,
        shop_id: shopId,
        customerPhone: payload.customerPhone,
        customerName: payload.customerName || 'Customer',
        amount: payload.amount,
        item: payload.item || 'Misc',
        type: payload.type,
        source: payload.source,
        previousEntryHash,
        entryHash: currentEntryHash,
        createdAt: FieldValue.serverTimestamp(),
      });

      transaction.update(customerRef, {
        totalUdhaar: FieldValue.increment(udhaarImpact),
        total_spent: FieldValue.increment(payload.amount),
        visit_count: FieldValue.increment(1),
        last_visit: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
      });
    });

    // 4. Compliance Logging
    await AuditService.log({
      actorId: actor.id,
      actorRole: actor.role,
      action: 'ledger:entry:create',
      targetType: 'ledger',
      targetId: entryId,
      shopId: shopId,
      after: { ...payload, entryHash: currentEntryHash }
    });

    // 5. Decoupled Effects
    eventBus.emit('ledger.entry.created', { shopId, entryId, payload });

    return entryId;
  }

  // NOTE: updateEntry and deleteEntry are explicitly NOT IMPLEMENTED to ensure immutability.
}
