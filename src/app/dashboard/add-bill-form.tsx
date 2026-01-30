
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition, useEffect } from "react";
import { collection, serverTimestamp, doc, addDoc, getDocs, getDoc, updateDoc, query, where, Timestamp, writeBatch } from "firebase/firestore";

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
import { useFirestore, useCollection, useMemoFirebase, type WithId, FirestorePermissionError, errorEmitter } from "@/firebase";
import type { Customer } from "@/docs/backend-types";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  customer_id: z.string().min(1, "Please select a customer."),
  amount: z.coerce.number().positive("Amount must be positive."),
  payment_status: z.enum(["paid", "pending", "partial", "failed"]),
  payment_method: z.enum(["cash", "upi", "card", "credit"]),
});

type FormValues = z.infer<typeof formSchema>;

interface AddBillFormProps {
  shopId: string;
  onFinished: () => void;
}

export default function AddBillForm({ shopId, onFinished }: AddBillFormProps) {
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
      payment_status: "paid",
      payment_method: "cash",
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!customers) return;

    startTransition(async () => {
      const customer = customers.find(c => c.id === values.customer_id);
      if (!customer) {
        toast({ title: "Error", description: "Customer not found.", variant: "destructive" });
        return;
      }
      
      const billCollection = collection(firestore, "shops", shopId, "bills");
      const newBillRef = doc(billCollection);
      const customerRef = doc(firestore, "shops", shopId, "customers", values.customer_id);
      
      const billData = {
          id: newBillRef.id,
          shop_id: shopId,
          customer_id: values.customer_id,
          customer_name: customer.name, // Denormalized
          amount: values.amount,
          payment_status: values.payment_status,
          payment_method: values.payment_method,
          created_at: serverTimestamp(),
          source: 'app',
      };
      
      const updatedCustomerData = {
        visit_count: (customer.visit_count || 0) + 1,
        total_spent: (customer.total_spent || 0) + values.amount,
        last_visit: serverTimestamp(),
        updated_at: serverTimestamp(),
      };

      try {
        const batch = writeBatch(firestore);
        
        batch.set(newBillRef, billData);
        batch.update(customerRef, updatedCustomerData);

        await batch.commit();

        toast({
            title: "Bill Added!",
            description: `A new bill for ${customer.name} has been recorded.`,
        });
        onFinished();

      } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: `shops/${shopId}/bills (batched write)`,
            operation: 'write',
            requestResourceData: { bill: billData, customerUpdate: updatedCustomerData },
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ title: "Error", description: "Could not save bill and update customer stats.", variant: "destructive" });
      }
    });
  };

  if (isLoadingCustomers) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /></div>
  }
  
  if (!customers || customers.length === 0) {
    return <p className="text-center text-muted-foreground p-8">You need to add a customer before you can create a bill.</p>
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customer_id"
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
                    <SelectItem key={customer.id} value={customer.id}>{customer.name} ({customer.phone})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill Amount (₹)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="e.g., 250.50" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="payment_status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="credit">Credit</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending}>
                {isPending ? "Adding Bill..." : "Add Bill"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
