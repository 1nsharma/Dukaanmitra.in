"use client";

import { useState } from "react";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Loader2, PlusCircle, IndianRupee, MessageSquare, Zap } from "lucide-react";
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
    return query(collection(firestore, "shops", shopId, "ledger"), orderBy("createdAt", "desc"), limit(20));
  }, [firestore, shopId]);

  const { data: entries, isLoading } = useCollection<LedgerEntry>(queryRef);

  return (
    <div className="space-y-6">
      <QuickAddLedger shopId={shopId} onEntryAdded={() => {}} />
      
      <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-card">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Recent Transactions</CardTitle>
            <CardDescription className="text-xs">Hisaab-Kitaab records.</CardDescription>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Dialog open={isAddEntryOpen} onOpenChange={setAddEntryOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold uppercase text-[10px] tracking-widest"><PlusCircle className="mr-2 h-4 w-4" /> Manual Add</Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl uppercase">New Entry</DialogTitle>
                        <DialogDescription className="text-sm">Record a credit or payment.</DialogDescription>
                    </DialogHeader>
                    <AddLedgerEntryForm shopId={shopId} onFinished={() => setAddEntryOpen(false)} />
                </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>}
          
          {!isLoading && entries && entries.length > 0 && (
            <div className="space-y-3">
                {entries.map((e) => (
                    <div key={e.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${e.type === 'credit' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
                                {e.type === 'credit' ? <TrendingDown size={16}/> : <IndianRupee size={16}/>}
                            </div>
                            <div>
                                <p className="text-sm font-bold">{e.customerName || e.customerPhone}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{format(e.createdAt?.toDate?.() || new Date(), "HH:mm, PP")}</span>
                                    {e.source === 'whatsapp' && <Badge variant="outline" className="text-[8px] font-black uppercase h-4 px-1 border-primary/20 text-primary"><MessageSquare size={8} className="mr-1"/> WA</Badge>}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-lg font-black tracking-tighter ${e.type === 'credit' ? 'text-destructive' : 'text-success'}`}>
                                {e.type === 'credit' ? '-' : '+'}₹{e.amount.toLocaleString('en-IN')}
                            </p>
                            <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">{e.type}</span>
                        </div>
                    </div>
                ))}
            </div>
          )}

          {!isLoading && (!entries || entries.length === 0) && (
            <div className="text-center py-12 space-y-4">
                <Zap size={48} className="mx-auto text-muted-foreground/20" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No entries yet</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">Use the AI Quick Add above to start your Digital Munim.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const TrendingDown = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m23 18-9.49-9.49-4.6 4.6L1 5"/><path d="M17 18h6v-6"/></svg>
);