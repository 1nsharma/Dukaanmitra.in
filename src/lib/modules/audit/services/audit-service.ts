
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';

/**
 * AuditService: Investor-grade compliance logging.
 * Captures Correlation IDs, metadata, and state hashes.
 */
export class AuditService {
  static async log(details: {
    actorId: string;
    actorRole: string;
    action: string;
    targetType: string;
    targetId: string;
    shopId?: string;
    correlationId?: string;
    before?: object;
    after?: object;
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    };
  }) {
    try {
      const ip = details.metadata?.ipAddress || 'unknown';
      const ua = details.metadata?.userAgent || 'unknown';

      // Hash the snapshot for tamper detection
      const snapshotHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({ before: details.before, after: details.after }))
        .digest('hex');

      const logRef = adminDb.collection('auditLogs').doc();
      const logData = {
        id: logRef.id,
        actorId: details.actorId,
        actorRole: details.actorRole,
        action: details.action,
        targetType: details.targetType,
        targetId: details.targetId,
        shopId: details.shopId || null,
        correlationId: details.correlationId || crypto.randomUUID(),
        before: details.before || null,
        after: details.after || null,
        metadata: {
          ipAddress: ip,
          userAgent: ua,
          snapshotHash: snapshotHash
        },
        createdAt: FieldValue.serverTimestamp(),
      };

      await logRef.set(logData);
    } catch (error) {
      console.error('[AuditService] Critical: Audit write failed.', error);
    }
  }
}
