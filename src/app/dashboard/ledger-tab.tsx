"use client";

import { useState } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2, PlusCircle, Download } from "lucide-react";
import { format, parseISO } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { LedgerEntry } from "@/docs/backend-types";
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
import AddLedgerEntryForm from "./add-ledger-entry-form";
import { Badge } from "@/components/ui/badge";
import QuickAddLedger from "./quick-add-ledger";

interface LedgerTabProps {
  shopId: string;
}

export default function LedgerTab({ shopId }: LedgerTabProps) {
  const firestore = useFirestore();
  const [isAddEntryOpen, setAddEntryOpen] = useState(false);

  const ledgerQuery = useMemoFirebase(() => {
    if (!shopId) return null;
    return query(
      collection(firestore, "shops", shopId, "ledger"),
      orderBy("createdAt", "desc")
    );
  }, [firestore, shopId]);

  const { data: ledgerEntries, isLoading } = useCollection<LedgerEntry>(ledgerQuery);
  
  const renderEntryType = (status?: string) => {
    switch (status) {
      case 'credit': return <Badge variant="destructive">Credit</Badge>;
      case 'payment': return <Badge className="border-transparent bg-success text-success-foreground shadow hover:bg-success/80">Payment</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (typeof date.toDate === 'function') {
      return format(date.toDate(), "PPp");
    }
    if (typeof date === 'string') {
        return format(parseISO(date), "PPp");
    }
    return 'Invalid Date';
  }

  const handleExport = () => {
    if (!ledgerEntries) return;
    const headers = ["ID", "Customer Name", "Customer Phone", "Item", "Amount (₹)", "Type", "Date"];
    const csvRows = ledgerEntries.map(entry => {
      const row = [
        entry.id,
        entry.customerName || 'N/A',
        entry.customerPhone,
        entry.item || 'N/A',
        entry.amount.toFixed(2),
        entry.type,
        formatDate(entry.createdAt)
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
    link.setAttribute("download", `dukaanmitra-ledger-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <QuickAddLedger shopId={shopId} onEntryAdded={() => {}} />

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transaction Ledger</CardTitle>
            <CardDescription>Manually manage your shop's transactions.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport} disabled={!ledgerEntries || ledgerEntries.length === 0}>
                <Download className="mr-2" />
                Export CSV
            </Button>
            <Dialog open={isAddEntryOpen} onOpenChange={setAddEntryOpen}>
                <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    Add Manually
                </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add a New Ledger Entry</DialogTitle>
                    <DialogDescription>
                    Record a new credit or payment transaction.
                    </DialogDescription>
                </DialogHeader>
                <AddLedgerEntryForm shopId={shopId} onFinished={() => setAddEntryOpen(false)} />
                </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <Loader2 className="mx-auto my-12 h-8 w-8 animate-spin text-primary" />}
          {!isLoading && !ledgerEntries?.length && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No transactions found.</p>
              <p>Use the AI Quick Add or "Add Manually" to record your first transaction.</p>
            </div>
          )}
          {!isLoading && ledgerEntries && ledgerEntries.length > 0 && (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.customerName || entry.customerPhone}</TableCell>
                      <TableCell>
                        {formatDate(entry.createdAt)}
                      </TableCell>
                      <TableCell>{renderEntryType(entry.type)}</TableCell>
                      <TableCell>{entry.item || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        {`₹${entry.amount.toFixed(2)}`}
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
