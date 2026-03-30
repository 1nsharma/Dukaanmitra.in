
'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { UserProfile } from '@/docs/backend-types';
import { Loader2, MoreHorizontal, UserCheck, Shield, UserX, Crown, Briefcase, UserPlus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { updateUserRole, updateUserStatus } from '@/firebase/admin-actions';
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';


const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return format(d, 'PPp');
};

const renderRoleBadge = (role: UserProfile['role']) => {
    switch(role) {
        case 'super_admin': return <Badge className="bg-primary text-primary-foreground hover:bg-primary/80"><Shield className="mr-1 h-3 w-3" />Super Admin</Badge>;
        case 'franchise_admin': return <Badge variant="secondary"><Crown className="mr-1 h-3 w-3" />Franchise Admin</Badge>;
        case 'owner': return <Badge variant="outline"><Briefcase className="mr-1 h-3 w-3" />Owner</Badge>;
        case 'staff': return <Badge variant="outline"><UserCheck className="mr-1 h-3 w-3" />Staff</Badge>;
        default: return <Badge variant="outline">{role}</Badge>;
    }
}

const renderStatusBadge = (status: string) => {
    switch(status) {
        case 'active': return <Badge className="bg-green-500/20 text-green-500 border-green-400">Active</Badge>;
        case 'suspended': return <Badge variant="destructive">Suspended</Badge>;
        case 'pending': return <Badge variant="secondary">Pending</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}

export default function UsersTable() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const { user: currentUser } = useUser();

    const usersQuery = useMemoFirebase(() => {
        return query(collection(firestore, "users"), orderBy("createdAt", "desc"));
    }, [firestore]);

    const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);
    
    const handleUpdateRole = (targetUid: string, newRole: UserProfile['role']) => {
        if (!currentUser?.role) return;
        const actorRole = currentUser.role as UserProfile['role'];
        startTransition(async () => {
            try {
                await updateUserRole(firestore, { id: currentUser.uid, role: actorRole }, targetUid, newRole);
                toast({
                    title: 'Success',
                    description: `User role has been updated to ${newRole}.`,
                });
            } catch (error: any) {
                console.error(error);
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to update user role.',
                    variant: 'destructive',
                });
            }
        });
    };
    
    const handleUpdateStatus = (targetUid: string, newStatus: UserProfile['status']) => {
        if (!currentUser?.role) return;
        const actorRole = currentUser.role as UserProfile['role'];
        startTransition(async () => {
            try {
                await updateUserStatus(firestore, { id: currentUser.uid, role: actorRole }, targetUid, newStatus);
                toast({
                    title: 'Success',
                    description: `User status has been updated to ${newStatus}.`,
                });
            } catch (error: any) {
                console.error(error);
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to update user status.',
                    variant: 'destructive',
                });
            }
        });
    };


    if (isLoading) {
        return <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin"/></div>
    }

    return (
        <>
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {users?.map(user => {
                    const isTargetProtected = user.role === 'super_admin' || currentUser?.uid === user.uid;
                    return (
                    <Card key={user.uid} className="w-full">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-base">{user.displayName || user.email}</CardTitle>
                                    <CardDescription>{user.email}</CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending || isTargetProtected}>
                                            <span className="sr-only">Open menu for {user.email}</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>User: {user.email}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                        {user.role === 'owner' && <DropdownMenuItem onClick={() => handleUpdateRole(user.uid, 'staff')} disabled={isPending}><UserX className="mr-2 h-4 w-4" /> Demote to Staff</DropdownMenuItem>}
                                        {user.role === 'staff' && <DropdownMenuItem onClick={() => handleUpdateRole(user.uid, 'owner')} disabled={isPending}><Briefcase className="mr-2 h-4 w-4" /> Promote to Owner</DropdownMenuItem>}
                                        {user.role === 'owner' && <DropdownMenuItem onClick={() => handleUpdateRole(user.uid, 'franchise_admin')} disabled={isPending}><Crown className="mr-2 h-4 w-4" /> Promote to Franchise Admin</DropdownMenuItem>}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                        {user.status === 'active' ? (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                                        <UserX className="mr-2 h-4 w-4" /> Suspend User
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>This will block the user from accessing their account.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleUpdateStatus(user.uid, 'suspended')} disabled={isPending}>Suspend</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        ) : (
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(user.uid, 'active')} disabled={isPending}><UserCheck className="mr-2 h-4 w-4" /> Reactivate User</DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Role</span>
                                {renderRoleBadge(user.role)}
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                {renderStatusBadge(user.status)}
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Login</span>
                                <span>{formatDate(user.lastLogin)}</span>
                            </div>
                        </CardContent>
                    </Card>
                )})}
            </div>
            
            {/* Desktop View */}
            <div className="hidden md:block border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Display Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map(user => {
                            const isTargetProtected = user.role === 'super_admin' || currentUser?.uid === user.uid;
                            return (
                            <TableRow key={user.uid}>
                                <TableCell className="font-medium">{user.email}</TableCell>
                                <TableCell>{user.displayName || 'N/A'}</TableCell>
                                <TableCell>{renderRoleBadge(user.role)}</TableCell>
                                <TableCell>{renderStatusBadge(user.status)}</TableCell>
                                <TableCell>{formatDate(user.lastLogin)}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending || isTargetProtected}>
                                                <span className="sr-only">Open menu for {user.email}</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>User: {user.email}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                            {user.role === 'owner' && <DropdownMenuItem onClick={() => handleUpdateRole(user.uid, 'staff')} disabled={isPending}><UserX className="mr-2 h-4 w-4" /> Demote to Staff</DropdownMenuItem>}
                                            {user.role === 'staff' && <DropdownMenuItem onClick={() => handleUpdateRole(user.uid, 'owner')} disabled={isPending}><Briefcase className="mr-2 h-4 w-4" /> Promote to Owner</DropdownMenuItem>}
                                            {user.role === 'owner' && <DropdownMenuItem onClick={() => handleUpdateRole(user.uid, 'franchise_admin')} disabled={isPending}><Crown className="mr-2 h-4 w-4" /> Promote to Franchise Admin</DropdownMenuItem>}

                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                            {user.status === 'active' ? (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                                            <UserX className="mr-2 h-4 w-4" /> Suspend User
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action will immediately block the user from accessing the application. Their account and data will be preserved, but they will not be able to log in.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className={buttonVariants({ variant: "destructive" })}
                                                                onClick={() => handleUpdateStatus(user.uid, 'suspended')}
                                                                disabled={isPending}
                                                            >
                                                                {isPending ? 'Suspending...' : 'Yes, Suspend User'}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            ) : (
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(user.uid, 'active')} disabled={isPending}>
                                                    <UserCheck className="mr-2 h-4 w-4" /> Reactivate User
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
