
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition } from "react";
import { collection, serverTimestamp, doc, writeBatch, increment } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useMemoFirebase, FirestorePermissionError, errorEmitter } from "@/firebase";
import type { Customer } from "@/docs/backend-types";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  customer_phone: z.string().min(10, "Please select a customer."),
  amount: z.coerce.number().positive("Amount must be positive."),
  item: z.string().optional(),
  type: z.enum(["credit", "payment"]),
});

type FormValues = z.infer<typeof formSchema>;

interface AddLedgerEntryFormProps {
  shopId: string;
  onFinished: () => void;
}

export default function AddLedgerEntryForm({ shopId, onFinished }: AddLedgerEntryFormProps) {
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
    defaultValues: {
      type: "credit",
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!customers) return;

    startTransition(async () => {
      const customer = customers.find(c => c.phone === values.customer_phone);
      if (!customer) {
        toast({ title: "Error", description: "Customer not found.", variant: "destructive" });
        return;
      }
      
      const batch = writeBatch(firestore);

      // 1. Create Ledger Entry
      const ledgerCollection = collection(firestore, "shops", shopId, "ledger");
      const newLedgerRef = doc(ledgerCollection);
      const ledgerData = {
          id: newLedgerRef.id,
          shop_id: shopId,
          customerPhone: values.customer_phone,
          customerName: customer.name,
          amount: values.amount,
          item: values.item,
          type: values.type,
          createdAt: serverTimestamp(),
          source: 'app',
      };
      batch.set(newLedgerRef, ledgerData);

      // 2. Update Customer Stats
      const customerRef = doc(firestore, "shops", shopId, "customers", values.customer_phone);
      const udhaarAmount = values.type === 'credit' ? values.amount : -values.amount;
      const updatedCustomerData: any = {
        visit_count: increment(1),
        total_spent: increment(values.amount),
        totalUdhaar: increment(udhaarAmount),
        last_visit: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      
      if (values.type === 'payment') {
          updatedCustomerData.lastPaymentDate = serverTimestamp();
          updatedCustomerData.reminderCount = 0;
      }

      batch.update(customerRef, updatedCustomerData);

      try {
        await batch.commit();
        toast({
            title: "Ledger Entry Added!",
            description: `A new transaction for ${customer.name} has been recorded.`,
        });
        onFinished();
      } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: `shops/${shopId}/ledger (batched write)`,
            operation: 'write',
            requestResourceData: { ledger: ledgerData, customerUpdate: updatedCustomerData },
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ title: "Error", description: "Could not save entry.", variant: "destructive" });
      }
    });
  };

  if (isLoadingCustomers) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /></div>
  }
  
  if (!customers || customers.length === 0) {
    return <p className="text-center text-muted-foreground p-8">Add a customer before recording a transaction.</p>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customer_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.phone} value={customer.phone}>{customer.name} ({customer.phone})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 250.50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Transaction Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="credit">Credit (Udhaar)</SelectItem>
                        <SelectItem value="payment">Payment (Jama)</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
         <FormField
          control={form.control}
          name="item"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item/Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Sugar, Milk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add Entry"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
