
"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { collection, serverTimestamp, doc, addDoc, getDocs, updateDoc, query, where, writeBatch } from "firebase/firestore";
import { Bot, Loader2 } from "lucide-react";

import { useFirestore, useCollection, useMemoFirebase, type WithId, FirestorePermissionError, errorEmitter } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseTransaction } from "@/ai/flows/transaction-parser-flow";
import type { Customer } from "@/docs/backend-types";

const formSchema = z.object({
  query: z.string().min(3, "Please enter a transaction, e.g., 'Rohan 50 udhaar'"),
});

type FormValues = z.infer<typeof formSchema>;

interface QuickAddBillProps {
  shopId: string;
  onBillAdded: () => void;
}

export default function QuickAddBill({ shopId, onBillAdded }: QuickAddBillProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const firestore = useFirestore();

  const customersQuery = useMemoFirebase(() => {
    if (!shopId) return null;
    return collection(firestore, "shops", shopId, "customers");
  }, [firestore, shopId]);
  const { data: customers, isLoading: isLoadingCustomers } = useCollection<Customer>(customersQuery);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: "" },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        // 1. Parse the natural language query
        const parsed = await parseTransaction({ query: values.query });
        
        if (parsed.confidence_score < 0.7) {
            toast({
                title: "Low Confidence",
                description: "The AI wasn't sure about that. Please try rephrasing or add the bill manually.",
                variant: "destructive"
            });
            return;
        }

        let customerId: string | null = null;
        let customerName: string = parsed.customer_name;
        let targetCustomer: WithId<Customer> | null = null;

        // 2. Find the customer
        if (customers && customerName.toLowerCase() !== 'customer') {
            const potentialMatches = customers.filter(c => c.name?.toLowerCase() === customerName.toLowerCase());
            if (potentialMatches.length === 1) {
                targetCustomer = potentialMatches[0];
                customerId = targetCustomer.id;
                customerName = targetCustomer.name!;
            } else if (potentialMatches.length > 1) {
                toast({
                    title: "Multiple Customers Found",
                    description: `Found multiple customers named '${customerName}'. Please add the bill manually to select the correct one.`,
                    variant: "destructive"
                });
                return;
            }
        }
        
        // 3. Create a batch for atomic write
        const batch = writeBatch(firestore);
        const billCollection = collection(firestore, "shops", shopId, "bills");
        const newBillRef = doc(billCollection);
        
        const billData = {
            id: newBillRef.id,
            shop_id: shopId,
            customer_id: customerId,
            customer_name: customerName,
            amount: parsed.amount,
            payment_status: parsed.type === 'CREDIT' ? 'pending' : 'paid',
            payment_method: parsed.type === 'PAYMENT' ? 'cash' : 'credit',
            items: [{ name: parsed.items, quantity: 1, price: parsed.amount }],
            created_at: serverTimestamp(),
            source: 'app-ai',
        };

        batch.set(newBillRef, billData);

        // 4. Update customer stats if a unique customer was found
        if (targetCustomer && customerId) {
            const customerRef = doc(firestore, "shops", shopId, "customers", customerId);
            const updatedCustomerData = {
              visit_count: (targetCustomer.visit_count || 0) + 1,
              total_spent: (targetCustomer.total_spent || 0) + parsed.amount,
              last_visit: serverTimestamp(),
              updated_at: serverTimestamp(),
            };
            batch.update(customerRef, updatedCustomerData);
        }

        // 5. Commit the batch
        await batch.commit();

        toast({
          title: "AI Bill Added!",
          description: `A new bill for ${customerName} for ₹${parsed.amount} has been recorded.`,
        });

        form.reset();
        onBillAdded();

      } catch (error: any) {
        console.error("Error with AI bill add: ", error);
        // Check if it's likely a Firestore error before emitting
        if (error.code) {
             const permissionError = new FirestorePermissionError({
                path: `shops/${shopId}/bills (batched AI write)`,
                operation: 'write',
                requestResourceData: { query: values.query }
            });
            errorEmitter.emit('permission-error', permissionError);
        }
        toast({
          title: "Error",
          description: error.message || "Failed to add bill with AI. Please try again.",
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
                Type a transaction in plain English or Hinglish, and let our AI handle the rest. Try "Ravi 150 udhaar" or "Sunita paid 500".
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
                            <Input placeholder="Enter transaction..." {...field} disabled={isPending || isLoadingCustomers} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isPending || isLoadingCustomers}>
                        {isPending ? <Loader2 className="animate-spin" /> : "Add"}
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
