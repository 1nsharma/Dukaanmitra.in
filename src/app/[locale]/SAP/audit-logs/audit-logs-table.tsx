
'use client';

import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { AuditLog } from '@/docs/backend-types';
import { Loader2, FileClock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNowStrict } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNowStrict(d, { addSuffix: true });
};

const renderRoleBadge = (role: string) => {
    switch(role) {
        case 'super_admin': return <Badge className="bg-primary text-primary-foreground hover:bg-primary/80">Super Admin</Badge>;
        case 'franchise_admin': return <Badge variant="secondary">Franchise Admin</Badge>;
        case 'owner': return <Badge variant="outline">Owner</Badge>;
        case 'staff': return <Badge variant="outline">Staff</Badge>;
        default: return <Badge variant="outline">{role}</Badge>;
    }
}

export default function AuditLogsTable() {
    const firestore = useFirestore();

    const logsQuery = useMemoFirebase(() => {
        return query(
            collection(firestore, "auditLogs"), 
            orderBy("createdAt", "desc"),
            limit(50) // Limit to a reasonable number for performance
        );
    }, [firestore]);

    const { data: logs, isLoading } = useCollection<AuditLog>(logsQuery);

    if (isLoading) {
        return <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin"/></div>
    }

    if (!logs || logs.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-4">
            <FileClock className="w-12 h-12 text-muted-foreground/50" />
            <h3 className="font-semibold text-foreground">No Audit Activity Yet</h3>
            <p className="text-sm">Significant admin actions will appear here as they are performed.</p>
        </div>
      );
    }

    return (
        <>
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {logs.map(log => (
                    <Card key={log.id} className="w-full">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-base font-mono">{log.action}</CardTitle>
                                    <CardDescription>{formatDate(log.createdAt)}</CardDescription>
                                </div>
                                {renderRoleBadge(log.actorRole)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Actor ID</span>
                                <span className="font-mono text-xs">{log.actorId}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Target</span>
                                <span className="font-mono text-xs">{log.targetType}/{log.targetId}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            {/* Desktop View */}
            <div className="hidden md:block border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>Actor</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell className="font-mono font-medium">{log.action}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{log.actorId}</span>
                                        <span className="text-xs">{renderRoleBadge(log.actorRole)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                     <div className="flex flex-col font-mono text-xs">
                                        <span>{log.targetType}</span>
                                        <span className="text-muted-foreground">{log.targetId}</span>
                                     </div>
                                </TableCell>
                                <TableCell>{formatDate(log.createdAt)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
