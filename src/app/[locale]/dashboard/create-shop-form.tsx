
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
import { Sparkles, ArrowRight } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Shop name must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid 10-digit phone number."),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateShopForm({ onShopCreated }: { onShopCreated: (id: string) => void }) {
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
        const batch = writeBatch(firestore!);
        const newShopRef = doc(collection(firestore!, "shops"));
        const shopId = newShopRef.id;

        const shopData = {
            id: shopId,
            owner_id: user.uid,
            name: values.name,
            phone: values.phone,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            plan: 'basic',
            status: 'trial',
            // MARKET PILOT: Auto-assign 90 days trial
            trial_ends_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 
            settings: {
                language: "hinglish",
                currency: "INR",
                timezone: "Asia/Kolkata",
                allow_credit: true,
                credit_limit_per_transaction: 10000,
            },
        };
        batch.set(newShopRef, shopData);

        const userProfileRef = doc(firestore!, "users", user.uid);
        batch.set(userProfileRef, { shopId: shopId }, { merge: true });

        try {
             await batch.commit();
             toast({ title: "Dukaan Ready!", description: "WhatsApp Munim set up ho gaya hai." });
             onShopCreated(shopId);
        } catch(serverError) {
             const permissionError = new FirestorePermissionError({
                 path: newShopRef.path,
                 operation: 'write',
                 requestResourceData: {shop: shopData},
             });
             errorEmitter.emit('permission-error', permissionError);
             toast({ title: "Error", description: "Could not create shop. Try again.", variant: "destructive" });
        }
    });
  };

  return (
    <Card className="max-w-md mx-auto border-2 border-primary/20 shadow-xl overflow-hidden">
      <div className="bg-primary/10 p-4 flex items-center justify-center gap-2 border-b border-primary/10">
        <Sparkles className="text-primary h-5 w-5" />
        <span className="font-bold text-primary uppercase tracking-widest text-xs">Pilot Program: 90 Days Free</span>
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-center">Apni Dukaan Shuru Karein</CardTitle>
        <CardDescription className="text-center">
          Sirf 2 details fill karein aur WhatsApp Munim payein.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold uppercase text-[10px] tracking-wider text-muted-foreground">Dukaan ka Naam</FormLabel>
                  <FormControl><Input placeholder="e.g., Gupta Store" className="h-12 text-lg" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold uppercase text-[10px] tracking-wider text-muted-foreground">Aapka WhatsApp Number</FormLabel>
                  <FormControl><Input placeholder="10-digit mobile number" className="h-12 text-lg" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-14 text-lg font-black uppercase tracking-widest rounded-xl shadow-lg" disabled={isPending}>
              {isPending ? "Setting up..." : "Create My Shop"}
              <ArrowRight className="ml-2" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
