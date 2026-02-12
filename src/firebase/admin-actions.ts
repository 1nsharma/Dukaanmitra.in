
'use client';

import { doc, updateDoc, Firestore, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { type UserProfile, type Shop } from '@/docs/backend-types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const logAdminAction = (firestore: Firestore, actorId: string, event: string, details: object) => {
    const logData = {
        id: doc(collection(firestore, 'logs')).id,
        event,
        actorId,
        createdAt: serverTimestamp(),
        details,
    };
    addDoc(collection(firestore, 'logs'), logData).catch(err => {
        console.error("CRITICAL: Failed to write admin audit log:", err);
    });
};


/**
 * Updates a user's role in Firestore.
 * This action is protected by security rules and should only succeed if the caller is a super_admin.
 * Throws an error on failure and emits a contextual permission error.
 */
export const updateUserRole = async (firestore: Firestore, actorId: string, targetUid: string, role: UserProfile['role']) => {
  const userRef = doc(firestore, 'users', targetUid);
  const data = { role };
  try {
    await updateDoc(userRef, data);
    logAdminAction(firestore, actorId, 'admin_update_user_role', {
        targetUid,
        newRole: role,
        message: `Admin ${actorId} changed role of user ${targetUid} to ${role}.`
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
export const updateUserStatus = async (firestore: Firestore, actorId: string, targetUid: string, status: UserProfile['status']) => {
  const userRef = doc(firestore, 'users', targetUid);
  const data = { status };
  try {
    await updateDoc(userRef, data);
    logAdminAction(firestore, actorId, 'admin_update_user_status', {
        targetUid,
        newStatus: status,
        message: `Admin ${actorId} changed status of user ${targetUid} to ${status}.`
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
export const updateShopStatus = async (firestore: Firestore, actorId: string, shopId: string, status: Shop['status']) => {
    const shopRef = doc(firestore, 'shops', shopId);
    const data = { status };
    try {
        await updateDoc(shopRef, data);
        logAdminAction(firestore, actorId, 'admin_update_shop_status', {
            shopId,
            newStatus: status,
            message: `Admin ${actorId} changed status of shop ${shopId} to ${status}.`
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
export const updateBusinessDetails = async (firestore: Firestore, actorId: string, shopId: string, data: Partial<Shop>) => {
    const shopRef = doc(firestore, 'shops', shopId);
    const updateData = { ...data, updated_at: serverTimestamp() };
    try {
        await updateDoc(shopRef, updateData);
        logAdminAction(firestore, actorId, 'admin_update_shop_details', {
            shopId,
            updatedFields: Object.keys(data),
            message: `Admin ${actorId} updated details for shop ${shopId}.`
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
