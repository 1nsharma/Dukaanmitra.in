
'use client';

import { useState } from 'react';
import { collection, query, orderBy, limit, where, type QueryConstraint } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Interaction } from '@/docs/backend-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, MessageSquare, AlertCircle, Bot, Zap } from 'lucide-react';
import { format } from 'date-fns';

export default function GlobalMessagesPage() {
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [shopFilter, setShopFilter] = useState('');

  const interactionsQuery = useMemoFirebase(() => {
    let base = collection(firestore, "interactions");
    const constraints: QueryConstraint[] = [orderBy("created_at", "desc"), limit(50)];
    
    if (shopFilter) {
        constraints.unshift(where("shop_id", "==", shopFilter.toUpperCase()));
    }
    
    return query(base, ...constraints);
  }, [firestore, shopFilter]);

  const { data: interactions, isLoading } = useCollection<Interaction>(interactionsQuery);

  const filteredInteractions = interactions?.filter(i => 
    i.raw_message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.sender_phone.includes(searchTerm)
  );

  const renderStatus = (status: string) => {
      switch(status) {
          case 'processed': return <Badge className="bg-green-500/20 text-green-400">Processed</Badge>;
          case 'failed': return <Badge variant="destructive">Failed</Badge>;
          case 'escalated': return <Badge variant="destructive" className="bg-orange-500/20 text-orange-300">Escalated</Badge>;
          default: return <Badge variant="secondary">{status}</Badge>;
      }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Message Explorer</h1>
        <div className="flex items-center gap-2">
            <Input 
                placeholder="Filter by Shop Code (e.g. SHP123)" 
                className="w-64 font-mono"
                value={shopFilter}
                onChange={(e) => setShopFilter(e.target.value)}
            />
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search messages or phone..." 
                    className="pl-9 w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Interactions</CardTitle>
          <CardDescription>Real-time stream of all WhatsApp messages across the platform.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8" /></div>
            ) : !filteredInteractions?.length ? (
                <div className="text-center py-12 text-muted-foreground">No messages found.</div>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Shop</TableHead>
                                <TableHead>Sender</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Intent</TableHead>
                                <TableHead>Path</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInteractions.map((msg) => (
                                <TableRow key={msg.interactionId} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                        {format(msg.created_at?.toDate?.() || new Date(), "HH:mm:ss, MMM d")}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs font-bold">{msg.shop_id || 'N/A'}</TableCell>
                                    <TableCell className="text-xs">{msg.sender_phone}</TableCell>
                                    <TableCell className="max-w-xs truncate text-sm italic">"{msg.raw_message}"</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[10px] uppercase">{msg.detected_intent || 'unknown'}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {msg.processing_path === 'deterministic' ? 
                                            <Badge variant="secondary" className="text-[10px]"><Zap size={10} className="mr-1"/> Logic</Badge> : 
                                            <Badge variant="outline" className="text-[10px] text-primary border-primary/30"><Bot size={10} className="mr-1"/> AI</Badge>
                                        }
                                    </TableCell>
                                    <TableCell>{renderStatus(msg.processing_status || 'received')}</TableCell>
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
