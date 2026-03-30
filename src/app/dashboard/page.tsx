
"use client";

import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Gift, LogOut } from "lucide-react";
import CreateShopForm from "./create-shop-form";
import ShopDashboard from "./shop-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { orchestrateAI } from "@/ai/flows/orchestrator-flow";
import { useToast } from "@/hooks/use-toast";

/**
 * The consolidated Dashboard entry point.
 * Optimized for "Street SaaS" pilot.
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

  const handleReferral = () => {
      toast({
          title: "Referral Link Copied!",
          description: "Apne dost ko bhejien. Unke signup par aapko 1 mahina free milega! 🎁"
      });
  };

  const handleGetAiAdvice = async () => {
    if (!user) return;
    setIsAiLoading(true);
    try {
      const result = await orchestrateAI({
        userId: user.uid,
        message: "Analyze my recent sales and give me 3 growth tips."
      });
      const previewText =
        typeof (result as any)?.final_answer === "string"
          ? (result as any).final_answer
          : String(result.summary || "");
      toast({
        title: "Munim Advice Ready!",
        description: previewText.substring(0, 100) + "...",
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
    <div className="container py-12 md:py-20">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="font-headline text-3xl font-black tracking-tighter uppercase leading-none">
            Apna <span className="text-primary">Munim</span>
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Namaste, {user?.displayName || user.email?.split('@')[0]}! 🙏
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleReferral}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 rounded-full font-bold uppercase text-[10px] tracking-widest h-10 px-6"
            >
              <Gift className="mr-2 h-4 w-4" />
              Earn Free Months
            </Button>
            
            <Button 
              onClick={handleGetAiAdvice} 
              disabled={isAiLoading}
              variant="default"
              className="rounded-full font-bold uppercase text-[10px] tracking-widest h-10 px-6 shadow-lg shadow-primary/20"
            >
              {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              AI Tips
            </Button>

            <Button onClick={handleSignOut} variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                <LogOut size={18} />
            </Button>
        </div>
      </div>

      {user.shopId ? (
        <ShopDashboard shopId={user.shopId} />
      ) : (
        <div className="py-12">
            <CreateShopForm onShopCreated={() => {}} />
        </div>
      )}
    </div>
  );
}
