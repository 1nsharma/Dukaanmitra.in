"use client";

import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CreateShopForm from "./create-shop-form";
import ShopDashboard from "./shop-dashboard";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Wait until the user's auth and profile state are fully resolved.
    if (isUserLoading) {
      return; 
    }

    // If no user is found, redirect to the main login page.
    if (!user) {
      router.replace("/login");
      return;
    }

    // **Primary redirect logic**: If the user is a super_admin, send them to the correct dashboard.
    // Use router.replace to avoid adding this to the browser history.
    if (user.role === 'super_admin') {
      router.replace('/SAP/Superdashboard');
      return;
    }
    
    // If the user's account is suspended, sign them out and redirect.
    if (user.status === 'suspended') {
      auth.signOut();
      toast({
        title: 'Account Suspended',
        description: 'Your account has been suspended. Please contact support.',
        variant: 'destructive',
      });
      router.replace('/login');
      return;
    }
  }, [user, isUserLoading, router, auth, toast]);

  // This condition now correctly handles the loading state and the pre-redirect state for super admins.
  // A loader is shown while auth state is resolving OR if the user is a super admin (who will be redirected).
  if (isUserLoading || !user || user.role === 'super_admin') {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // This content will ONLY be rendered for a regular, authenticated, active user.
  return (
    <div className="container py-16 md:py-24">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName || user.email}!
          </p>
        </div>
        <Button onClick={handleSignOut} variant="destructive">
          Sign Out
        </Button>
      </div>

      {user.shopId ? (
        <ShopDashboard shopId={user.shopId} />
      ) : (
        // The user object is guaranteed to be available here, so we don't need to force a refresh.
        <CreateShopForm onShopCreated={() => {}} />
      )}
    </div>
  );
}
