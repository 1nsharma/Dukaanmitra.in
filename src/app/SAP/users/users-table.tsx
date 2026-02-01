'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { UserProfile } from '@/docs/backend-types';
import { Loader2, MoreHorizontal, UserCheck, Shield, UserX } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { updateUserRole, updateUserStatus } from '@/firebase/admin-actions';


export default function UsersTable() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const usersQuery = useMemoFirebase(() => {
        return query(collection(firestore, "users"), orderBy("createdAt", "desc"));
    }, [firestore]);

    const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);
    
    const formatDate = (date: any) => {
        if (!date) return 'N/A';
        const d = date.toDate ? date.toDate() : new Date(date);
        return format(d, 'PPp');
    };
    
    const renderRoleBadge = (role: string) => {
        switch(role) {
            case 'super_admin': return <Badge className="bg-primary text-primary-foreground hover:bg-primary/80">Super Admin</Badge>;
            case 'admin': return <Badge variant="secondary">Admin</Badge>;
            default: return <Badge variant="outline">User</Badge>;
        }
    }
    
    const renderStatusBadge = (status: string) => {
        switch(status) {
            case 'active': return <Badge className="bg-green-500/20 text-green-300 border-green-400">Active</Badge>;
            case 'suspended': return <Badge variant="destructive">Suspended</Badge>;
            case 'pending': return <Badge variant="secondary">Pending</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    }

    const handleUpdateRole = (uid: string, newRole: UserProfile['role']) => {
        startTransition(async () => {
            try {
                await updateUserRole(firestore, uid, newRole);
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
    
    const handleUpdateStatus = (uid: string, newStatus: UserProfile['status']) => {
        startTransition(async () => {
            try {
                await updateUserStatus(firestore, uid, newStatus);
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
        <div className="border rounded-md">
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
                    {users?.map(user => (
                        <TableRow key={user.uid}>
                            <TableCell className="font-medium">{user.email}</TableCell>
                            <TableCell>{user.displayName || 'N/A'}</TableCell>
                            <TableCell>{renderRoleBadge(user.role)}</TableCell>
                            <TableCell>{renderStatusBadge(user.status)}</TableCell>
                            <TableCell>{formatDate(user.lastLogin)}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>User: {user.email}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleUpdateRole(user.uid, 'admin')} disabled={isPending || user.role === 'admin'}>
                                            <UserCheck className="mr-2 h-4 w-4" /> Promote to Admin
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleUpdateRole(user.uid, 'user')} disabled={isPending || user.role === 'user'}>
                                            <UserX className="mr-2 h-4 w-4" /> Demote to User
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleUpdateRole(user.uid, 'super_admin')} disabled={isPending || user.role === 'super_admin'}>
                                            <Shield className="mr-2 h-4 w-4" /> Make Super Admin
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                        {user.status === 'active' ? (
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(user.uid, 'suspended')} disabled={isPending} className="text-destructive">
                                                <UserX className="mr-2 h-4 w-4" /> Suspend User
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(user.uid, 'active')} disabled={isPending}>
                                                <UserCheck className="mr-2 h-4 w-4" /> Reactivate User
                                            </DropdownMenuItem>
                                        )}
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
