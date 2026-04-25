
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ShieldCheck, Clock, CheckCircle } from 'lucide-react';

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
import { useFirestore, FirestorePermissionError, errorEmitter } from "@/firebase";
import type { Shop } from '@/docs/backend-types';
import WhatsAppOnboarding from './whatsapp-onboarding';

const formSchema = z.object({
  name: z.string().min(2, "Shop name must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  address: z.string().optional(),
});

interface ShopDetailsProps {
  shop: Shop;
}

export default function ShopDetails({ shop }: ShopDetailsProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const firestore = useFirestore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: shop.name || "",
      phone: shop.phone || "",
      address: shop.address || "",
    },
  });

  const onSubmit = (values: any) => {
    startTransition(() => {
      const shopRef = doc(firestore, "shops", shop.id);
      updateDoc(shopRef, { ...values, updated_at: serverTimestamp() })
        .then(() => toast({ title: "Shop Updated!" }))
        .catch(e => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({ path: shopRef.path, operation: 'update' }));
        });
    });
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader><CardTitle>Subscription Status</CardTitle></CardHeader>
            <CardContent>
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-secondary/30">
                    <ShieldCheck className="text-primary h-6 w-6" />
                    <div><p className="text-sm font-bold uppercase">{shop.plan} Plan</p></div>
                </div>
            </CardContent>
        </Card>

        {shop.whatsapp ? (
            <Card>
                <CardHeader><CardTitle>WhatsApp Active</CardTitle></CardHeader>
                <CardContent>
                     <div className="flex items-center gap-3 p-4 border rounded-lg bg-success/10">
                        <CheckCircle className="text-success h-6 w-6"/>
                        <p className="font-bold">{shop.whatsapp}</p>
                    </div>
                </CardContent>
            </Card>
        ) : <WhatsAppOnboarding shopId={shop.id} />}

        <Card>
            <CardHeader><CardTitle>Store Information</CardTitle></CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Shop Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Changes"}</Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
