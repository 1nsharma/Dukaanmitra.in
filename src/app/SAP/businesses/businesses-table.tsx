
'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Shop } from '@/docs/backend-types';
import { Loader2, MoreHorizontal, Eye, Edit, Lock, Unlock, Ban } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { updateShopStatus } from '@/firebase/admin-actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
        case 'pro': return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Pro</Badge>;
        case 'basic': return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Basic</Badge>;
        case 'enterprise': return <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">Enterprise</Badge>;
        default: return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Free</Badge>;
    }
}

const renderStatusBadge = (status?: string) => {
    switch(status) {
        case 'active': return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>;
        case 'trial': return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Trial</Badge>;
        case 'suspended': return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Suspended</Badge>;
        case 'cancelled': return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Cancelled</Badge>;
        default: return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{status || 'N/A'}</Badge>;
    }
}

export default function BusinessesTable() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const shopsQuery = useMemoFirebase(() => {
        return query(collection(firestore, "shops"), orderBy("created_at", "desc"));
    }, [firestore]);

    const { data: shops, isLoading } = useCollection<Shop>(shopsQuery);
    
    const handleStatusChange = (shopId: string, currentStatus: Shop['status']) => {
        const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
        startTransition(async () => {
            try {
                await updateShopStatus(firestore, shopId, newStatus);
                toast({
                    title: 'Success',
                    description: `Business has been ${newStatus}.`,
                });
            } catch (error: any) {
                toast({
                    title: 'Error updating status',
                    description: error.message || 'An unexpected error occurred.',
                    variant: 'destructive'
                });
            }
        });
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin text-purple-400"/></div>
    }

    if (!shops || shops.length === 0) {
      return <p className="text-center text-purple-300 p-8">No businesses found.</p>
    }

    return (
        <div className="bg-slate-900/50 rounded-2xl border border-purple-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-purple-900/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Business</th>
                  <th className="text-left p-4 font-semibold">Owner</th>
                  <th className="text-left p-4 font-semibold">Plan</th>
                  <th className="text-left p-4 font-semibold">MRR</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Last Active</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shops.map((shop) => (
                  <tr key={shop.id} className="border-t border-purple-800/50 hover:bg-purple-900/20 transition">
                    <td className="p-4">
                      <div className="font-semibold">{shop.name}</div>
                      <div className="text-xs text-purple-300">{shop.city || 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{shop.owner_name || 'N/A'}</div>
                      <div className="text-xs text-purple-300">{shop.phone}</div>
                    </td>
                    <td className="p-4">{renderPlanBadge(shop.plan)}</td>
                    <td className="p-4 font-mono text-purple-300">₹{shop.mrr || 0}</td>
                    <td className="p-4">{renderStatusBadge(shop.status)}</td>
                    <td className="p-4 text-sm text-purple-300">{formatLastActive(shop.lastActive)}</td>
                    <td className="p-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-purple-700 data-[state=open]:bg-purple-600">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-purple-700 text-white">
                                <DropdownMenuLabel>Actions for {shop.name}</DropdownMenuLabel>
                                <DropdownMenuItem className="hover:bg-purple-800 focus:bg-purple-800"><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-purple-800 focus:bg-purple-800"><Edit className="mr-2 h-4 w-4" /> Edit Business</DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-purple-700"/>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                            className={cn("focus:bg-red-900/50 text-red-400 focus:text-red-300", shop.status !== 'suspended' && "focus:bg-yellow-900/50 text-yellow-400 focus:text-yellow-300" )}
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            {shop.status === 'suspended' ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                                            {shop.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-slate-900 border-purple-700">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-purple-300">
                                                This will {shop.status === 'suspended' ? 'reactivate the business and allow them to access the platform.' : 'suspend the business and block them from accessing the platform.'}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-transparent hover:bg-purple-800 border-purple-600">Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                                className={cn(shop.status === 'suspended' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700')}
                                                onClick={() => handleStatusChange(shop.id, shop.status)}
                                                disabled={isPending}
                                            >
                                                {isPending ? "Updating..." : `Yes, ${shop.status === 'suspended' ? 'Reactivate' : 'Suspend'}`}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
    );
}
