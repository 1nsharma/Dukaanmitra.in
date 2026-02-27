
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition } from "react";
import { collection, serverTimestamp, doc, writeBatch } from "firebase/firestore";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser, FirestorePermissionError, errorEmitter } from "@/firebase";

const formSchema = z.object({
  name: z.string().min(2, "Shop name must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid phone number."),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateShopFormProps {
  onShopCreated: (shopId: string) => void;
}

export default function CreateShopForm({ onShopCreated }: CreateShopFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "" },
  });

  const onSubmit = (values: FormValues) => {
    if (!user) return;

    startTransition(async () => {
        const batch = writeBatch(firestore);
        const newShopRef = doc(collection(firestore, "shops"));
        const shopId = newShopRef.id;

        const shopData = {
            id: shopId,
            owner_id: user.uid,
            name: values.name,
            phone: values.phone,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            plan: 'free',
            status: 'trial',
            trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            settings: {
                language: "hinglish",
                currency: "INR",
                timezone: "Asia/Kolkata",
                allow_credit: true,
                credit_limit_per_transaction: 5000,
            },
        };
        batch.set(newShopRef, shopData);

        const userProfileRef = doc(firestore, "users", user.uid);
        batch.set(userProfileRef, { shopId: shopId }, { merge: true });

        try {
             await batch.commit();
             toast({ title: "Shop Created!", description: "Digital storefront is ready." });
             onShopCreated(shopId);
        } catch(serverError) {
             const permissionError = new FirestorePermissionError({
                 path: newShopRef.path,
                 operation: 'write',
                 requestResourceData: {shop: shopData},
             });
             errorEmitter.emit('permission-error', permissionError);
             toast({ title: "Error", description: "Could not create shop.", variant: "destructive" });
        }
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create Your Shop</CardTitle>
        <CardDescription>Digitize your dukaan in seconds.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Gupta Store" {...field} /></FormControl>
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
                  <FormControl><Input placeholder="Business number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating..." : "Create Shop"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
