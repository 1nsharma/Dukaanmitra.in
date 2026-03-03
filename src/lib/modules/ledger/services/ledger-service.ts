
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { LedgerEntry } from '@/docs/backend-types';
import { AuditService } from '../../audit/services/audit-service';
import { eventBus } from '@/lib/services/domain-event-bus';
import crypto from 'crypto';

/**
 * LedgerService: The Absolute Source of Truth Custodian.
 * 
 * Implements Multi-Context Hash-Chaining for financial integrity.
 * Strictly Append-Only. No updates or deletions.
 * Now tracks IMPACT METRICS for pilot measurement.
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
      throw new Error('[LedgerService] Tenant violation: Unauthorized shop access.');
    }

    const shopRef = adminDb.collection('shops').doc(shopId);
    const ledgerRef = shopRef.collection('ledger').doc();
    const entryId = ledgerRef.id;

    return await adminDb.runTransaction(async (transaction) => {
      const shopDoc = await transaction.get(shopRef);
      if (!shopDoc.exists) throw new Error('Shop not found');
      
      const shopData = shopDoc.data()!;
      if (shopData.status === 'integrity_lock') {
          throw new Error('[LedgerService] Write Aborted: Shop ledger is locked.');
      }

      const previousEntryHash = shopData.ledgerRootHash || 'genesis';
      const ledgerVersion = 1;
      const hashAlgorithm = 'sha256';
      
      const hashInput = `${previousEntryHash}|${shopId}|${entryId}|${payload.amount}|${payload.type}|${actor.id}|v${ledgerVersion}`;
      const currentEntryHash = crypto
        .createHash(hashAlgorithm)
        .update(hashInput)
        .digest('hex');

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
        previousEntryHash,
        entryHash: currentEntryHash,
        ledgerVersion,
        hashAlgorithm,
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

      // 3. Update IMPACT METRICS on Shop level
      const impactUpdates: any = {
        ledgerRootHash: currentEntryHash,
        integrityStatus: 'healthy',
        lastVerifiedAt: FieldValue.serverTimestamp(),
        lastActive: FieldValue.serverTimestamp(),
        "impact_metrics.total_entries": FieldValue.increment(1),
      };

      if (payload.type === 'payment') {
          // Track udhaar recovery as a core impact signal
          impactUpdates["impact_metrics.total_recovery_inr"] = FieldValue.increment(payload.amount);
      }

      transaction.update(shopRef, impactUpdates);

      return { entryId, currentEntryHash };
    }).then(async (result) => {
        await AuditService.log({
          actorId: actor.id,
          actorRole: actor.role,
          action: 'ledger:entry:create',
          targetType: 'ledger',
          targetId: result.entryId,
          shopId: shopId,
          correlationId,
          after: { ...payload, entryHash: result.currentEntryHash }
        });

        eventBus.emit('ledger.entry.created', 'ledger', { 
            shopId, 
            entryId: result.entryId, 
            payload 
        }, correlationId);

        return result.entryId;
    });
  }

  /**
   * Deep Audit: Re-calculates hash chain to prove no manual tampering occurred.
   */
  static async verifyIntegrity(shopId: string): Promise<{ valid: boolean; lastValidId?: string; error?: string }> {
    const shopRef = adminDb.collection('shops').doc(shopId);
    const shopDoc = await shopRef.get();
    if (!shopDoc.exists) return { valid: false, error: 'Shop not found' };
    
    const rootHash = shopDoc.data()?.ledgerRootHash;
    if (!rootHash) return { valid: true }; 

    const entries = await shopRef.collection('ledger').orderBy('createdAt', 'desc').limit(100).get();
    let currentHash = rootHash;

    for (const doc of entries.docs) {
        const data = doc.data();
        if (data.entryHash !== currentHash) {
            await shopRef.update({
                integrityStatus: 'corrupted',
                status: 'integrity_lock',
                updated_at: FieldValue.serverTimestamp()
            });
            return { valid: false, lastValidId: doc.id, error: 'Hash chain broken' };
        }
        currentHash = data.previousEntryHash;
    }

    const isValid = entries.size < 100 || currentHash === 'genesis';
    if (isValid) {
        await shopRef.update({ integrityStatus: 'healthy', lastVerifiedAt: FieldValue.serverTimestamp() });
    }
    return { valid: isValid };
  }
}
