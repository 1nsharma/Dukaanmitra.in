
'use client';

import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageSquare, DollarSign, TrendingUp, ShieldCheck, Zap, Bot } from "lucide-react";
import type { GlobalMetrics } from '@/docs/backend-types';

export default function DashboardStatCards() {
  const firestore = useFirestore();

  const metricsRef = useMemoFirebase(() => {
    return doc(firestore!, "metrics", "global");
  }, [firestore]);

  const { data: metrics, isLoading } = useDoc<GlobalMetrics>(metricsRef);

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  if (!metrics) {
    return (
      <div className="p-8 border-2 border-dashed rounded-xl text-center text-muted-foreground">
        Global metrics aggregation required.
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue (MRR)",
      value: `₹${metrics.mrr?.toLocaleString('en-IN')}`,
      icon: <DollarSign className="text-success h-4 w-4" />,
      desc: "Combined platform revenue"
    },
    {
      title: "Active Shops",
      value: metrics.activeSubscriptions + metrics.activeTrials,
      icon: <ShieldCheck className="text-primary h-4 w-4" />,
      desc: `${metrics.activeSubscriptions} Paid, ${metrics.activeTrials} Trial`
    },
    {
      title: "Conversion Rate",
      value: `${metrics.trialToPaidConversionRate?.toFixed(1)}%`,
      icon: <TrendingUp className="text-accent h-4 w-4" />,
      desc: "Trial to Paid conversion"
    },
    {
      title: "Platform Scale",
      value: metrics.totalShops,
      icon: <Zap className="text-yellow-500 h-4 w-4" />,
      desc: "Total registered businesses"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
