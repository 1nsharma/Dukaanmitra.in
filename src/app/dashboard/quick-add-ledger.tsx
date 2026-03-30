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

const formSchema = z.object({
  query: z.string().min(3, "Please enter a transaction, e.g., '98... Ravi 500 udhaar'"),
});

type FormValues = z.infer<typeof formSchema>;

interface QuickAddLedgerProps {
  shopId: string;
  onEntryAdded: () => void;
}

export default function QuickAddLedger({ shopId, onEntryAdded }: QuickAddLedgerProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: "" },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        // 1. Parse the natural language query
        const parseResponse = await fetch('/api/parse-transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: values.query }),
        });

        if (!parseResponse.ok) {
          throw new Error('Failed to parse transaction');
        }

        const parsed = await parseResponse.json() as {
          phone?: string;
          customer_name: string;
          amount: number;
          items: string;
          type: 'credit' | 'payment';
          confidence_score: number;
        };
        
        if (parsed.confidence_score < 0.7) {
            toast({
                title: "Low Confidence",
                description: "The AI wasn't sure about that. Please try rephrasing or add the entry manually.",
                variant: "destructive"
            });
            return;
        }

        if (!parsed.phone && parsed.customer_name.toLowerCase() === 'customer') {
            toast({
                title: "Customer Not Found",
                description: "Please include the customer's name or 10-digit phone number in the query.",
                variant: "destructive"
            });
            return;
        }

        const batch = writeBatch(firestore);
        
        // 2. Determine Customer and Prepare updates
        const customersCollection = collection(firestore, "shops", shopId, "customers");
        const customerRef = doc(customersCollection, parsed.phone || parsed.customer_name.toLowerCase().replace(/ /g,'-'));
        const customerDoc = await getDoc(customerRef);

        const udhaarAmount = parsed.type === 'credit' ? parsed.amount : -parsed.amount;

        if (!customerDoc.exists()) {
            if (!parsed.phone) {
                 toast({
                    title: "Phone Number Required",
                    description: `To create a new customer '${parsed.customer_name}', please include their 10-digit phone number.`,
                    variant: "destructive"
                });
                return;
            }
            // Case 1: NEW CUSTOMER
            const newCustomerData = {
                phone: parsed.phone,
                name: parsed.customer_name,
                shop_id: shopId,
                totalUdhaar: udhaarAmount,
                total_spent: parsed.amount,
                visit_count: 1,
                status: 'new',
                first_visit: serverTimestamp(),
                last_visit: serverTimestamp(),
                lastPaymentDate: parsed.type === 'payment' ? serverTimestamp() : null,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
                reminderCount: 0,
            };
            batch.set(customerRef, newCustomerData);
        } else {
            // Case 2: EXISTING CUSTOMER
            const updatedCustomerData: any = {
                totalUdhaar: increment(udhaarAmount),
                total_spent: increment(parsed.amount),
                visit_count: increment(1),
                last_visit: serverTimestamp(),
                updated_at: serverTimestamp(),
            };

            if (parsed.type === 'payment') {
                updatedCustomerData.lastPaymentDate = serverTimestamp();
                updatedCustomerData.reminderCount = 0; // Reset on payment
            }

            batch.update(customerRef, updatedCustomerData);
        }

        // 3. Create Ledger Entry
        const ledgerCollection = collection(firestore, "shops", shopId, "ledger");
        const newLedgerRef = doc(ledgerCollection);
        const ledgerData = {
            id: newLedgerRef.id,
            shop_id: shopId,
            customerPhone: parsed.phone || customerDoc.data()?.phone,
            customerName: parsed.customer_name,
            amount: parsed.amount,
            item: parsed.items,
            type: parsed.type,
            createdAt: serverTimestamp(),
            source: 'app-ai',
        };
        batch.set(newLedgerRef, ledgerData);

        // 4. Commit the batch
        await batch.commit();

        toast({
          title: "AI Entry Added!",
          description: `Transaction for ${parsed.customer_name} for ₹${parsed.amount} has been recorded.`,
        });

        form.reset();
        onEntryAdded();

      } catch (error: any) {
        console.error("Error with AI ledger add: ", error);
        if (error.code) { // Check if it's a Firestore error
             const permissionError = new FirestorePermissionError({
                path: `shops/${shopId}/ (batched AI write)`,
                operation: 'write',
                requestResourceData: { query: values.query }
            });
            errorEmitter.emit('permission-error', permissionError);
        }
        toast({
          title: "Error",
          description: error.message || "Failed to add ledger entry with AI. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card className="mb-6 bg-gradient-to-br from-primary/10 via-card to-primary/5 border-primary/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bot className="text-primary"/>
                Quick Add with AI
            </CardTitle>
            <CardDescription>
                Type a transaction in plain English or Hinglish. Try "9876543210 Ravi 150 udhaar" or "Sunita paid 500".
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
                    <FormField
                      control={form.control}
                      name="query"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Enter transaction..." {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <Loader2 className="animate-spin" /> : "Add"}
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
