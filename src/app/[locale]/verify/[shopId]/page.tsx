
'use client';

import { useParams } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, History, CheckCircle2, Lock, BadgeCheck, Globe } from "lucide-react";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { Shop } from '@/docs/backend-types';
import { Loader2 } from 'lucide-react';

export default function PublicVerificationPage() {
  const params = useParams();
  const shopId = params?.shopId as string;
  const firestore = useFirestore();

  const shopRef = useMemoFirebase(() => {
    if (!shopId) return null;
    return doc(firestore!, "shops", shopId);
  }, [firestore, shopId]);

  const { data: shop, isLoading } = useDoc<Shop>(shopRef);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary h-12 w-12" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full border-destructive/50">
          <CardHeader className="text-center">
            <ShieldAlert className="text-destructive h-12 w-12 mx-auto mb-4" />
            <CardTitle>Invalid Verification</CardTitle>
            <CardDescription>We could not find a registered business with ID: {shopId}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isHealthy = shop.integrityStatus === 'healthy';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-primary-foreground mx-auto shadow-xl shadow-primary/20 mb-6">
                <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black font-headline uppercase tracking-tighter">MitraOS Integrity Report</h1>
            <p className="text-muted-foreground italic font-medium">"Deterministic Proof of Financial Sovereignty"</p>
        </div>

        <Card className={`border-2 ${isHealthy ? 'border-success/50 shadow-lg shadow-success/10' : 'border-destructive/50'}`}>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className={`p-3 rounded-2xl ${isHealthy ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                {isHealthy ? <BadgeCheck size={32}/> : <Lock size={32}/>}
            </div>
            <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">{shop.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                    <Badge variant={isHealthy ? "default" : "destructive"}>
                        {isHealthy ? 'CRYPTOGRAPHICALLY VERIFIED' : 'INTEGRITY LOCK'}
                    </Badge>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">ID: {shop.id}</span>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 border-t border-dashed">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ledger State</p>
                    <p className="font-black text-lg flex items-center gap-2">
                        {isHealthy ? <CheckCircle2 className="text-success h-5 w-5" /> : <ShieldAlert className="text-destructive h-5 w-5" />}
                        {isHealthy ? 'Healthy' : 'Compromised'}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Last Verified</p>
                    <p className="font-black text-lg">{format(shop.lastVerifiedAt?.toDate?.() || new Date(), "HH:mm, PP")}</p>
                </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Root Hash (SHA-256)</span>
                    <History size={12}/>
                </div>
                <p className="font-mono text-xs break-all leading-relaxed p-3 bg-background rounded-lg border">
                    {shop.ledgerRootHash || 'NO_ENTRIES_RECORDED'}
                </p>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                <span className="flex items-center gap-1.5"><Globe size={12}/> Indian Sovereign Infra</span>
                <span className="flex items-center gap-1.5"><Lock size={12}/> End-to-End Encrypted</span>
            </div>
          </CardContent>
        </Card>

        <div className="text-center max-w-sm mx-auto">
            <p className="text-xs text-muted-foreground leading-relaxed">
                This business uses <strong>MitraOS Stage-5 Architecture</strong>. Every ledger entry is cryptographically chained to prevent manual tampering or silent deletion.
            </p>
        </div>
      </div>
    </div>
  );
}
