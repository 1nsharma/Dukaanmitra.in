'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Shop } from '@/docs/backend-types';
import { Loader2, MoreHorizontal, Eye, Edit, Lock, Unlock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format, formatDistanceToNowStrict } from 'date-fns';

const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return format(d, 'PP');
};

const formatLastActive = (date: any) => {
    if (!date) return 'Never';
    const d = date.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNowStrict(d, { addSuffix: true });
};

const renderPlanBadge = (plan?: string) => {
    switch(plan) {
        case 'pro': return <Badge className="bg-primary/20 text-primary border-primary/40">Pro</Badge>;
        case 'basic': return <Badge variant="secondary">Basic</Badge>;
        case 'enterprise': return <Badge variant="default">Enterprise</Badge>;
        default: return <Badge variant="outline">Free</Badge>;
    }
}

const renderStatusBadge = (status?: string) => {
    switch(status) {
        case 'active': return <Badge className="bg-green-500/20 text-green-500 border-green-400">Active</Badge>;
        case 'trial': return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-400">Trial</Badge>;
        case 'suspended': return <Badge variant="destructive">Suspended</Badge>;
        default: return <Badge variant="outline">{status || 'N/A'}</Badge>;
    }
}

export default function BusinessesTable() {
    const firestore = useFirestore();

    const shopsQuery = useMemoFirebase(() => {
        return query(collection(firestore, "shops"), orderBy("created_at", "desc"));
    }, [firestore]);

    const { data: shops, isLoading } = useCollection<Shop>(shopsQuery);
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin"/></div>
    }

    if (!shops || shops.length === 0) {
      return <p className="text-center text-muted-foreground p-8">No businesses found.</p>
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Business</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>MRR</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {shops.map(shop => (
                        <TableRow key={shop.id}>
                            <TableCell>
                                <div className="font-medium">{shop.name}</div>
                                <div className="text-xs text-muted-foreground">{shop.city || 'N/A'}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{shop.owner_name || 'N/A'}</div>
                                <div className="text-xs text-muted-foreground">{shop.phone}</div>
                            </TableCell>
                            <TableCell>{renderPlanBadge(shop.plan)}</TableCell>
                            <TableCell className="font-mono">₹{shop.mrr || 0}</TableCell>
                            <TableCell>{renderStatusBadge(shop.status)}</TableCell>
                            <TableCell>{formatLastActive(shop.lastActive)}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit Business</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">
                                            {shop.status === 'suspended' ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                                            {shop.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
