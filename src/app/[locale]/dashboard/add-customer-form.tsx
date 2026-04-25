
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition } from "react";
import { collection, serverTimestamp, doc, setDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, FirestorePermissionError, errorEmitter } from "@/firebase";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number."),
});

type FormValues = z.infer<typeof formSchema>;

interface AddCustomerFormProps {
  shopId: string;
  onFinished: () => void;
}

export default function AddCustomerForm({ shopId, onFinished }: AddCustomerFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "" },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
        const customerRef = doc(firestore, "shops", shopId, "customers", values.phone);
        
        const customerData = {
            shop_id: shopId,
            name: values.name,
            phone: values.phone,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            status: 'new',
            visit_count: 0,
            total_spent: 0,
            totalUdhaar: 0,
        };

        setDoc(customerRef, customerData)
            .then(() => {
                toast({
                    title: "Customer Added!",
                    description: `${values.name} has been added to your customer list.`,
                });
                onFinished();
            })
            .catch(serverError => {
                const permissionError = new FirestorePermissionError({
                    path: customerRef.path,
                    operation: 'create',
                    requestResourceData: customerData,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({
                    title: "Error",
                    description: "Failed to add customer. Please try again.",
                    variant: "destructive",
                });
            });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Rohan Sharma" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="10-digit mobile number" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending}>
                {isPending ? "Adding Customer..." : "Add Customer"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
