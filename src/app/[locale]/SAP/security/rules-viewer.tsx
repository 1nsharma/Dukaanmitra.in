
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck } from "lucide-react";

// Content of firestore.rules
const rulesContent = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // =================================
    // Helper Functions (Refactored)
    // =================================
    function isAuthenticated() {
      return request.auth != null;
    }

    // This is the primary helper. It performs a single 'get' operation.
    function getUserProfile() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid));
    }
    
    // Checks if the user is an owner of a specific resource (not a shop). Used for /users/{userId} writes.
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Checks if a user document exists.
    function userProfileExists() {
      return exists(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    function isSuperAdmin() {
      return isAuthenticated() && userProfileExists() && getUserProfile().data.role == 'super_admin';
    }
    
    function isFranchiseAdmin() {
        return isAuthenticated() && userProfileExists() && getUserProfile().data.role == 'franchise_admin';
    }

    function isShopMember(shopId) {
        if (!isAuthenticated() || !userProfileExists()) {
            return false;
        }
        let profile = getUserProfile().data;
        return profile.status == 'active' &&
               profile.shopId == shopId &&
               (profile.role == 'owner' || profile.role == 'staff');
    }
    
    function isShopOwner(shopId) {
        if (!isAuthenticated() || !userProfileExists()) {
            return false;
        }
        let profile = getUserProfile().data;
        return profile.status == 'active' &&
               profile.shopId == shopId &&
               profile.role == 'owner';
    }


    // =================================
    // Public & System Collections
    // =================================
    match /posts/{postId} {
      allow read: if true;
      allow update: if (request.resource.data.likes == resource.data.likes + 1 || request.resource.data.views == resource.data.views + 1) &&
                      request.resource.data.diff(resource.data).affectedKeys().size() == 1;
      allow create, delete: if isSuperAdmin();
    }

    match /comments/{commentId} {
        allow read: if true;
        allow create: if isAuthenticated() && request.resource.data.keys().hasAll(['postSlug', 'name', 'message', 'createdAt']);
        allow update, delete: if isSuperAdmin();
    }
    
    match /contactFormSubmissions/{submissionId} {
        allow create: if true;
        allow read, update, delete: if isSuperAdmin();
    }
    
    match /interactions/{interactionId} {
      // Written by backend services ONLY. Read by super admins for auditing.
      allow write: if false; 
      allow read: if isSuperAdmin();
    }

    match /logs/{logId} {
      // Written by backend services ONLY. Read by super admins. Immutable.
      allow write: if false;
      allow read: if isSuperAdmin();
    }
    
    match /auditLogs/{auditLogId} {
        // Written by backend services ONLY. Read by franchise/super admins. Immutable.
        allow write: if false;
        allow read: if isSuperAdmin() || isFranchiseAdmin();
    }
    
    match /notifications/{notificationId} {
      // Written by backend services ONLY. Read by super admins or relevant shop members.
      allow write: if false;
      allow read: if isSuperAdmin() || isShopMember(resource.data.shopId);
    }
    
    match /metrics/{docId=**} {
      // Metrics are written by backend services ONLY. Read by super admins.
      allow read: if isSuperAdmin();
      allow write: if false;
    }

    // =================================
    // User & Order Collections
    // =================================
    match /users/{userId} {
      allow read: if isOwner(userId) || isSuperAdmin() || isFranchiseAdmin();
      allow list: if isSuperAdmin() || isFranchiseAdmin();
      // Only an authenticated user can create their own profile, and they can only assign themselves the 'owner' role.
      allow create: if isOwner(userId) && request.resource.data.role == 'owner' && request.resource.data.status == 'active';
      // A user can update their own profile, but cannot change their role or status. Super admins can change anything.
      allow update: if isSuperAdmin() ||
                    (isOwner(userId) && !(request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'status'])));
      allow delete: if isSuperAdmin();
    }
    
    match /orders/{orderId} {
        allow create: if isOwner(request.resource.data.userId);
        allow read: if isSuperAdmin() || isOwner(resource.data.userId);
        allow update, delete: if false; // Only backend can update status.
    }

    // =================================
    // Main Multi-Tenant Shop Collections
    // =================================
    match /shops/{shopId} {
      // CREATE: Authenticated users can create shops, but only if their profile exists, is active, and has the 'owner' role.
      allow create: if isAuthenticated() && userProfileExists() && getUserProfile().data.status == 'active' && getUserProfile().data.role == 'owner' && request.auth.uid == request.resource.data.owner_id;

      // READ: Super admins, franchise admins, or any active member (owner or staff) of the shop.
      allow read: if isSuperAdmin() || isFranchiseAdmin() || isShopMember(shopId);

      // UPDATE/DELETE: Only the shop owner or a super admin. Staff and Franchise Admins cannot change shop-level details.
      allow update, delete: if isSuperAdmin() || isShopOwner(shopId);
      
      // =================================
      // Shop Subcollections
      // =================================
      match /customers/{customerId} {
        // Any active shop member can perform CRUD. Franchise/Super Admins can only read.
        allow write: if isShopMember(shopId);
        allow read: if isShopMember(shopId) || isFranchiseAdmin() || isSuperAdmin();
      }
      
      match /ledger/{ledgerId} {
        // Any active shop member can read and create ledger entries.
        // Franchise Admins and Super Admins can only read.
        allow create: if isShopMember(shopId);
        allow read: if isShopMember(shopId) || isFranchiseAdmin() || isSuperAdmin();
        // Ledger entries are immutable to maintain a perfect audit trail.
        allow update, delete: if false;
      }

      // Default deny for any other subcollection not explicitly defined.
      match /{subcollection}/{docId=**} {
          allow read, write: if false;
      }
    }
  }
}
`;

export default function RulesViewer() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck /> Firestore Security Rules</CardTitle>
                <CardDescription>A read-only view of your currently deployed Firestore security rules.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[60vh] w-full bg-muted/50 rounded-md border p-4 font-mono">
                    <pre className="text-xs">
                        <code>{rulesContent}</code>
                    </pre>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
