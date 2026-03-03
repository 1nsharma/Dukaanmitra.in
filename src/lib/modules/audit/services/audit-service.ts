
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { AuditLog } from '@/docs/backend-types';

/**
 * AuditService: Centralized logging for all sensitive system operations.
 * Essential for investor-grade security and compliance.
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
      const logRef = adminDb.collection('auditLogs').doc();
      const logData: Omit<AuditLog, 'id'> = {
        actorId: details.actorId,
        actorRole: details.actorRole,
        action: details.action,
        targetType: details.targetType,
        targetId: details.targetId,
        shopId: details.shopId,
        before: details.before,
        after: details.after,
        createdAt: FieldValue.serverTimestamp(),
      };

      await logRef.set({
        id: logRef.id,
        ...logData
      });
    } catch (error) {
      console.error('[AuditService] Failed to write audit log:', error);
      // In a production environment, we might want to alert if auditing fails.
    }
  }
}
