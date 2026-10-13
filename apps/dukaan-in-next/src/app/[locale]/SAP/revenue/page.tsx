
'use client';

import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import type { GlobalMetrics } from '@/docs/backend-types';

export default function RevenuePage() {
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
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Global metrics have not been aggregated yet. Please run the Metrics Aggregator Flow.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: "Monthly Recurring Revenue (MRR)",
      value: `₹${metrics.mrr?.toLocaleString('en-IN')}`,
      description: "Total subscription value of active shops.",
      icon: <DollarSign className="text-success" />,
      trend: "up"
    },
    {
      title: "Active Subscriptions",
      value: metrics.activeSubscriptions,
      description: "Paying businesses currently on the platform.",
      icon: <CreditCard className="text-primary" />,
      trend: "up"
    },
    {
      title: "Conversion Rate",
      value: `${metrics.trialToPaidConversionRate?.toFixed(1)}%`,
      description: "Trials successfully converted to paid plans.",
      icon: <TrendingUp className="text-accent" />,
      trend: "stable"
    },
    {
      title: "Total Shops",
      value: metrics.totalShops,
      description: "Total registered businesses (Active + Trial + Cancelled).",
      icon: <Users className="text-muted-foreground" />,
      trend: "up"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue Dashboard</h1>
          <p className="text-muted-foreground">Platform-wide financial health and subscription metrics.</p>
        </div>
        <Badge variant="outline" className="font-mono">Schema v{metrics.version}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs">
                {stat.trend === 'up' ? (
                  <span className="flex items-center text-success"><ArrowUpRight size={14}/> Growth</span>
                ) : (
                  <span className="flex items-center text-muted-foreground"><TrendingUp size={14}/> Stable</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Breakdown of active vs. trial businesses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Subscriptions</span>
                <span className="font-bold">{metrics.activeSubscriptions}</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${(metrics.activeSubscriptions / metrics.totalShops) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Trials</span>
                <span className="font-bold">{metrics.activeTrials}</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent" 
                  style={{ width: `${(metrics.activeTrials / metrics.totalShops) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Churned/Cancelled</span>
                <span>{metrics.churnedShops}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Chief Architect Insights</CardTitle>
            <CardDescription>Automated performance observations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-background rounded-lg border text-sm">
              <p className="font-bold text-primary flex items-center gap-2">
                <TrendingUp size={16}/> Revenue Velocity
              </p>
              <p className="text-muted-foreground mt-1">MRR is stable. Focus on converting the {metrics.activeTrials} trial users currently in the pipeline.</p>
            </div>
            <div className="p-3 bg-background rounded-lg border text-sm">
              <p className="font-bold text-accent flex items-center gap-2">
                <CreditCard size={16}/> Churn Alert
              </p>
              <p className="text-muted-foreground mt-1">Churned shops represent {((metrics.churnedShops / metrics.totalShops) * 100).toFixed(1)}% of total volume. Analyze 'At-Risk' customers in the Grahak AI module.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
