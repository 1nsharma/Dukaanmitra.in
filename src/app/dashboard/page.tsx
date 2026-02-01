
"use client";

import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CreateShopForm from "./create-shop-form";
import ShopDashboard from "./shop-dashboard";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const onShopCreated = (newShopId: string) => {
    // The user object in the context will update automatically via the listener.
    // We can force a router refresh if needed, but it's often not necessary.
    // router.refresh(); 
  }

  const isLoading = isUserLoading;

  if (isLoading || !user) {
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
        <CreateShopForm onShopCreated={onShopCreated} />
      )}
    </div>
  );
}
