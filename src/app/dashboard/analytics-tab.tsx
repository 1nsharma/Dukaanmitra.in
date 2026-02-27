
"use client";

import { useMemo } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2, IndianRupee, Users, Star, TrendingDown } from "lucide-react";
import { format, startOfToday, isToday } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { LedgerEntry, Customer } from "@/docs/backend-types";
import { Badge } from "@/components/ui/badge";

interface AnalyticsTabProps {
  shopId: string;
}

const StatCard = ({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description: string }) => (
    <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const CustomerListCard = ({ title, customers, description, icon, badgeVariant }: { title: string, customers: Customer[], description: string, icon: React.ReactNode, badgeVariant?: "default" | "destructive" | "outline" | "secondary" }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                {icon}
                {title}
                <Badge variant={badgeVariant}>{customers.length}</Badge>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            {customers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No customers in this category.</p>
            ) : (
                <ul className="space-y-2">
                    {customers.slice(0,5).map(customer => (
                        <li key={customer.phone} className="flex justify-between items-center text-sm p-2 rounded-md bg-secondary/50">
                            <span className="font-medium">{customer.name}</span>
                            <span className="text-muted-foreground">{customer.visit_count} visits</span>
                        </li>
                    ))}
                </ul>
            )}
        </CardContent>
    </Card>
);

export default function AnalyticsTab({ shopId }: AnalyticsTabProps) {
  const firestore = useFirestore();

  const ledgerQuery = useMemoFirebase(() => {
    if (!shopId) return null;
    return query(collection(firestore, "shops", shopId, "ledger"), orderBy("createdAt", "desc"));
  }, [firestore, shopId]);

  const customersQuery = useMemoFirebase(() => {
    if (!shopId) return null;
    return collection(firestore, "shops", shopId, "customers");
  }, [firestore, shopId]);

  const { data: ledgerEntries, isLoading: isLoadingLedger } = useCollection<LedgerEntry>(ledgerQuery);
  const { data: customers, isLoading: isLoadingCustomers } = useCollection<Customer>(customersQuery);

  const stats = useMemo(() => {
    if (!ledgerEntries || !customers) return { stats: { todayRevenue: 0, totalVisits: 0 }, chartData: [], loyaltyCustomers: [], atRiskCustomers: [] };
    
    const todayRevenue = ledgerEntries
        .filter(entry => entry.createdAt && isToday(entry.createdAt.toDate()))
        .reduce((acc, entry) => acc + entry.amount, 0);

    const totalVisits = customers.reduce((acc, cust) => acc + (cust.visit_count || 0), 0);
    const loyaltyCustomers = customers.filter(c => (c.visit_count || 0) >= 5);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const atRiskCustomers = customers.filter(c => {
        const lastVisitDate = c.last_visit?.toDate?.() || new Date(c.last_visit || 0);
        return lastVisitDate < thirtyDaysAgo;
    });

    const revenueByDay = ledgerEntries.reduce((acc, entry) => {
        if (entry.createdAt) {
            const dateStr = format(entry.createdAt.toDate(), 'MMM d');
            acc[dateStr] = (acc[dateStr] || 0) + entry.amount;
        }
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(revenueByDay).map(([date, revenue]) => ({ date, revenue })).reverse();

    return { stats: { todayRevenue, totalVisits }, chartData, loyaltyCustomers, atRiskCustomers };
  }, [ledgerEntries, customers]);

  if (isLoadingLedger || isLoadingCustomers) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Today's Revenue" value={`₹${stats.stats.todayRevenue.toLocaleString('en-IN')}`} icon={<IndianRupee className="h-4 w-4" />} description="Sales recorded today" />
            <StatCard title="Total Visits" value={`${stats.stats.totalVisits}`} icon={<Users className="h-4 w-4" />} description="Customer visits to date" />
            <StatCard title="Loyalty Eligible" value={`${stats.loyaltyCustomers.length}`} icon={<Star className="h-4 w-4" />} description="Customers with 5+ visits" />
            <StatCard title="At-Risk" value={`${stats.atRiskCustomers.length}`} icon={<TrendingDown className="h-4 w-4" />} description="No visit in 30 days" />
        </div>

        <Card>
            <CardHeader><CardTitle>Daily Revenue</CardTitle></CardHeader>
            <CardContent className="h-[350px] w-full p-2">
                <ResponsiveContainer>
                    <LineChart data={stats.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} name="Revenue (₹)" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2">
            <CustomerListCard title="Loyalty Prospects" customers={stats.loyaltyCustomers} description="High-value customers." icon={<Star className="text-yellow-500" />} badgeVariant="secondary" />
            <CustomerListCard title="At-Risk Customers" customers={stats.atRiskCustomers} description="Customers who might churn." icon={<TrendingDown className="text-red-500" />} badgeVariant="destructive" />
        </div>
    </div>
  );
}
