"use client";

import { useState } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2, PlusCircle, Download } from "lucide-react";
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
import QuickAddBill from "./quick-add-bill";

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

  const handleExport = () => {
    if (!bills) return;
    const headers = ["ID", "Customer Name", "Amount (₹)", "Payment Status", "Payment Method", "Date"];
    const csvRows = bills.map(bill => {
      const row = [
        bill.id,
        bill.customer_name || 'N/A',
        bill.amount.toFixed(2),
        bill.payment_status || 'N/A',
        bill.payment_method || 'N/A',
        formatDate(bill.created_at)
      ];
      return row.map(value => {
          const strValue = String(value ?? '');
          if (/[",\n\r]/.test(strValue)) {
            return `"${strValue.replace(/"/g, '""')}"`;
          }
          return strValue;
      }).join(',');
    });
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `dukaanmitra-bills-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <QuickAddBill shopId={shopId} onBillAdded={() => {}} />

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Bills</CardTitle>
            <CardDescription>Manually manage your shop's bills and transactions.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport} disabled={!bills || bills.length === 0}>
                <Download className="mr-2" />
                Export CSV
            </Button>
            <Dialog open={isAddBillOpen} onOpenChange={setAddBillOpen}>
                <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    Add Manually
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
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <Loader2 className="mx-auto my-12 h-8 w-8 animate-spin text-primary" />}
          {!isLoading && !bills?.length && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No bills found.</p>
              <p>Use the AI Quick Add or "Add Manually" to record your first transaction.</p>
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
    </div>
  );
}
