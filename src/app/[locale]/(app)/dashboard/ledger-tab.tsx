
"use client";

import { useState } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2, PlusCircle, Download, Bot, MessageSquare } from "lucide-react";
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

const renderEntryType = (type?: string) => {
    switch (type) {
      case 'credit': return <Badge variant="destructive">Credit</Badge>;
      case 'payment': return <Badge className="border-transparent bg-success text-success-foreground shadow hover:bg-success/80">Payment</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
}

const renderSourceBadge = (source?: string) => {
    switch (source) {
      case 'whatsapp': return <Badge variant="outline" className="border-green-500 text-green-500"><MessageSquare className="mr-1 h-3 w-3" /> WhatsApp</Badge>;
      case 'app-ai': return <Badge variant="outline" className="border-primary text-primary"><Bot className="mr-1 h-3 w-3" /> AI Quick Add</Badge>;
      case 'app': return <Badge variant="secondary">Manual</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
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

  const handleExport = () => {
    if (!ledgerEntries) return;
    const headers = ["ID", "Customer Name", "Customer Phone", "Item", "Amount (₹)", "Type", "Source", "Date"];
    const csvRows = ledgerEntries.map(entry => {
      const row = [
        entry.id,
        entry.customerName || 'N/A',
        entry.customerPhone,
        entry.item || 'N/A',
        entry.amount.toFixed(2),
        entry.type,
        entry.source || 'manual',
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
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>Transaction Ledger</CardTitle>
            <CardDescription>Manually manage your shop's transactions.</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" onClick={handleExport} disabled={!ledgerEntries || ledgerEntries.length === 0} className="w-full md:w-auto">
                <Download className="mr-2" />
                Export CSV
            </Button>
            <Dialog open={isAddEntryOpen} onOpenChange={setAddEntryOpen}>
                <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
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
          {isLoading && <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
          
          {!isLoading && !ledgerEntries?.length && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No transactions found.</p>
              <p>Use the AI Quick Add or "Add Manually" to record your first transaction.</p>
            </div>
          )}

          {!isLoading && ledgerEntries && ledgerEntries.length > 0 && (
            <>
              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {ledgerEntries.map((entry) => (
                  <Card key={entry.id} className="w-full">
                    <CardHeader>
                       <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{entry.customerName || entry.customerPhone}</CardTitle>
                            <CardDescription>{formatDate(entry.createdAt)}</CardDescription>
                          </div>
                          {renderEntryType(entry.type)}
                       </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-muted-foreground">{entry.item || 'Misc Transaction'}</span>
                         <span className="font-bold text-base">{`₹${entry.amount.toFixed(2)}`}</span>
                       </div>
                       <div className="flex justify-between items-center text-xs border-t pt-2 mt-2">
                          <span className="text-muted-foreground">Source</span>
                          {renderSourceBadge(entry.source)}
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
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Source</TableHead>
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
                        <TableCell>{renderSourceBadge(entry.source)}</TableCell>
                        <TableCell className="text-right font-bold">
                          {`₹${entry.amount.toFixed(2)}`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
