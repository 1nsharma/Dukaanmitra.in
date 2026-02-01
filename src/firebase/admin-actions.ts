'use client';

import { doc, updateDoc, Firestore } from 'firebase/firestore';
import { type UserProfile } from '@/docs/backend-types';

// In a production app, these functions would securely call a Firebase Cloud Function.
// For this prototype, we'll perform the updates directly from the client,
// protected by Firestore security rules that only allow 'super_admin' to make these changes.

/**
 * Updates a user's role in Firestore.
 * This action is protected by security rules and should only succeed if the caller is a super_admin.
 * @param firestore - The Firestore instance.
 * @param uid - The UID of the user to update.
 * @param role - The new role to assign.
 */
export const updateUserRole = async (firestore: Firestore, uid: string, role: UserProfile['role']) => {
  const userRef = doc(firestore, 'users', uid);
  return updateDoc(userRef, { role });
};

/**
 * Updates a user's status in Firestore.
 * This action is protected by security rules and should only succeed if the caller is a super_admin.
 * @param firestore - The Firestore instance.
 * @param uid - The UID of the user to update.
 * @param status - The new status to assign.
 */
export const updateUserStatus = async (firestore: Firestore, uid: string, status: UserProfile['status']) => {
  const userRef = doc(firestore, 'users', uid);
  return updateDoc(userRef, { status });
};

