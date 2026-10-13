
'use client';

import { doc, updateDoc, Firestore, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { type UserProfile, type Shop } from '@/docs/backend-types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const logAudit = (firestore: Firestore, details: {
    actorId: string;
    actorRole: UserProfile['role'];
    action: string;
    target: { type: string, id: string };
    shopId?: string;
    changes: object;
}) => {
    const logData = {
        id: doc(collection(firestore, 'auditLogs')).id,
        ...details,
        targetType: details.target.type,
        targetId: details.target.id,
        after: details.changes,
        createdAt: serverTimestamp(),
    };
    // Clean up the object to match the schema
    delete (logData as any).target;
    delete (logData as any).changes;


    addDoc(collection(firestore, 'auditLogs'), logData).catch(err => {
        console.error("CRITICAL: Failed to write audit log:", err);
    });
};


/**
 * Updates a user's role in Firestore.
 * This action is protected by security rules and should only succeed if the caller is a super_admin.
 * Throws an error on failure and emits a contextual permission error.
 */
export const updateUserRole = async (firestore: Firestore, actor: { id: string, role: UserProfile['role'] }, targetUid: string, role: UserProfile['role']) => {
  const userRef = doc(firestore, 'users', targetUid);
  const data = { role };
  try {
    await updateDoc(userRef, data);
    logAudit(firestore, {
        actorId: actor.id,
        actorRole: actor.role,
        action: 'user:update:role',
        target: { type: 'user', id: targetUid },
        changes: { role },
    });
  } catch (serverError: any) {
    if (serverError.code === 'permission-denied') {
      const permissionError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'update',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
    }
    throw serverError;
  }
};

/**
 * Updates a user's status in Firestore.
 * This action is protected by security rules and should only succeed if the caller is a super_admin.
 */
export const updateUserStatus = async (firestore: Firestore, actor: { id: string, role: UserProfile['role'] }, targetUid: string, status: UserProfile['status']) => {
  const userRef = doc(firestore, 'users', targetUid);
  const data = { status };
  try {
    await updateDoc(userRef, data);
    logAudit(firestore, {
        actorId: actor.id,
        actorRole: actor.role,
        action: 'user:update:status',
        target: { type: 'user', id: targetUid },
        changes: { status },
    });
  } catch (serverError: any) {
    if (serverError.code === 'permission-denied') {
      const permissionError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'update',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
    }
    throw serverError;
  }
};


/**
 * Updates a shop's status in Firestore.
 * This action is protected by security rules and should only succeed if the caller is a super_admin.
 */
export const updateShopStatus = async (firestore: Firestore, actor: { id: string, role: UserProfile['role'] }, shopId: string, status: Shop['status']) => {
    const shopRef = doc(firestore, 'shops', shopId);
    const data = { status };
    try {
        await updateDoc(shopRef, data);
        logAudit(firestore, {
            actorId: actor.id,
            actorRole: actor.role,
            action: 'shop:update:status',
            target: { type: 'shop', id: shopId },
            changes: { status },
            shopId: shopId,
        });
    } catch (serverError: any) {
        if (serverError.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: shopRef.path,
                operation: 'update',
                requestResourceData: data,
            });
            errorEmitter.emit('permission-error', permissionError);
        }
        throw serverError;
    }
}

/**
 * Updates details for a specific shop.
 * This action is protected by security rules and should only succeed if the caller is a super_admin.
 */
export const updateBusinessDetails = async (firestore: Firestore, actor: { id: string, role: UserProfile['role'] }, shopId: string, data: Partial<Shop>) => {
    const shopRef = doc(firestore, 'shops', shopId);
    const updateData = { ...data, updated_at: serverTimestamp() };
    try {
        await updateDoc(shopRef, updateData);
        logAudit(firestore, {
            actorId: actor.id,
            actorRole: actor.role,
            action: 'shop:update:details',
            target: { type: 'shop', id: shopId },
            changes: data,
            shopId: shopId,
        });
    } catch (serverError: any) {
        if (serverError.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: shopRef.path,
                operation: 'update',
                requestResourceData: updateData,
            });
            errorEmitter.emit('permission-error', permissionError);
        }
        throw serverError;
    }
}
