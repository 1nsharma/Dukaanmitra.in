
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@/firebase";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Main dashboard layout.
 * Handles authentication checks and account status logic.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.status === "suspended" && auth) {
      auth.signOut();
      toast({
        title: "Account Suspended",
        description: "Your account has been suspended. Please contact support.",
        variant: "destructive",
      });
      router.replace("/login");
    }
  }, [user, isUserLoading, router, auth, toast]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
