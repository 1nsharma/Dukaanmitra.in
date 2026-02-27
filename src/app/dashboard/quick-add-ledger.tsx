
"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { collection, serverTimestamp, doc, getDoc, writeBatch, increment } from "firebase/firestore";
import { Bot, Loader2 } from "lucide-react";

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
            toast({ title: "Low Confidence", description: "AI wasn't sure. Add manually.", variant: "destructive" });
            return;
        }

        const batch = writeBatch(firestore);
        const customerRef = doc(collection(firestore, "shops", shopId, "customers"), parsed.phone || 'generic');
        const customerDoc = await getDoc(customerRef);

        const udhaar = parsed.type === 'credit' ? parsed.amount : -parsed.amount;

        if (!customerDoc.exists()) {
            if (!parsed.phone) {
                toast({ title: "Error", description: "Phone number required for new customers.", variant: "destructive" });
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

        const ledgerRef = doc(collection(firestore, "shops", shopId, "ledger"));
        batch.set(ledgerRef, {
            id: ledgerRef.id, shop_id: shopId, customerPhone: parsed.phone, customerName: parsed.customer_name,
            amount: parsed.amount, item: parsed.items, type: parsed.type, createdAt: serverTimestamp(), source: 'app-ai'
        });

        await batch.commit();
        toast({ title: "AI Entry Added!" });
        form.reset();
        onEntryAdded();
      } catch (e) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot className="text-primary h-5 w-5"/> AI Quick Add</CardTitle>
            <CardDescription>Try "9876543210 Ravi 150 udhaar"</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                    <FormField control={form.control} name="query" render={({ field }) => (
                        <FormItem className="flex-1"><FormControl><Input placeholder="Type transaction..." {...field} disabled={isPending} /></FormControl></FormItem>
                    )} />
                    <Button type="submit" disabled={isPending}>{isPending ? <Loader2 className="animate-spin" /> : "Add"}</Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
