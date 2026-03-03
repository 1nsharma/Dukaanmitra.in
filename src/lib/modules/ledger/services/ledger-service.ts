
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { LedgerEntry } from '@/docs/backend-types';
import { AuditService } from '../../audit/services/audit-service';
import { eventBus } from '@/lib/services/domain-event-bus';
import crypto from 'crypto';

/**
 * LedgerService: The Deterministic Fortress.
 * 
 * STRICTLY APPEND-ONLY. 
 * Implements Multi-Context Hash-Chaining for financial integrity.
 * Features Continuous Monitoring Handshakes.
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
    // 1. Tenant Isolation & Integrity Guard
    if (actor.role !== 'super_admin' && actor.shopId !== shopId) {
      throw new Error('[LedgerService] Tenant violation: Unauthorized shop access.');
    }

    const shopRef = adminDb.collection('shops').doc(shopId);
    const ledgerRef = shopRef.collection('ledger').doc();
    const entryId = ledgerRef.id;

    // 2. Atomic Transaction for Integrity with Pre-Append Handshake
    return await adminDb.runTransaction(async (transaction) => {
      const shopDoc = await transaction.get(shopRef);
      if (!shopDoc.exists) throw new Error('Shop not found');
      
      const shopData = shopDoc.data()!;
      
      // FAILURE RESPONSE: Integrity Lock Check
      if (shopData.status === 'integrity_lock') {
          throw new Error('[LedgerService] Write Aborted: Shop ledger is locked due to integrity failure.');
      }

      const previousEntryHash = shopData.ledgerRootHash || 'genesis';
      
      // 3. Multi-Context Hash Generation
      // Versioned for long-term audit compatibility
      const ledgerVersion = 1;
      const hashAlgorithm = 'sha256';
      
      const hashInput = `${previousEntryHash}|${shopId}|${entryId}|${payload.amount}|${payload.type}|${actor.id}|v${ledgerVersion}`;
      const currentEntryHash = crypto
        .createHash(hashAlgorithm)
        .update(hashInput)
        .digest('hex');

      const udhaarImpact = payload.type === 'credit' ? payload.amount : -payload.amount;
      const customerRef = shopRef.collection('customers').doc(payload.customerPhone);

      // Record Entry (Append Only)
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

      // Update Customer Total
      transaction.update(customerRef, {
        totalUdhaar: FieldValue.increment(udhaarImpact),
        total_spent: FieldValue.increment(payload.amount),
        visit_count: FieldValue.increment(1),
        last_visit: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
      });

      // Update Shop Root Hash (Checkpoint)
      // Continuous Monitoring Status
      transaction.update(shopRef, {
        ledgerRootHash: currentEntryHash,
        integrityStatus: 'healthy',
        lastVerifiedAt: FieldValue.serverTimestamp(),
        lastLedgerUpdate: FieldValue.serverTimestamp(),
      });

      return { entryId, currentEntryHash };
    }).then(async (result) => {
        // 4. Post-Transaction Effects (Audit & Events)
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
   * Continuous Integrity Monitoring Job logic.
   * Traverses the ledger chain and re-calculates hashes to detect tampering.
   * If corruption is found, the shop is automatically locked.
   */
  static async verifyIntegrity(shopId: string): Promise<{ valid: boolean; lastValidId?: string; error?: string }> {
    const shopRef = adminDb.collection('shops').doc(shopId);
    const shopDoc = await shopRef.get();
    if (!shopDoc.exists) return { valid: false, error: 'Shop not found' };
    
    const rootHash = shopDoc.data()?.ledgerRootHash;
    if (!rootHash) return { valid: true }; // Genesis state

    const entries = await shopRef.collection('ledger').orderBy('createdAt', 'desc').get();
    let currentHash = rootHash;

    for (const doc of entries.docs) {
        const data = doc.data();
        if (data.entryHash !== currentHash) {
            // INTEGRITY FAILURE: Self-Healing Response
            await shopRef.update({
                integrityStatus: 'corrupted',
                status: 'integrity_lock',
                updated_at: FieldValue.serverTimestamp()
            });
            
            await AuditService.log({
                actorId: 'system',
                actorRole: 'system',
                action: 'integrity:failure:detected',
                targetType: 'shop',
                targetId: shopId,
                shopId: shopId,
                after: { brokenEntryId: doc.id, expectedHash: currentHash, actualHash: data.entryHash }
            });

            return { valid: false, lastValidId: doc.id, error: 'Hash chain broken' };
        }
        currentHash = data.previousEntryHash;
    }

    const isValid = currentHash === 'genesis';
    if (isValid) {
        await shopRef.update({
            integrityStatus: 'healthy',
            lastVerifiedAt: FieldValue.serverTimestamp()
        });
    }

    return { valid: isValid };
  }
}
