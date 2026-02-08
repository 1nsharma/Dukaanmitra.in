
'use client';

import { useMemo } from 'react';
import { collection, query } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { UserProfile } from '@/docs/backend-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserCheck, HeartPulse, Users as UsersIcon, Shield, Database, AlertTriangle } from 'lucide-react';
import { subDays } from 'date-fns';

const StatCard = ({ title, value, icon, isLoading }: { title: string, value: string, icon: React.ReactNode, isLoading: boolean }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-7 w-20" /> : <p className="text-2xl font-bold">{value}</p>}
        </CardContent>
    </Card>
);


export default function DashboardStatCards() {
    const firestore = useFirestore();

    const usersQuery = useMemoFirebase(() => {
        return query(collection(firestore, "users"));
    }, [firestore]);

    const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

    const stats = useMemo(() => {
        if (!users) {
            return {
                totalUsers: 0,
                totalAdmins: 0,
                active24h: 0,
                disabledUsers: 0,
            };
        }
        
        const now = new Date();
        const yesterday = subDays(now, 1);

        const totalUsers = users.length;
        const totalAdmins = users.filter(u => u.role === 'admin' || u.role === 'super_admin').length;
        const disabledUsers = users.filter(u => u.status === 'suspended').length;
        const active24h = users.filter(u => u.lastLogin && u.lastLogin.toDate() > yesterday).length;

        return {
            totalUsers,
            totalAdmins,
            active24h,
            disabledUsers,
        };

    }, [users]);
    
    const statCards = [
        { title: "Total Users", value: stats.totalUsers.toLocaleString(), icon: <Users /> },
        { title: "Total Admins", value: stats.totalAdmins.toLocaleString(), icon: <UserCheck /> },
        { title: "Active (24h)", value: stats.active24h.toLocaleString(), icon: <HeartPulse className="text-green-400" /> },
        { title: "Disabled Users", value: stats.disabledUsers.toLocaleString(), icon: <UsersIcon className="text-destructive"/> },
        { title: "Firestore Collections", value: "7", icon: <Database />, static: true },
        { title: "Errors (24h)", value: "0", icon: <AlertTriangle className="text-green-400" />, static: true },
        { title: "Rule Violations", value: "0", icon: <Shield className="text-green-400" />, static: true },
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
                />
            ))}
        </div>
    );
}
