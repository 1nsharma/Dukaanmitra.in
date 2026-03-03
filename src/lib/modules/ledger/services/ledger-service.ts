
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { LedgerEntry } from '@/docs/backend-types';
import { AuditService } from '../../audit/services/audit-service';

/**
 * LedgerService: The deterministic core for financial transactions.
 * All ledger writes must pass through this service to ensure atomicity.
 */
export class LedgerService {
  static async addEntry(
    actor: { id: string; role: string },
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
    const batch = adminDb.batch();
    const shopRef = adminDb.collection('shops').doc(shopId);
    const customerRef = shopRef.collection('customers').doc(payload.customerPhone);
    const ledgerRef = shopRef.collection('ledger').doc();

    const udhaarImpact = payload.type === 'credit' ? payload.amount : -payload.amount;

    // Atomic updates: Ledger entry + Customer stats
    batch.set(ledgerRef, {
      id: ledgerRef.id,
      shop_id: shopId,
      customerPhone: payload.customerPhone,
      customerName: payload.customerName || 'Customer',
      amount: payload.amount,
      item: payload.item || 'Misc',
      type: payload.type,
      source: payload.source,
      createdAt: FieldValue.serverTimestamp(),
    });

    batch.update(customerRef, {
      totalUdhaar: FieldValue.increment(udhaarImpact),
      total_spent: FieldValue.increment(payload.amount),
      visit_count: FieldValue.increment(1),
      last_visit: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    await AuditService.log({
      actorId: actor.id,
      actorRole: actor.role,
      action: 'ledger:entry:add',
      targetType: 'ledger',
      targetId: ledgerRef.id,
      shopId: shopId,
      after: payload
    });

    return ledgerRef.id;
  }
}
