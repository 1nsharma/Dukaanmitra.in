
'use client';

import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { GlobalMetrics } from '@/docs/backend-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Clock, Lock, CheckCircle, TrendingUp, Percent, Users, Briefcase } from 'lucide-react';

const StatCard = ({ title, value, icon, isLoading, description }: { title: string, value: string | number, icon: React.ReactNode, isLoading: boolean, description?: string }) => (
    <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-8 w-24" /> : <p className="text-3xl font-bold">{value}</p>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);

export default function DashboardStatCards() {
    const firestore = useFirestore();
    
    // Read from a single, aggregated document. This is vastly more scalable and cost-effective.
    const metricsRef = useMemoFirebase(() => doc(firestore, "metrics", "global"), [firestore]);
    const { data: metrics, isLoading } = useDoc<GlobalMetrics>(metricsRef);

    const defaultMetrics: GlobalMetrics = {
        id: 'global',
        mrr: 0,
        activeSubscriptions: 0,
        activeTrials: 0,
        churnedShops: 0,
        totalShops: 0,
        totalUsers: 0,
        trialToPaidConversionRate: 0,
        avgRevenuePerShop: 0,
        updatedAt: new Date(),
    };

    const displayMetrics = metrics || defaultMetrics;

    const statCards = [
        { title: "Monthly Recurring Revenue", value: `₹${(displayMetrics.mrr || 0).toLocaleString('en-IN')}`, icon: <DollarSign />, description: "Total monthly revenue from active subscriptions." },
        { title: "Active Subscriptions", value: displayMetrics.activeSubscriptions || 0, icon: <CheckCircle className="text-green-500"/>, description: "Total number of paying shops." },
        { title: "Active Trials", value: displayMetrics.activeTrials || 0, icon: <Clock className="text-yellow-500" />, description: "Shops currently in their trial period." },
        { title: "Churned/Locked Shops", value: displayMetrics.churnedShops || 0, icon: <Lock className="text-red-500" />, description: "Shops that have expired and not renewed." },
        { title: "Total Shops", value: displayMetrics.totalShops || 0, icon: <Briefcase /> },
        { title: "Total Users", value: displayMetrics.totalUsers || 0, icon: <Users /> },
        { title: "Trial Conversion Rate", value: `${(displayMetrics.trialToPaidConversionRate || 0).toFixed(1)}%`, icon: <Percent /> },
        { title: "Avg. Revenue Per Shop", value: `₹${(displayMetrics.avgRevenuePerShop || 0).toFixed(0)}`, icon: <TrendingUp /> },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map(card => (
                <StatCard 
                    key={card.title} 
                    title={card.title} 
                    value={card.value} 
                    icon={card.icon} 
                    isLoading={isLoading}
                    description={card.description}
                />
            ))}
        </div>
    );
}
