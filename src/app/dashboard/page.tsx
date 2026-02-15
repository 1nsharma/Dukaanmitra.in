
"use client";

import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CreateShopForm from "./create-shop-form";
import ShopDashboard from "./shop-dashboard";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
            Shopkeeper Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome, {user?.displayName || user.email}!
          </p>
        </div>
        <Button onClick={handleSignOut} variant="destructive">
          Sign Out
        </Button>
      </div>

      {user.shopId ? (
        <ShopDashboard shopId={user.shopId} />
      ) : user.role === 'super_admin' ? (
         <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Super Admin Test Mode</CardTitle>
            <CardDescription>
              This is the dashboard for shop owners.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">As a Super Admin, you don't have a default shop assigned. To test this view for a specific shop, you can temporarily add a `shopId` field to your user document in Firestore.</p>
             <div className="mt-4">
                <Button asChild>
                    <Link href="/SAP/Superdashboard">Go to Super Admin Dashboard</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <CreateShopForm onShopCreated={() => {}} />
      )}
    </div>
  );
}
