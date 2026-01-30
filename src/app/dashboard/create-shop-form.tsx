"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition } from "react";
import { collection, serverTimestamp, doc, updateDoc, setDoc } from "firebase/firestore";

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
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a shop.",
        variant: "destructive",
      });
      return;
    }

    startTransition(() => {
        // 1. Create a new document reference with an auto-generated ID
        const shopCollection = collection(firestore, "shops");
        const newShopRef = doc(shopCollection);
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
            trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        };

        // 2. Create the shop document with setDoc
        setDoc(newShopRef, shopData)
            .catch(serverError => {
                const permissionError = new FirestorePermissionError({
                    path: newShopRef.path,
                    operation: 'create',
                    requestResourceData: shopData,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({ title: "Error", description: "Could not create shop.", variant: "destructive" });
            });

        // 3. Update the user's profile with the new shopId
        const userProfileRef = doc(firestore, "users", user.uid);
        const userProfileData = { shopId: shopId };
        updateDoc(userProfileRef, userProfileData)
            .catch(serverError => {
                const permissionError = new FirestorePermissionError({
                    path: userProfileRef.path,
                    operation: 'update',
                    requestResourceData: userProfileData,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({ title: "Error", description: "Could not link shop to your profile.", variant: "destructive" });
            });

        toast({
          title: "Shop Created!",
          description: "Your shop has been successfully created.",
        });

        onShopCreated(shopId);
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create Your Shop</CardTitle>
        <CardDescription>
          Welcome to DukaanMitra! Let's get your digital storefront up and running.
        </CardDescription>
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
                  <FormControl>
                    <Input placeholder="e.g., Gupta General Store" {...field} />
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
                  <FormLabel>Contact Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your business contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating Shop..." : "Create Shop"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
