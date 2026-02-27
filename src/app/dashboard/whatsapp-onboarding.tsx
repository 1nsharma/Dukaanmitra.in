
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { MessageSquare, Loader2 } from "lucide-react";

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
import { useFirestore } from "@/firebase";

const formSchema = z.object({
  whatsapp: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit number."),
});

export default function WhatsAppOnboarding({ shopId }: { shopId: string }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const firestore = useFirestore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { whatsapp: "" },
  });

  const onSubmit = (values: any) => {
    startTransition(() => {
        const shopRef = doc(firestore, "shops", shopId);
        updateDoc(shopRef, { whatsapp: `+91${values.whatsapp}`, updated_at: serverTimestamp() })
            .then(() => toast({ title: "Connecting...", description: "Number submitted." }))
            .catch(() => toast({ title: "Error", variant: "destructive" }));
    });
  };

  return (
    <Card className="bg-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline"><MessageSquare className="text-primary h-5 w-5"/> Connect WhatsApp</CardTitle>
        <CardDescription>Activate your AI Munim.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="whatsapp" render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                        <div className="border rounded px-3 py-2 bg-muted text-xs">+91</div>
                        <Input placeholder="9876543210" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>{isPending ? <Loader2 className="animate-spin" /> : "Connect Number"}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
