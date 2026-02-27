"use client";

import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import CreateShopForm from "./create-shop-form";
import ShopDashboard from "./shop-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { orchestrateAI } from "@/ai/flows/orchestrator-flow";
import { useToast } from "@/hooks/use-toast";

/**
 * The consolidated Dashboard entry point.
 * This resolves the "parallel pages" build collision.
 */
export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSignOut = async () => {
    if (auth) {
        await auth.signOut();
        router.push('/');
    }
  };

  const handleGetAiAdvice = async () => {
    if (!user) return;
    setIsAiLoading(true);
    try {
      const result = await orchestrateAI({
        userId: user.uid,
        message: "Analyze my recent sales and give me 3 growth tips."
      });
      toast({
        title: "Munim Advice Ready!",
        description: result.final_answer.substring(0, 100) + "...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch AI advice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.replace('/login');
    return null;
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl uppercase">
            Shopkeeper Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome, {user?.displayName || user.email}!
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleGetAiAdvice} 
              disabled={isAiLoading}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 rounded-full"
            >
              {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Get AI Munim Advice
            </Button>
            {user.role === 'super_admin' && (
                <Button asChild variant="outline" className="rounded-full">
                    <Link href="/SAP/Superdashboard">Super Admin Panel</Link>
                </Button>
            )}
            <Button onClick={handleSignOut} variant="destructive" className="rounded-full">
                Sign Out
            </Button>
        </div>
      </div>

      {user.shopId ? (
        <ShopDashboard shopId={user.shopId} />
      ) : user.role === 'super_admin' ? (
         <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Super Admin Mode</CardTitle>
            <CardDescription>
              This is the view for shop owners.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">As a Super Admin, you can visit the main panel to manage all shops.</p>
             <div className="mt-4">
                <Button asChild className="rounded-full">
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
