
'use client';

import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Log } from '@/docs/backend-types';
import { Loader2, FileClock } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNowStrict(d, { addSuffix: true });
};

const renderEventBadge = (event: string) => {
    if (event.includes('update')) return <Badge variant="secondary">Update</Badge>;
    if (event.includes('payment')) return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Payment</Badge>;
    if (event.includes('suspend') || event.includes('lock')) return <Badge variant="destructive">Lock/Suspend</Badge>;
    return <Badge variant="outline">{event}</Badge>;
}

export default function RecentActivity() {
    const firestore = useFirestore();

    const logsQuery = useMemoFirebase(() => {
        return query(
            collection(firestore, "logs"),
            orderBy("createdAt", "desc"),
            limit(7)
        );
    }, [firestore]);

    const { data: logs, isLoading } = useCollection<Log>(logsQuery);

    if (isLoading) {
        return <div className="flex justify-center items-center h-40"><Loader2 className="w-8 h-8 animate-spin"/></div>
    }

    if (!logs || logs.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-4">
            <FileClock className="w-12 h-12 text-muted-foreground/50" />
            <h3 className="font-semibold text-foreground">No System Activity Yet</h3>
            <p className="text-sm">Important events like admin actions and payments will appear here.</p>
        </div>
      );
    }

    return (
        <ul className="space-y-4">
            {logs.map(log => (
                <li key={log.id} className="flex items-center justify-between gap-4 text-sm">
                    <div className="flex-1">
                        <p className="font-medium leading-snug">{(log.details as any).message || log.event.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</p>
                    </div>
                    {renderEventBadge(log.event)}
                </li>
            ))}
        </ul>
    );
}
