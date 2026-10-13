
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { UserProfile } from '@/docs/backend-types';
import { AuditService } from '../../audit/services/audit-service';
import { eventBus } from '@/lib/services/domain-event-bus';

/**
 * AuthService: Hardened User Management.
 */
export class AuthService {
  static async updateRole(
    actor: { id: string; role: string },
    targetUid: string,
    newRole: UserProfile['role']
  ) {
    if (actor.role !== 'super_admin') {
      throw new Error('[AuthService] Permission Denied: SuperAdmin path required.');
    }

    const userRef = adminDb.collection('users').doc(targetUid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) throw new Error('User not found');
    
    const before = userDoc.data();
    
    // Atomic update + record revocation timestamp
    await userRef.update({ 
      role: newRole, 
      sessionRevokedAt: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp() 
    });

    await AuditService.log({
      actorId: actor.id,
      actorRole: actor.role,
      action: 'auth:role:update',
      targetType: 'user',
      targetId: targetUid,
      before: { role: before?.role },
      after: { role: newRole }
    });

    eventBus.emit('auth.role.updated', { targetUid, newRole });
  }

  static async updateStatus(
    actor: { id: string; role: string },
    targetUid: string,
    status: UserProfile['status']
  ) {
    if (actor.role !== 'super_admin') throw new Error('Unauthorized');

    const userRef = adminDb.collection('users').doc(targetUid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) throw new Error('User not found');
    
    const before = userDoc.data();
    await userRef.update({ 
      status, 
      sessionRevokedAt: status === 'suspended' ? FieldValue.serverTimestamp() : null,
      updated_at: FieldValue.serverTimestamp() 
    });

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
