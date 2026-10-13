
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { LedgerEntry } from '@/docs/backend-types';
import { AuditService } from '../../audit/services/audit-service';
import { eventBus } from '@/lib/services/domain-event-bus';
import crypto from 'crypto';

/**
 * LedgerService: The Customer Memory Custodian.
 * 
 * Manages the entire lifecycle of a customer transaction and state.
 * Transition: NEW -> REGULAR -> LOYAL (VIP).
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
    },
    correlationId: string = crypto.randomUUID()
  ) {
    // Permission check
    if (actor.role !== 'super_admin' && actor.shopId !== shopId && actor.role !== 'system') {
      throw new Error('[LedgerService] Tenant isolation violation.');
    }

    const shopRef = adminDb.collection('shops').doc(shopId);
    const ledgerRef = shopRef.collection('ledger').doc();
    const entryId = ledgerRef.id;

    return await adminDb.runTransaction(async (transaction) => {
      const shopDoc = await transaction.get(shopRef);
      if (!shopDoc.exists) throw new Error('Shop not found');
      
      const shopData = shopDoc.data()!;
      // Revenue Gate
      if (shopData.status === 'locked' || shopData.status === 'suspended') {
          throw new Error('[LedgerService] Subscription expired or locked.');
      }

      const udhaarImpact = payload.type === 'credit' ? payload.amount : -payload.amount;
      const customerRef = shopRef.collection('customers').doc(payload.customerPhone);
      const customerDoc = await transaction.get(customerRef);

      // 1. Record the Transaction
      transaction.set(ledgerRef, {
        id: entryId,
        shop_id: shopId,
        actorId: actor.id,
        customerPhone: payload.customerPhone,
        customerName: payload.customerName || 'Grahak',
        amount: payload.amount,
        item: payload.item || 'Saman',
        type: payload.type,
        source: payload.source,
        correlationId,
        createdAt: FieldValue.serverTimestamp(),
      });

      // 2. Update the "Customer Memory" (Lifecycle Engine)
      if (!customerDoc.exists) {
          // Arrival: Initial Setup
          transaction.set(customerRef, {
              shop_id: shopId,
              phone: payload.customerPhone,
              name: payload.customerName || `Grahak ${payload.customerPhone.slice(-4)}`,
              totalUdhaar: udhaarImpact,
              total_spent: payload.amount,
              visit_count: 1,
              status: 'NEW',
              first_visit: FieldValue.serverTimestamp(),
              last_visit: FieldValue.serverTimestamp(),
              created_at: FieldValue.serverTimestamp(),
              updated_at: FieldValue.serverTimestamp(),
          });
      } else {
          // Retention: Updating patterns
          const currentVisits = (customerDoc.data()?.visit_count || 0) + 1;
          let newStatus = 'REGULAR';
          if (currentVisits >= 5) newStatus = 'LOYAL'; // VIP Threshold

          transaction.update(customerRef, {
              totalUdhaar: FieldValue.increment(udhaarImpact),
              total_spent: FieldValue.increment(payload.amount),
              visit_count: FieldValue.increment(1),
              status: newStatus,
              last_visit: FieldValue.serverTimestamp(),
              updated_at: FieldValue.serverTimestamp(),
          });
      }

      // 3. Update Shop-level Impact Metrics
      transaction.update(shopRef, {
        lastActive: FieldValue.serverTimestamp(),
        "impact_metrics.total_entries": FieldValue.increment(1),
        "impact_metrics.total_recovery_inr": payload.type === 'payment' ? FieldValue.increment(payload.amount) : FieldValue.increment(0)
      });

      return { entryId };
    }).then(async (result) => {
        // Log for Audit
        await AuditService.log({
          actorId: actor.id,
          actorRole: actor.role,
          action: 'ledger:entry:create',
          targetType: 'ledger',
          targetId: result.entryId,
          shopId: shopId,
          correlationId,
          after: payload
        });

        // Trigger side-effects (e.g. Daily Summaries)
        eventBus.emit('ledger.entry.created', 'ledger', { 
            shopId, 
            entryId: result.entryId, 
            payload 
        }, correlationId);

        return result.entryId;
    });
  }
}
