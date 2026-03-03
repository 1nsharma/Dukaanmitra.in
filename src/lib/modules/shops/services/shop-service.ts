
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { Shop } from '@/docs/backend-types';
import { AuditService } from '../../audit/services/audit-service';

/**
 * ShopService: Manages shop lifecycle and settings.
 * Enforces domain boundaries for shop-level data.
 */
export class ShopService {
  static async updateStatus(
    actor: { id: string; role: string },
    shopId: string,
    status: Shop['status']
  ) {
    const shopRef = adminDb.collection('shops').doc(shopId);
    const shopDoc = await shopRef.get();
    
    if (!shopDoc.exists) throw new Error('Shop not found');
    
    const before = shopDoc.data();
    await shopRef.update({ status, updated_at: FieldValue.serverTimestamp() });

    await AuditService.log({
      actorId: actor.id,
      actorRole: actor.role,
      action: 'shop:status:update',
      targetType: 'shop',
      targetId: shopId,
      shopId: shopId,
      before: { status: before?.status },
      after: { status }
    });
  }

  static async getShop(shopId: string): Promise<Shop | null> {
    const doc = await adminDb.collection('shops').doc(shopId).get();
    return doc.exists ? (doc.data() as Shop) : null;
  }
}
