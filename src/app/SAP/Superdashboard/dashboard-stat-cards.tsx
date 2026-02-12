
'use client';

import { useMemo } from 'react';
import { collection, query } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Shop } from '@/docs/backend-types';
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
    const shopsQuery = useMemoFirebase(() => query(collection(firestore, "shops")), [firestore]);
    const { data: shops, isLoading: isLoadingShops } = useCollection<Shop>(shopsQuery);

    const stats = useMemo(() => {
        if (!shops) {
            return {
                totalRevenue: 0,
                activeSubscriptions: 0,
                activeTrials: 0,
                lockedAccounts: 0,
                totalBusinesses: 0,
            };
        }

        const totalRevenue = shops.reduce((acc, shop) => acc + (shop.mrr || 0), 0);
        const activeSubscriptions = shops.filter(s => s.status === 'active').length;
        const activeTrials = shops.filter(s => s.status === 'trial').length;
        const lockedAccounts = shops.filter(s => s.status === 'locked' || s.status === 'suspended').length;

        return {
            totalRevenue,
            activeSubscriptions,
            activeTrials,
            lockedAccounts,
            totalBusinesses: shops.length,
        };

    }, [shops]);
    
    const isLoading = isLoadingShops;
    
    const statCards = [
        { title: "Monthly Recurring Revenue", value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: <DollarSign />, metric: 'revenue' },
        { title: "Active Subscriptions", value: stats.activeSubscriptions, icon: <CheckCircle className="text-green-500"/>, metric: 'active' },
        { title: "Active Trials", value: stats.activeTrials, icon: <Clock className="text-yellow-500" />, metric: 'trials' },
        { title: "Locked/Churned", value: stats.lockedAccounts, icon: <Lock className="text-red-500" />, metric: 'locked' },
    ]

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
