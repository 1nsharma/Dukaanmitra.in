"use client";

import { useMemo } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2, IndianRupee, Users, Receipt, Bot } from "lucide-react";
import { format, parseISO, startOfDay } from "date-fns";
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
import type { Bill, Customer } from "@/docs/backend-types";
import { Button } from "@/components/ui/button";

interface AnalyticsTabProps {
  shopId: string;
}

const StatCard = ({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description: string }) => (
    <Card>
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

export default function AnalyticsTab({ shopId }: AnalyticsTabProps) {
  const firestore = useFirestore();

  const billsQuery = useMemoFirebase(() => {
    if (!shopId) return null;
    return query(
      collection(firestore, "shops", shopId, "bills"),
      orderBy("created_at", "desc")
    );
  }, [firestore, shopId]);

  const customersQuery = useMemoFirebase(() => {
    if (!shopId) return null;
    return collection(firestore, "shops", shopId, "customers");
  }, [firestore, shopId]);

  const { data: bills, isLoading: isLoadingBills } = useCollection<Bill>(billsQuery);
  const { data: customers, isLoading: isLoadingCustomers } = useCollection<Customer>(customersQuery);

  const { stats, chartData } = useMemo(() => {
    if (!bills || !customers) return { stats: {}, chartData: [] };
    
    const totalRevenue = bills.reduce((acc, bill) => acc + bill.amount, 0);
    const totalBills = bills.length;
    const avgBillValue = totalBills > 0 ? totalRevenue / totalBills : 0;

    const revenueByDay = bills.reduce((acc, bill) => {
        if (bill.created_at) {
            const date = typeof bill.created_at === 'string' 
                ? parseISO(bill.created_at)
                : (bill.created_at as any).toDate();
            
            const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
            
            if (!acc[dateStr]) {
                acc[dateStr] = 0;
            }
            acc[dateStr] += bill.amount;
        }
        return acc;
    }, {} as Record<string, number>);

    const formattedChartData = Object.entries(revenueByDay)
      .map(([date, revenue]) => ({
        date: format(parseISO(date), 'MMM d'),
        revenue: parseFloat(revenue.toFixed(2)),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
        stats: {
            totalRevenue,
            totalCustomers: customers.length,
            totalBills,
            avgBillValue,
        },
        chartData: formattedChartData,
    }
  }, [bills, customers]);

  const isLoading = isLoadingBills || isLoadingCustomers;

  if (isLoading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="Total Revenue"
                value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`}
                icon={<IndianRupee className="h-4 w-4 text-muted-foreground" />}
                description="Total revenue from all bills"
            />
            <StatCard 
                title="Total Customers"
                value={`${stats.totalCustomers || 0}`}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                description="Total number of customers"
            />
            <StatCard 
                title="Total Bills"
                value={`${stats.totalBills || 0}`}
                icon={<Receipt className="h-4 w-4 text-muted-foreground" />}
                description="Total number of bills recorded"
            />
            <StatCard 
                title="Average Bill Value"
                value={`₹${(stats.avgBillValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                icon={<IndianRupee className="h-4 w-4 text-muted-foreground" />}
                description="Average amount per transaction"
            />
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>A chart showing your daily revenue.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] w-full p-2">
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))"
                            }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} name="Revenue (₹)" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot />
                    AI-Powered Insights
                </CardTitle>
                <CardDescription>Gemini is analyzing your data to find growth opportunities.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8 text-muted-foreground space-y-2">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    <p>Generating insights...</p>
                    <p className="text-xs">(This feature is coming soon)</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
