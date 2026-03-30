
"use client";

import { collection, query, orderBy, limit, doc, deleteDoc } from "firebase/firestore";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingDown, TrendingUp, AlertCircle, CheckCircle2, Lightbulb, Zap, Check, Shield, Users, Cpu } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

interface InsightsTabProps {
  shopId: string;
}

type InsightItem = {
  id: string;
  type?: string;
  title?: string;
  message?: string;
  createdAt?: { toDate?: () => Date };
  action_label?: string;
  action_type?: string;
  action_payload?: Record<string, unknown>;
};

const renderAgentBadge = (type: string) => {
    switch (type) {
        case 'SALES_DROP': 
        case 'GROWTH_TIP': return <Badge variant="outline" className="text-[10px] bg-blue-500/10 border-blue-500/20 text-blue-500"><TrendingUp size={10} className="mr-1"/> VYAPAR AI</Badge>;
        case 'RISK_ALERT':
        case 'ACTION_REQUIRED': return <Badge variant="outline" className="text-[10px] bg-orange-500/10 border-orange-500/20 text-orange-500"><Shield size={10} className="mr-1"/> MUNIM AI</Badge>;
        case 'SUCCESS': return <Badge variant="outline" className="text-[10px] bg-green-500/10 border-green-500/20 text-green-500"><Users size={10} className="mr-1"/> GRAHAK AI</Badge>;
        default: return <Badge variant="outline" className="text-[10px]"><Cpu size={10} className="mr-1"/> MITRAOS</Badge>;
    }
}

const renderIcon = (type: string) => {
    switch (type) {
        case 'SALES_DROP': return <TrendingDown className="text-destructive h-5 w-5" />;
        case 'GROWTH_TIP': return <TrendingUp className="text-primary h-5 w-5" />;
        case 'RISK_ALERT': return <AlertCircle className="text-warning h-5 w-5" />;
        case 'SUCCESS': return <CheckCircle2 className="text-success h-5 w-5" />;
        case 'ACTION_REQUIRED': return <Zap className="text-accent h-5 w-5" />;
        default: return <AlertCircle className="h-5 w-5" />;
    }
}

export default function InsightsTab({ shopId }: InsightsTabProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [clientError, setClientError] = useState<string | null>(null);

  const insightsQuery = useMemoFirebase(() => {
    if (!shopId || !firestore) return null;
    return query(
      collection(firestore, "shops", shopId, "insights"),
      orderBy("createdAt", "desc"),
      limit(15)
    );
  }, [firestore, shopId]);

  const { data: insights, isLoading } = useCollection(insightsQuery);

  const handleAction = (insight: InsightItem) => {
      startTransition(async () => {
          try {
              setClientError(null);
              if (!firestore || !shopId || !insight?.id || !insight?.action_type || !insight?.action_payload) {
                const errorMessage = "Action details are incomplete. Please refresh and try again.";
                console.error('[CLIENT_ERROR] Invalid insight action payload', { insightId: insight?.id });
                toast({ title: "Failed", description: errorMessage, variant: "destructive" });
                return;
              }

              const response = await fetch('/api/execute-action', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: {
                      type: insight.action_type,
                      payload: { ...insight.action_payload, shopId }
                    },
                    actor: { id: 'owner', role: 'owner', shopId }
                  })
              });
              const result: { success?: boolean; message?: string } = await response.json().catch(() => ({}));

              if (response.ok && result.success) {
                  toast({ title: "Action Successful", description: "Ledger updated." });
                  await deleteDoc(doc(firestore, "shops", shopId, "insights", insight.id));
              } else {
                  const message = result.message || "Could not process action.";
                  console.error('[CLIENT_ERROR] Failed to execute proposal action', { insightId: insight.id, status: response.status });
                  setClientError(message);
                  toast({ title: "Failed", description: message, variant: "destructive" });
              }
          } catch (e) {
              console.error('[CLIENT_ERROR] Unexpected proposal handling error', e);
              setClientError("Failed to process proposal.");
              toast({ title: "Error", description: "Failed to process proposal.", variant: "destructive" });
          }
      });
  }

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
            <Cpu size={20} className="text-primary animate-pulse" />
            <h2 className="text-2xl font-black font-headline uppercase tracking-tighter">Apna Mitra Intelligence</h2>
        </div>
        <p className="text-muted-foreground text-sm">System proposals based on your WhatsApp data.</p>
      </div>

      {!insights?.length ? (
        <Card className="bg-secondary/20 border-dashed rounded-[2rem]">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-bold uppercase text-xs tracking-widest text-muted-foreground">Waiting for Signals</h3>
            <p className="text-[10px] text-muted-foreground max-w-[200px] mt-2">Record more WhatsApp entries to see Munim, Vyapar, and Grahak AI advice.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clientError && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-4 text-xs text-destructive">{clientError}</CardContent>
            </Card>
          )}
          {insights.map((insight: InsightItem) => (
            <Card key={insight.id} className="rounded-[2rem] border-none shadow-sm relative overflow-hidden bg-card">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${insight.type === 'ACTION_REQUIRED' ? 'bg-accent' : insight.type === 'RISK_ALERT' ? 'bg-destructive' : 'bg-primary'}`} />
              
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <div className="mt-1 p-2 bg-muted rounded-xl">
                  {renderIcon(insight.type || 'UNKNOWN')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">{insight.title || 'Untitled insight'}</CardTitle>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">
                      {format(insight.createdAt?.toDate?.() || new Date(), "HH:mm")}
                    </span>
                  </div>
                  <div className="mt-1">
                    {renderAgentBadge(insight.type || 'UNKNOWN')}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {insight.message || 'No details available for this insight.'}
                </p>
                
                {insight.action_label && (
                    <div className="mt-4 pt-4 border-t border-dashed flex items-center justify-between">
                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-wider">
                            Owner approval needed
                        </p>
                        <Button 
                            size="sm" 
                            className="h-8 rounded-full text-[10px] font-black uppercase tracking-widest bg-accent hover:bg-accent/90"
                            onClick={() => handleAction(insight)}
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="animate-spin h-3 w-3 mr-1"/> : <Check className="h-3 w-3 mr-1"/>}
                            {insight.action_label}
                        </Button>
                    </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
