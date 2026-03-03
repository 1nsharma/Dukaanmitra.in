
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { AuditLog } from '@/docs/backend-types';
import { headers } from 'next/headers';
import crypto from 'crypto';

/**
 * AuditService: Investor-grade compliance logging.
 * Captures IP, User Agent, and state hashes for tamper detection.
 */
export class AuditService {
  static async log(details: {
    actorId: string;
    actorRole: string;
    action: string;
    targetType: string;
    targetId: string;
    shopId?: string;
    before?: object;
    after?: object;
  }) {
    try {
      const headerList = headers();
      const ip = headerList.get('x-forwarded-for') || 'unknown';
      const ua = headerList.get('user-agent') || 'unknown';

      // Create a deterministic hash of the change snapshot
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
        shopId: details.shopId,
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
