
"use client";

import { useMemo } from "react";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Loader2, IndianRupee, Users, Star, TrendingDown, LayoutDashboard, Zap, BadgeCheck } from "lucide-react";
import { format, startOfToday, isToday } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { LedgerEntry, Customer } from "@/docs/backend-types";
import { Badge } from "@/components/ui/badge";

interface AnalyticsTabProps {
  shopId: string;
}

const StatCard = ({ title, value, icon, colorClass, subtitle }: { title: string, value: string, icon: React.ReactNode, colorClass: string, subtitle: string }) => (
    <Card className="rounded-[2rem] border-none shadow-sm transition-all hover:shadow-md overflow-hidden bg-card">
        <div className={`h-1.5 w-full ${colorClass}`} />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
            <div className={`p-2 rounded-xl ${colorClass.replace('bg-', 'bg-')}/10`}>
                {icon}
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-black tracking-tighter">{value}</div>
            <p className="text-[10px] font-bold text-muted-foreground mt-1 flex items-center gap-1">
                {subtitle}
            </p>
        </CardContent>
    </Card>
);

export default function AnalyticsTab({ shopId }: AnalyticsTabProps) {
  const firestore = useFirestore();

  const ledgerQuery = useMemoFirebase(() => {
    if (!shopId || !firestore) return null;
    return query(collection(firestore, "shops", shopId, "ledger"), orderBy("createdAt", "desc"), limit(50));
  }, [firestore, shopId]);

  const customersQuery = useMemoFirebase(() => {
    if (!shopId || !firestore) return null;
    return collection(firestore, "shops", shopId, "customers");
  }, [firestore, shopId]);

  const { data: ledgerEntries, isLoading: isLoadingLedger } = useCollection<LedgerEntry>(ledgerQuery);
  const { data: customers, isLoading: isLoadingCustomers } = useCollection<Customer>(customersQuery);

  const stats = useMemo(() => {
    if (!ledgerEntries || !customers) return { stats: { todayRevenue: 0, totalVisits: 0 }, chartData: [], vipCount: 0, atRiskCount: 0 };
    
    const todayRevenue = ledgerEntries
        .filter(entry => entry.createdAt && isToday(entry.createdAt.toDate()))
        .reduce((acc, entry) => acc + entry.amount, 0);

    const totalVisits = customers.reduce((acc, cust) => acc + (cust.visit_count || 0), 0);
    const vipCount = customers.filter(c => (c.visit_count || 0) >= 5).length;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const atRiskCount = customers.filter(c => {
        const lastVisitDate = c.last_visit?.toDate?.() || new Date(c.last_visit || 0);
        return lastVisitDate < thirtyDaysAgo;
    }).length;

    const revenueByDay = ledgerEntries.reduce((acc, entry) => {
        if (entry.createdAt) {
            const dateStr = format(entry.createdAt.toDate(), 'MMM d');
            acc[dateStr] = (acc[dateStr] || 0) + entry.amount;
        }
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(revenueByDay).map(([date, revenue]) => ({ date, revenue })).slice(0, 7).reverse();

    return { stats: { todayRevenue, totalVisits }, chartData, vipCount, atRiskCount };
  }, [ledgerEntries, customers]);

  if (isLoadingLedger || isLoadingCustomers) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="text-primary" size={24} />
            <h2 className="text-2xl font-black font-headline uppercase tracking-tighter">Apna Shop Dashboard</h2>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatCard title="Aaj ki Bikri" value={`₹${stats.stats.todayRevenue.toLocaleString('en-IN')}`} icon={<IndianRupee className="h-4 w-4 text-primary" />} colorClass="bg-primary" subtitle="Daily Revenue" />
            <StatCard title="Total Visits" value={`${stats.stats.totalVisits}`} icon={<Users className="h-4 w-4 text-secondary" />} colorClass="bg-secondary" subtitle="Store Footfall" />
            <StatCard title="VIP Grahak" value={`${stats.vipCount}`} icon={<Star className="h-4 w-4 text-accent" />} colorClass="bg-accent" subtitle="Loyal Customers" />
            <StatCard title="Lost Grahak" value={`${stats.atRiskCount}`} icon={<TrendingDown className="h-4 w-4 text-destructive" />} colorClass="bg-destructive" subtitle="Risk Alerts" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 rounded-[2rem] border-none shadow-sm overflow-hidden bg-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Sales Trend</CardTitle>
                            <CardDescription className="text-xs">Last 7 days performance</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest border-primary/20 text-primary">Live</Badge>
                    </div>
                </CardHeader>
                <CardContent className="h-[250px] w-full p-4">
                    <ResponsiveContainer>
                        <LineChart data={stats.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                            <YAxis hide />
                            <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none shadow-sm bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">Mitra Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-3 p-3 bg-card rounded-2xl border border-primary/10">
                        <Zap size={16} className="text-primary shrink-0 mt-1" />
                        <div>
                            <p className="text-xs font-bold">10 New Grahaks</p>
                            <p className="text-[10px] text-muted-foreground">Win 10 first-time visits this week.</p>
                        </div>
                    </div>
                    <div className="flex gap-3 p-3 bg-card rounded-2xl border border-primary/10">
                        <BadgeCheck size={16} className="text-secondary shrink-0 mt-1" />
                        <div>
                            <p className="text-xs font-bold">Loyalty Boost</p>
                            <p className="text-[10px] text-muted-foreground">Convert 5 regulars to VIP status.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
