"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { collection, serverTimestamp, doc, getDoc, writeBatch, increment } from "firebase/firestore";
import { Bot, Loader2, Sparkles, Zap } from "lucide-react";

import { useFirestore, FirestorePermissionError, errorEmitter } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseTransaction } from "@/ai/flows/transaction-parser-flow";

const formSchema = z.object({
  query: z.string().min(3, "Please enter a transaction."),
});

export default function QuickAddLedger({ shopId, onEntryAdded }: { shopId: string, onEntryAdded: () => void }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const firestore = useFirestore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { query: "" },
  });

  const onSubmit = (values: any) => {
    startTransition(async () => {
      try {
        const parsed = await parseTransaction({ query: values.query });
        if (parsed.confidence_score < 0.7) {
            toast({ title: "Low Confidence", description: "AI wasn't sure. Re-type clearly.", variant: "destructive" });
            return;
        }

        const batch = writeBatch(firestore!);
        const customerRef = doc(collection(firestore!, "shops", shopId, "customers"), parsed.phone || 'generic');
        const customerDoc = await getDoc(customerRef);

        const udhaar = parsed.type === 'credit' ? parsed.amount : -parsed.amount;

        if (!customerDoc.exists()) {
            if (!parsed.phone) {
                toast({ title: "Phone Required", description: "Please add customer phone number for first time.", variant: "destructive" });
                return;
            }
            batch.set(customerRef, {
                phone: parsed.phone, name: parsed.customer_name, shop_id: shopId,
                totalUdhaar: udhaar, total_spent: parsed.amount, visit_count: 1,
                status: 'new', created_at: serverTimestamp(), updated_at: serverTimestamp()
            });
        } else {
            batch.update(customerRef, {
                totalUdhaar: increment(udhaar), total_spent: increment(parsed.amount),
                visit_count: increment(1), updated_at: serverTimestamp()
            });
        }

        const ledgerRef = doc(collection(firestore!, "shops", shopId, "ledger"));
        batch.set(ledgerRef, {
            id: ledgerRef.id, shop_id: shopId, customerPhone: parsed.phone || 'N/A', customerName: parsed.customer_name,
            amount: parsed.amount, item: parsed.items, type: parsed.type, createdAt: serverTimestamp(), source: 'app-ai'
        });

        await batch.commit();
        toast({ title: "AI Entry Record Ho Gayi!", description: `₹${parsed.amount} added for ${parsed.customer_name}.` });
        form.reset();
        onEntryAdded();
      } catch (e) {
        toast({ title: "Error", description: "Failed to parse. Try manual add.", variant: "destructive" });
      }
    });
  };

  return (
    <Card className="rounded-[2.5rem] border-none shadow-medium bg-gradient-to-br from-primary/10 via-card to-background overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={100} className="text-primary" />
        </div>
        <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-primary rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
                    <Bot size={20} />
                </div>
                <div>
                    <CardTitle className="text-lg font-black uppercase tracking-tighter">AI Quick Add</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type like WhatsApp: "Ravi 500 udhaar"</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                    <FormField control={form.control} name="query" render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input 
                                    placeholder="e.g. 9876 Ravi 150 udhaar" 
                                    className="h-14 text-lg rounded-2xl border-none bg-background/80 focus-visible:ring-primary shadow-inner" 
                                    {...field} 
                                    disabled={isPending} 
                                />
                            </FormControl>
                        </FormItem>
                    )} />
                    <Button type="submit" className="h-14 w-14 rounded-2xl shadow-lg" disabled={isPending}>
                        {isPending ? <Loader2 className="animate-spin" /> : <Zap fill="currentColor" />}
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}