"use client";

import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { doc } from "firebase/firestore";
import CreateShopForm from "./create-shop-form";
import ShopDashboard from "./shop-dashboard";
import type { UserProfile } from "@/docs/backend-types";


export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  // Memoize the document reference
  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const [shopId, setShopId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (userProfile) {
      setShopId(userProfile.shopId);
    }
  }, [userProfile]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const onShopCreated = (newShopId: string) => {
    setShopId(newShopId);
  }

  const isLoading = isUserLoading || isProfileLoading;

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
            Welcome back, {userProfile?.displayName || user.phoneNumber}!
          </p>
        </div>
        <Button onClick={handleSignOut} variant="destructive">
          Sign Out
        </Button>
      </div>

      {shopId ? (
        <ShopDashboard shopId={shopId} />
      ) : (
        <CreateShopForm onShopCreated={onShopCreated} />
      )}
    </div>
  );
}
