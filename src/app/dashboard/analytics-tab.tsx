"use client";

import { useMemo, useState } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2, IndianRupee, Users, Receipt, Bot, Sparkles, AlertCircle, ShoppingCart, TrendingUp } from "lucide-react";
import { format, parseISO, startOfDay, subDays } from "date-fns";
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
import { generateRetailInsights, type RetailInsightsOutput } from "@/ai/flows/retail-insights-flow";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

const InsightCard = ({ title, content, icon }: { title: string, content: string, icon: React.ReactNode }) => (
    <div className="flex items-start gap-4">
        <div className="bg-primary/10 text-primary p-3 rounded-xl">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{content}</p>
        </div>
    </div>
);

export default function AnalyticsTab({ shopId }: AnalyticsTabProps) {
  const firestore = useFirestore();
  const [insights, setInsights] = useState<RetailInsightsOutput | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

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

  const handleGenerateInsights = async () => {
    if (!bills || !customers) return;

    setIsLoadingInsights(true);
    setInsights(null);
    setInsightsError(null);
    try {
        const thirtyDaysAgo = subDays(new Date(), 30);
        const recentBills = bills.filter(bill => {
            if (!bill.created_at) return false;
            const billDate = typeof bill.created_at === 'string' 
                ? parseISO(bill.created_at)
                : (bill.created_at as any).toDate();
            return billDate > thirtyDaysAgo;
        });
      
        const result = await generateRetailInsights({ bills: recentBills, customers });
        setInsights(result);
    } catch (error) {
        console.error("Error generating insights:", error);
        setInsightsError("Sorry, I couldn't generate insights right now. Please try again later.");
    } finally {
        setIsLoadingInsights(false);
    }
  }

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
                <CardDescription>Gemini is analyzing your data to find growth opportunities. Click the button to get your latest insights.</CardDescription>
            </CardHeader>
            <CardContent>
                {!insights && !isLoadingInsights && !insightsError && (
                    <div className="text-center py-8 space-y-4">
                        <div className="mx-auto bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <p className="text-muted-foreground">Unlock powerful insights about your business.</p>
                        <Button onClick={handleGenerateInsights}>
                            Generate Insights
                        </Button>
                    </div>
                )}
                {isLoadingInsights && (
                    <div className="text-center py-8 text-muted-foreground space-y-2">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                        <p>Generating insights... this may take a moment.</p>
                    </div>
                )}
                {insightsError && (
                     <div className="text-center py-8 text-destructive space-y-4">
                        <div className="mx-auto bg-destructive/10 rounded-full w-16 h-16 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <p>{insightsError}</p>
                        <Button onClick={handleGenerateInsights} variant="destructive">
                            Try Again
                        </Button>
                    </div>
                )}
                {insights && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Top Action Items</h3>
                            <ul className="space-y-2">
                                {insights.keyActionItems.map((item, index) => (
                                    <li key={index} className="flex items-center gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                                        <Badge className="bg-accent text-accent-foreground">{index + 1}</Badge>
                                        <p className="text-sm font-medium">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="bg-muted/50 hover:bg-muted/80 px-4 rounded-md">Detailed Analysis</AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-6">
                                     <InsightCard 
                                        title="Customer Insights"
                                        content={insights.customerInsights}
                                        icon={<Users className="w-6 h-6"/>}
                                     />
                                     <InsightCard 
                                        title="Fast-Moving Items"
                                        content={insights.fastMovingItems}
                                        icon={<ShoppingCart className="w-6 h-6"/>}
                                     />
                                     <InsightCard 
                                        title="Operational Inefficiencies"
                                        content={insights.operationalInefficiencies}
                                        icon={<AlertCircle className="w-6 h-6"/>}
                                     />
                                     <InsightCard 
                                        title="Revenue Leakage"
                                        content={insights.revenueLeakage}
                                        icon={<TrendingUp className="w-6 h-6"/>}
                                     />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                         <div className="text-center pt-4">
                            <Button onClick={handleGenerateInsights} variant="outline">
                                Regenerate Insights
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
