'use client';

import { doc, updateDoc, Firestore } from 'firebase/firestore';
import { type UserProfile } from '@/docs/backend-types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


/**
 * Updates a user's role in Firestore.
 * This action is protected by security rules and should only succeed if the caller is a super_admin.
 * Throws an error on failure and emits a contextual permission error.
 * @param firestore - The Firestore instance.
 * @param uid - The UID of the user to update.
 * @param role - The new role to assign.
 */
export const updateUserRole = async (firestore: Firestore, uid: string, role: UserProfile['role']) => {
  const userRef = doc(firestore, 'users', uid);
  const data = { role };
  try {
    await updateDoc(userRef, data);
  } catch (serverError: any) {
    if (serverError.code === 'permission-denied') {
      const permissionError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'update',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
    }
    // Re-throw for the UI to handle
    throw serverError;
  }
};

/**
 * Updates a user's status in Firestore.
 * This action is protected by security rules and should only succeed if the caller is a super_admin.
 * Throws an error on failure and emits a contextual permission error.
 * @param firestore - The Firestore instance.
 * @param uid - The UID of the user to update.
 * @param status - The new status to assign.
 */
export const updateUserStatus = async (firestore: Firestore, uid: string, status: UserProfile['status']) => {
  const userRef = doc(firestore, 'users', uid);
  const data = { status };
  try {
    await updateDoc(userRef, data);
  } catch (serverError: any) {
    if (serverError.code === 'permission-denied') {
      const permissionError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'update',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
    }
    // Re-throw for the UI to handle
    throw serverError;
  }
};
