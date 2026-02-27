
"use client";

import { useState } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2, PlusCircle, IndianRupee } from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { LedgerEntry } from "@/docs/backend-types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddLedgerEntryForm from "./add-ledger-entry-form";
import { Badge } from "@/components/ui/badge";
import QuickAddLedger from "./quick-add-ledger";

interface LedgerTabProps {
  shopId: string;
}

export default function LedgerTab({ shopId }: LedgerTabProps) {
  const firestore = useFirestore();
  const [isAddEntryOpen, setAddEntryOpen] = useState(false);

  const queryRef = useMemoFirebase(() => {
    if (!shopId) return null;
    return query(collection(firestore, "shops", shopId, "ledger"), orderBy("createdAt", "desc"));
  }, [firestore, shopId]);

  const { data: entries, isLoading } = useCollection<LedgerEntry>(queryRef);

  return (
    <div className="space-y-6">
      <QuickAddLedger shopId={shopId} onEntryAdded={() => {}} />
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>Transaction Ledger</CardTitle>
            <CardDescription>Complete transaction history.</CardDescription>
          </div>
          <Dialog open={isAddEntryOpen} onOpenChange={setAddEntryOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Manually</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Ledger Entry</DialogTitle>
                    <DialogDescription>Record a transaction.</DialogDescription>
                </DialogHeader>
                <AddLedgerEntryForm shopId={shopId} onFinished={() => setAddEntryOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>}
          {!isLoading && entries && entries.length > 0 && (
            <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell>{e.customerName || e.customerPhone}</TableCell>
                        <TableCell>{format(e.createdAt?.toDate?.() || new Date(), "PP")}</TableCell>
                        <TableCell>
                            <Badge variant={e.type === 'credit' ? 'destructive' : 'secondary'}>{e.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold">₹{e.amount.toFixed(2)}</TableCell>
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
