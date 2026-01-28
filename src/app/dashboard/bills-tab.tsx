"use client";

import { useState } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2, PlusCircle } from "lucide-react";
import { format, parseISO } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { Bill } from "@/docs/backend-types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddBillForm from "./add-bill-form";
import { Badge } from "@/components/ui/badge";

interface BillsTabProps {
  shopId: string;
}

export default function BillsTab({ shopId }: BillsTabProps) {
  const firestore = useFirestore();
  const [isAddBillOpen, setAddBillOpen] = useState(false);

  const billsQuery = useMemoFirebase(() => {
    if (!shopId) return null;
    return query(
      collection(firestore, "shops", shopId, "bills"),
      orderBy("created_at", "desc")
    );
  }, [firestore, shopId]);

  const { data: bills, isLoading } = useCollection<Bill>(billsQuery);
  
  const renderPaymentStatus = (status?: string) => {
    switch (status) {
      case 'paid': return <Badge className="border-transparent bg-success text-success-foreground shadow hover:bg-success/80">Paid</Badge>;
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'partial': return <Badge className="border-transparent bg-warning text-warning-foreground shadow hover:bg-warning/80">Partial</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (typeof date.toDate === 'function') {
      return format(date.toDate(), "PPp");
    }
    return format(parseISO(date as string), "PPp");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Bills</CardTitle>
          <CardDescription>Manage your shop's bills and transactions.</CardDescription>
        </div>
        <Dialog open={isAddBillOpen} onOpenChange={setAddBillOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Add Bill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add a New Bill</DialogTitle>
              <DialogDescription>
                Record a new transaction for a customer.
              </DialogDescription>
            </DialogHeader>
            <AddBillForm shopId={shopId} onFinished={() => setAddBillOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading && <Loader2 className="mx-auto my-12 h-8 w-8 animate-spin text-primary" />}
        {!isLoading && !bills?.length && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No bills found.</p>
            <p>Click "Add Bill" to record your first transaction.</p>
          </div>
        )}
        {!isLoading && bills && bills.length > 0 && (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.customer_name || 'N/A'}</TableCell>
                    <TableCell>
                      {formatDate(bill.created_at)}
                    </TableCell>
                    <TableCell>{renderPaymentStatus(bill.payment_status)}</TableCell>
                    <TableCell className="text-right">
                      {`₹${bill.amount.toFixed(2)}`}
                    </TableCell>
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
