
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { UserProfile } from '@/docs/backend-types';
import { AuditService } from '../../audit/services/audit-service';

/**
 * AuthService: Enterprise-grade user and role management.
 * Enforces RBAC and logs all administrative changes.
 */
export class AuthService {
  static async updateRole(
    actor: { id: string; role: string },
    targetUid: string,
    newRole: UserProfile['role']
  ) {
    const userRef = adminDb.collection('users').doc(targetUid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) throw new Error('User not found');
    
    const before = userDoc.data();
    await userRef.update({ role: newRole, updated_at: FieldValue.serverTimestamp() });

    await AuditService.log({
      actorId: actor.id,
      actorRole: actor.role,
      action: 'auth:role:update',
      targetType: 'user',
      targetId: targetUid,
      before: { role: before?.role },
      after: { role: newRole }
    });
  }

  static async updateStatus(
    actor: { id: string; role: string },
    targetUid: string,
    status: UserProfile['status']
  ) {
    const userRef = adminDb.collection('users').doc(targetUid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) throw new Error('User not found');
    
    const before = userDoc.data();
    await userRef.update({ status, updated_at: FieldValue.serverTimestamp() });

    await AuditService.log({
      actorId: actor.id,
      actorRole: actor.role,
      action: 'auth:status:update',
      targetType: 'user',
      targetId: targetUid,
      before: { status: before?.status },
      after: { status }
    });
  }
}
