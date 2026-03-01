
"use client";

import { collection, query, orderBy, limit } from "firebase/firestore";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingDown, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

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
        <p className="text-muted-foreground">Automated business intelligence for your shop.</p>
      </div>

      {!insights?.length ? (
        <Card className="bg-secondary/20 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-bold">No Insights Yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">Record more transactions on WhatsApp to receive automated business advice.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="transition-all hover:border-primary/50">
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
                    {insight.type.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {insight.message}
                </p>
                {insight.action_label && (
                    <div className="mt-4 flex justify-end">
                        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                            {insight.action_label} →
                        </Badge>
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

import { Lightbulb } from "lucide-react";
