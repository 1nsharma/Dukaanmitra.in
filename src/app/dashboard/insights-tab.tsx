
"use client";

import { collection, query, orderBy, limit } from "firebase/firestore";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingDown, TrendingUp, AlertCircle, CheckCircle2, Lightbulb, Zap } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface InsightsTabProps {
  shopId: string;
}

const renderIcon = (type: string) => {
    switch (type) {
        case 'SALES_DROP': return <TrendingDown className="text-destructive h-5 w-5" />;
        case 'GROWTH_TIP': return <TrendingUp className="text-primary h-5 w-5" />;
        case 'RISK_ALERT': return <AlertCircle className="text-warning h-5 w-5" />;
        case 'SUCCESS': return <CheckCircle2 className="text-success h-5 w-5" />;
        default: return <AlertCircle className="h-5 w-5" />;
    }
}

export default function InsightsTab({ shopId }: InsightsTabProps) {
  const firestore = useFirestore();

  const insightsQuery = useMemoFirebase(() => {
    if (!shopId) return null;
    return query(
      collection(firestore, "shops", shopId, "insights"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
  }, [firestore, shopId]);

  const { data: insights, isLoading } = useCollection(insightsQuery);

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold font-headline uppercase">Owner Co-Pilot</h2>
        <p className="text-muted-foreground">Autonomous business intelligence for your shop.</p>
      </div>

      {!insights?.length ? (
        <Card className="bg-secondary/20 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-bold">No Insights Yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">Record more transactions on WhatsApp to activate autonomous intelligence.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="transition-all hover:border-primary/50 relative overflow-hidden">
              {/* Risk Boundary Visual */}
              <div className={`absolute top-0 left-0 w-1 h-full ${insight.type === 'RISK_ALERT' ? 'bg-destructive' : 'bg-primary'}`} />
              
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <div className="mt-1 p-2 bg-muted rounded-full">
                  {renderIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {format(insight.createdAt?.toDate?.() || new Date(), "PP")}
                    </span>
                  </div>
                  <Badge variant="outline" className="mt-1 text-[10px] uppercase tracking-wider">
                    Layer 1: Assisted Intelligence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {insight.message}
                </p>
                
                {/* Guided Automation (Layer 2) */}
                {insight.action_label && (
                    <div className="mt-4 pt-4 border-t border-dashed flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Zap size={10} className="text-primary"/> Guided Action Ready
                        </p>
                        <Button size="sm" className="h-8 rounded-full text-xs font-bold">
                            {insight.action_label} →
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
