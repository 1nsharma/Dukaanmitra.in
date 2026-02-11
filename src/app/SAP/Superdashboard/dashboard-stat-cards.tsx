
'use client';

import { useMemo } from 'react';
import { collection, query } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { UserProfile, Shop } from '@/docs/backend-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Briefcase, HeartPulse, DollarSign, Database, AlertTriangle, Zap, MessageSquare } from 'lucide-react';
import { subDays } from 'date-fns';

const StatCard = ({ title, value, icon, isLoading, description }: { title: string, value: string, icon: React.ReactNode, isLoading: boolean, description?: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-7 w-20" /> : <p className="text-2xl font-bold">{value}</p>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);


export default function DashboardStatCards() {
    const firestore = useFirestore();

    const usersQuery = useMemoFirebase(() => query(collection(firestore, "users")), [firestore]);
    const shopsQuery = useMemoFirebase(() => query(collection(firestore, "shops")), [firestore]);

    const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersQuery);
    const { data: shops, isLoading: isLoadingShops } = useCollection<Shop>(shopsQuery);

    const stats = useMemo(() => {
        if (!users || !shops) {
            return {
                totalBusinesses: 0,
                totalUsers: 0,
                totalRevenue: 0,
                activeUsers24h: 0,
            };
        }
        
        const now = new Date();
        const yesterday = subDays(now, 1);

        const totalBusinesses = shops.length;
        const totalUsers = users.length;
        const totalRevenue = shops.reduce((acc, shop) => acc + (shop.mrr || 0), 0);
        const activeUsers24h = users.filter(u => u.lastLogin && u.lastLogin.toDate() > yesterday).length;

        return {
            totalBusinesses,
            totalUsers,
            totalRevenue,
            activeUsers24h,
        };

    }, [users, shops]);
    
    const isLoading = isLoadingUsers || isLoadingShops;
    
    const statCards = [
        { title: "Total Businesses", value: stats.totalBusinesses.toLocaleString(), icon: <Briefcase />, description: "+12% from last month" },
        { title: "Monthly Revenue", value: `₹${(stats.totalRevenue / 1000).toFixed(0)}K`, icon: <DollarSign />, description: "+23.5% growth" },
        { title: "Total Users", value: stats.totalUsers.toLocaleString(), icon: <Users />, description: "Across all businesses" },
        { title: "Active Users (24h)", value: stats.activeUsers24h.toLocaleString(), icon: <HeartPulse className="text-green-400" /> },
        { title: "AI Calls Today", value: "3.4K", icon: <Zap />, static: true, description: "Real-time processing" },
        { title: "Messages This Month", value: "128K", icon: <MessageSquare />, static: true },
        { title: "Errors (24h)", value: "0", icon: <AlertTriangle className="text-green-400" />, static: true },
        { title: "System Uptime", value: "99.8%", icon: <Database className="text-green-400" />, static: true },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map(card => (
                <StatCard 
                    key={card.title} 
                    title={card.title} 
                    value={card.value} 
                    icon={card.icon} 
                    isLoading={isLoading && !card.static}
                    description={card.description}
                />
            ))}
        </div>
    );
}
