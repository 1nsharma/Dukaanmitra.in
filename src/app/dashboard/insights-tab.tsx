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
import { executeAction } from "@/lib/services/action-engine";

interface InsightsTabProps {
  shopId: string;
}

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

  const insightsQuery = useMemoFirebase(() => {
    if (!shopId) return null;
    return query(
      collection(firestore, "shops", shopId, "insights"),
      orderBy("createdAt", "desc"),
      limit(15)
    );
  }, [firestore, shopId]);

  const { data: insights, isLoading } = useCollection(insightsQuery);

  const handleAction = (insight: any) => {
      startTransition(async () => {
          try {
              const result = await executeAction({
                  type: insight.action_type,
                  payload: insight.action_payload
              }, 'owner');

              if (result.success) {
                  toast({ title: "Agent Action Success", description: "Entry updated by Munim AI." });
                  await deleteDoc(doc(firestore, "shops", shopId, "insights", insight.id));
              } else {
                  toast({ title: "Execution Failed", description: result.message, variant: "destructive" });
              }
          } catch (e) {
              toast({ title: "Error", description: "Failed to process agent action.", variant: "destructive" });
          }
      });
  }

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
            <Cpu size={20} className="text-primary animate-pulse" />
            <h2 className="text-2xl font-black font-headline uppercase tracking-tighter">MitraOS Intelligence Feed</h2>
        </div>
        <p className="text-muted-foreground">Collaborative insights from Munim, Vyapar, and Grahak AI agents.</p>
      </div>

      {!insights?.length ? (
        <Card className="bg-secondary/20 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-bold uppercase">Waiting for Data</h3>
            <p className="text-sm text-muted-foreground max-w-xs">Record your first WhatsApp entry to activate your AI agents.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="transition-all hover:border-primary/50 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${insight.type === 'ACTION_REQUIRED' ? 'bg-accent' : insight.type === 'RISK_ALERT' ? 'bg-destructive' : 'bg-primary'}`} />
              
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <div className="mt-1 p-2 bg-muted rounded-xl shadow-inner">
                  {renderIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold tracking-tight">{insight.title}</CardTitle>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {format(insight.createdAt?.toDate?.() || new Date(), "HH:mm, PP")}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    {renderAgentBadge(insight.type)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                  {insight.message}
                </p>
                
                {insight.action_label && (
                    <div className="mt-4 pt-4 border-t border-dashed flex items-center justify-between">
                        <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                            <Zap size={10} className="text-accent"/> Human-in-the-loop requirement
                        </p>
                        <Button 
                            size="sm" 
                            className="h-8 rounded-full text-xs font-black uppercase tracking-widest bg-accent hover:bg-accent/90"
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
