
"use client";

import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, MessageSquare, Star, RefreshCw, Zap, Bell, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import type { Shop } from '@/docs/backend-types';

interface AutomationTabProps {
  shopId: string;
}

export default function AutomationTab({ shopId }: AutomationTabProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const shopRef = useMemoFirebase(() => {
    if (!shopId) return null;
    return doc(firestore!, "shops", shopId);
  }, [firestore, shopId]);

  const { data: shop, isLoading } = useDoc<Shop>(shopRef);

  const toggleAutomation = (key: string, value: boolean) => {
    startTransition(async () => {
        try {
            await updateDoc(shopRef!, {
                [`settings.automations.${key}`]: value,
                updated_at: serverTimestamp()
            });
            toast({ title: "Rules Updated", description: "WhatsApp automation changed." });
        } catch (e) {
            toast({ title: "Error", description: "Failed to update rules.", variant: "destructive" });
        }
    });
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>;

  const automations = (shop?.settings as any)?.automations || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Zap className="text-primary fill-primary/20" size={24} />
        <h2 className="text-2xl font-black font-headline uppercase tracking-tighter">Apna Munim Automations</h2>
      </div>
      <p className="text-muted-foreground text-sm font-medium italic">"Aap dhanda sambhalein, system customer yaad rakhega."</p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2 transition-all hover:border-primary/20 overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex items-center justify-between">
                <MessageSquare className="text-primary" size={20} />
                <Switch 
                    checked={automations.welcome_message ?? true} 
                    onCheckedChange={(val) => toggleAutomation('welcome_message', val)}
                    disabled={isPending}
                />
            </div>
            <CardTitle className="text-lg font-bold mt-2">New Customer Welcome</CardTitle>
            <CardDescription className="text-xs">Send a "Namaste" message to every new first-time customer.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 transition-all hover:border-primary/20 overflow-hidden">
          <CardHeader className="bg-secondary/5 pb-4">
            <div className="flex items-center justify-between">
                <Star className="text-secondary" size={20} />
                <Switch 
                    checked={automations.loyalty_triggers ?? false} 
                    onCheckedChange={(val) => toggleAutomation('loyalty_triggers', val)}
                    disabled={isPending}
                />
            </div>
            <CardTitle className="text-lg font-bold mt-2">Loyalty Offers</CardTitle>
            <CardDescription className="text-xs">Automatically offer a discount when a customer visits 5 times.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 transition-all hover:border-primary/20 overflow-hidden">
          <CardHeader className="bg-accent/5 pb-4">
            <div className="flex items-center justify-between">
                <RefreshCw className="text-accent" size={20} />
                <Switch 
                    checked={automations.winback_alerts ?? true} 
                    onCheckedChange={(val) => toggleAutomation('winback_alerts', val)}
                    disabled={isPending}
                />
            </div>
            <CardTitle className="text-lg font-bold mt-2">Winback Reminders</CardTitle>
            <CardDescription className="text-xs">Alert you when a regular customer hasn't visited in 30 days.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 transition-all hover:border-primary/20 overflow-hidden">
          <CardHeader className="bg-success/5 pb-4">
            <div className="flex items-center justify-between">
                <Bell className="text-success" size={20} />
                <Switch 
                    checked={automations.udhaar_reminders ?? true} 
                    onCheckedChange={(val) => toggleAutomation('udhaar_reminders', val)}
                    disabled={isPending}
                />
            </div>
            <CardTitle className="text-lg font-bold mt-2">Soft Udhaar Reminders</CardTitle>
            <CardDescription className="text-xs">Send a polite "Convenience Check" for pending balances.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-card rounded-[2rem] border-2 border-dashed border-border flex items-center justify-center text-center">
        <div className="max-w-xs space-y-2">
            <ShieldCheck className="mx-auto text-muted-foreground/50" size={32} />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">More Rules coming soon</p>
            <p className="text-[10px] text-muted-foreground">Custom Hinglish message controls are being verified for your region.</p>
        </div>
      </div>
    </div>
  );
}
