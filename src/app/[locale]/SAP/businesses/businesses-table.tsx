
'use client';

import { useState } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { Shop, UserProfile } from '@/docs/backend-types';
import { Loader2, MoreHorizontal, Eye, Edit, Lock, Unlock, AlertTriangle, ShieldCheck, ShieldAlert, Activity } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format, formatDistanceToNowStrict, isFuture, differenceInDays } from 'date-fns';
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
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import EditBusinessForm from './edit-business-form';

const formatDate = (date: any, isDistance = false) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    if (isDistance) {
        return formatDistanceToNowStrict(d, { addSuffix: true });
    }
    return format(d, 'dd MMM yyyy');
};

const renderPlanBadge = (plan?: string) => {
    switch(plan) {
        case 'pro': return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Pro</Badge>;
        case 'basic': return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Basic</Badge>;
        case 'enterprise': return <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">Enterprise</Badge>;
        default: return <Badge variant="secondary">Free</Badge>;
    }
}

const renderIntegrityBadge = (status?: string) => {
    switch(status) {
        case 'healthy': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1"><ShieldCheck size={10}/> Healthy</Badge>;
        case 'corrupted': return <Badge variant="destructive" className="flex items-center gap-1 animate-pulse"><ShieldAlert size={10}/> Corrupted</Badge>;
        default: return <Badge variant="outline" className="flex items-center gap-1 opacity-50"><Activity size={10}/> Pending</Badge>;
    }
}

const renderStatusBadge = (shop: Shop) => {
    if (shop.status === 'integrity_lock') {
        return <Badge variant="destructive" className="bg-red-500 text-white border-red-600 flex items-center gap-1">INTEGRITY LOCK</Badge>;
    }

    if (shop.status === 'trial' && shop.trial_ends_at) {
        const trialEndDate = shop.trial_ends_at.toDate ? shop.trial_ends_at.toDate() : new Date(shop.trial_ends_at);
        const daysLeft = differenceInDays(trialEndDate, new Date());
        if (isFuture(trialEndDate) && daysLeft <= 3) {
            return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 flex items-center gap-1.5"><AlertTriangle className="h-3 w-3"/>Trial Ends Soon</Badge>;
        }
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Trial</Badge>;
    }

    switch(shop.status) {
        case 'active': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
        case 'locked': return <Badge variant="destructive">Locked</Badge>;
        case 'suspended': return <Badge variant="destructive" className="bg-orange-500/20 text-orange-300 border-orange-500/30">Suspended</Badge>;
        case 'cancelled': return <Badge variant="secondary">Cancelled</Badge>;
        default: return <Badge variant="outline">{shop.status || 'N/A'}</Badge>;
    }
}

export default function BusinessesTable() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { user: currentUser } = useUser();
    const [isPending, startTransition] = useTransition();
    const [editingShop, setEditingShop] = useState<Shop | null>(null);
    const [shopToSuspend, setShopToSuspend] = useState<Shop | null>(null);

    const shopsQuery = useMemoFirebase(() => {
        return query(collection(firestore, "shops"), orderBy("created_at", "desc"));
    }, [firestore]);

    const { data: shops, isLoading } = useCollection<Shop>(shopsQuery);
    
    const handleStatusChange = () => {
        if (!currentUser?.role || !shopToSuspend) return;
        const actorRole = currentUser.role as UserProfile['role'];
        const newStatus = shopToSuspend.status === 'suspended' ? 'active' : 'suspended';
        startTransition(async () => {
            try {
                await updateShopStatus(firestore, { id: currentUser.uid, role: actorRole }, shopToSuspend.id, newStatus);
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
            } finally {
                setShopToSuspend(null);
            }
        });
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin text-primary"/></div>
    }

    if (!shops || shops.length === 0) {
      return <p className="text-center text-muted-foreground p-8">No businesses found.</p>
    }

    return (
        <>
        <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business / Owner</TableHead>
                  <TableHead>Integrity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>MRR</TableHead>
                  <TableHead>Last Verified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shops.map((shop) => (
                  <TableRow key={shop.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="font-semibold">{shop.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        {shop.id} {renderPlanBadge(shop.plan)}
                      </div>
                    </TableCell>
                    <TableCell>{renderIntegrityBadge((shop as any).integrityStatus)}</TableCell>
                    <TableCell>{renderStatusBadge(shop)}</TableCell>
                    <TableCell className="font-mono">₹{shop.mrr || 0}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate((shop as any).lastVerifiedAt, true)}
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions for {shop.name}</DropdownMenuLabel>
                                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Trace</DropdownMenuItem>
                                <DropdownMenuItem><ShieldCheck className="mr-2 h-4 w-4" /> Run Verify</DropdownMenuItem>
                                
                                <DropdownMenuItem onSelect={() => setEditingShop(shop)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Business
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    className={cn("focus:bg-destructive/10 text-destructive", shop.status === 'suspended' && "text-green-500 focus:text-green-600 focus:bg-green-500/10" )}
                                    onSelect={() => setShopToSuspend(shop)}
                                >
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

        <Dialog open={!!editingShop} onOpenChange={(isOpen) => !isOpen && setEditingShop(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit: {editingShop?.name}</DialogTitle>
                    <DialogDescription>
                        Modify the details for this business. Changes are saved live.
                    </DialogDescription>
                </DialogHeader>
                {editingShop && <EditBusinessForm shop={editingShop} onFinished={() => setEditingShop(null)} />}
            </DialogContent>
        </Dialog>
        
        <AlertDialog open={!!shopToSuspend} onOpenChange={(isOpen) => !isOpen && setShopToSuspend(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will {shopToSuspend?.status === 'suspended' ? 'reactivate this business and allow them to access the platform.' : 'suspend this business and block them from accessing the platform.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        className={cn(shopToSuspend?.status !== 'suspended' && "bg-destructive hover:bg-destructive/90")}
                        onClick={handleStatusChange}
                        disabled={isPending}
                    >
                        {isPending ? "Updating..." : `Yes, ${shopToSuspend?.status === 'suspended' ? 'Reactivate' : 'Suspend'}`}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
