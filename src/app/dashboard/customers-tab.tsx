
"use client";

import { useState } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2, PlusCircle, Download, Users } from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { Customer } from "@/docs/backend-types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddCustomerForm from "./add-customer-form";
import { Badge } from "@/components/ui/badge";

interface CustomersTabProps {
  shopId: string;
}

export default function CustomersTab({ shopId }: CustomersTabProps) {
  const firestore = useFirestore();
  const [isAddCustomerOpen, setAddCustomerOpen] = useState(false);

  const queryRef = useMemoFirebase(() => {
    if (!shopId) return null;
    return query(collection(firestore, "shops", shopId, "customers"), orderBy("created_at", "desc"));
  }, [firestore, shopId]);

  const { data: customers, isLoading } = useCollection<Customer>(queryRef);

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    return format(date.toDate ? date.toDate() : new Date(date), "PPP");
  }

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Manage your shop's database.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <Dialog open={isAddCustomerOpen} onOpenChange={setAddCustomerOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Customer</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>New Customer</DialogTitle>
                <DialogDescription>Add a customer manually.</DialogDescription>
                </DialogHeader>
                <AddCustomerForm shopId={shopId} onFinished={() => setAddCustomerOpen(false)} />
            </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>}
        {!isLoading && customers?.length === 0 && <p className="text-center py-12 text-muted-foreground">No customers yet.</p>}
        {!isLoading && customers && customers.length > 0 && (
            <div className="border rounded-md">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total Udhaar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((c) => (
                    <TableRow key={c.phone}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.phone}</TableCell>
                        <TableCell><Badge variant="secondary">{c.status}</Badge></TableCell>
                        <TableCell className="text-right font-bold">₹{(c.totalUdhaar || 0).toFixed(2)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
