
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { LedgerEntry } from '@/docs/backend-types';
import { AuditService } from '../../audit/services/audit-service';
import { eventBus } from '@/lib/services/domain-event-bus';
import crypto from 'crypto';

/**
 * LedgerService: The Customer Memory Custodian.
 * 
 * Simplified for MVP Pilot Testing. 
 * Focused on "Zero-Typing" speed and udhaar recovery signals.
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
    if (actor.role !== 'super_admin' && actor.shopId !== shopId && actor.role !== 'system') {
      throw new Error('[LedgerService] Tenant violation.');
    }

    const shopRef = adminDb.collection('shops').doc(shopId);
    const ledgerRef = shopRef.collection('ledger').doc();
    const entryId = ledgerRef.id;

    return await adminDb.runTransaction(async (transaction) => {
      const shopDoc = await transaction.get(shopRef);
      if (!shopDoc.exists) throw new Error('Shop not found');
      
      const shopData = shopDoc.data()!;
      if (shopData.status === 'locked' || shopData.status === 'suspended') {
          throw new Error('[LedgerService] Subscription Required.');
      }

      const udhaarImpact = payload.type === 'credit' ? payload.amount : -payload.amount;
      const customerRef = shopRef.collection('customers').doc(payload.customerPhone);
      const customerDoc = await transaction.get(customerRef);

      // 1. Create ledger entry
      transaction.set(ledgerRef, {
        id: entryId,
        shop_id: shopId,
        actorId: actor.id,
        customerPhone: payload.customerPhone,
        customerName: payload.customerName || 'Customer',
        amount: payload.amount,
        item: payload.item || 'Misc',
        type: payload.type,
        source: payload.source,
        correlationId,
        createdAt: FieldValue.serverTimestamp(),
      });

      // 2. Update Customer state
      if (!customerDoc.exists) {
          transaction.set(customerRef, {
              shop_id: shopId,
              phone: payload.customerPhone,
              name: payload.customerName || `Customer ${payload.customerPhone.slice(-4)}`,
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
          transaction.update(customerRef, {
              totalUdhaar: FieldValue.increment(udhaarImpact),
              total_spent: FieldValue.increment(payload.amount),
              visit_count: FieldValue.increment(1),
              last_visit: FieldValue.serverTimestamp(),
              updated_at: FieldValue.serverTimestamp(),
          });
      }

      // 3. Update Impact Metrics (Data Flywheel)
      transaction.update(shopRef, {
        lastActive: FieldValue.serverTimestamp(),
        "impact_metrics.total_entries": FieldValue.increment(1),
        "impact_metrics.total_recovery_inr": payload.type === 'payment' ? FieldValue.increment(payload.amount) : FieldValue.increment(0)
      });

      return { entryId };
    }).then(async (result) => {
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

        eventBus.emit('ledger.entry.created', 'ledger', { 
            shopId, 
            entryId: result.entryId, 
            payload 
        }, correlationId);

        return result.entryId;
    });
  }
}
