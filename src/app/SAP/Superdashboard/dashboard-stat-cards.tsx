
'use client';

import { useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { GlobalMetrics } from '@/docs/backend-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, DollarSign, Clock, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, icon, isLoading }: { title: string, value: string | number, icon: React.ReactNode, isLoading: boolean }) => (
    <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-8 w-24" /> : <p className="text-3xl font-bold">{value}</p>}
        </CardContent>
    </Card>
);

export default function DashboardStatCards() {
    const firestore = useFirestore();
    
    // Read from a single, aggregated document instead of querying the entire collection.
    // This is vastly more scalable and cost-effective.
    // This document must be updated by a backend Cloud Function on every subscription event.
    const metricsRef = useMemoFirebase(() => doc(firestore, "metrics", "global"), [firestore]);
    const { data: metrics, isLoading } = useDoc<GlobalMetrics>(metricsRef);

    const defaultMetrics = {
        mrr: 0,
        activeSubscriptions: 0,
        activeTrials: 0,
        lockedAccounts: 0,
    };

    const displayMetrics = metrics || defaultMetrics;

    const statCards = [
        { title: "Monthly Recurring Revenue", value: `₹${(displayMetrics.mrr || 0).toLocaleString('en-IN')}`, icon: <DollarSign /> },
        { title: "Active Subscriptions", value: displayMetrics.activeSubscriptions || 0, icon: <CheckCircle className="text-green-500"/> },
        { title: "Active Trials", value: displayMetrics.activeTrials || 0, icon: <Clock className="text-yellow-500" /> },
        { title: "Locked/Churned", value: displayMetrics.lockedAccounts || 0, icon: <Lock className="text-red-500" /> },
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
                />
            ))}
        </div>
    );
}
