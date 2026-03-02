"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition, useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { MessageSquare, Loader2, CheckCircle2, Zap } from "lucide-react";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  whatsapp: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number."),
});

export default function WhatsAppOnboarding({ shopId }: { shopId: string }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const firestore = useFirestore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { whatsapp: "" },
  });

  const onSubmit = (values: any) => {
    startTransition(() => {
        const shopRef = doc(firestore, "shops", shopId);
        updateDoc(shopRef, { 
            whatsapp: `+91${values.whatsapp}`, 
            updated_at: serverTimestamp() 
        })
            .then(() => {
                toast({ title: "Activation Started!", description: "Verifying your number." });
                setIsSubmitted(true);
            })
            .catch(() => toast({ title: "Error", description: "Try re-entering your number.", variant: "destructive" }));
    });
  };

  if (isSubmitted) {
      return (
        <Card className="border-2 border-success shadow-lg">
            <CardHeader className="text-center">
                 <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4 animate-in zoom-in duration-300" />
                 <CardTitle className="font-headline text-2xl">Verification Sent!</CardTitle>
                 <CardDescription>
                    We've sent a code to your WhatsApp.
                 </CardDescription>
            </CardHeader>
            <CardContent>
                <Alert className="bg-secondary/50 border-none">
                    <Zap className="h-4 w-4 text-primary" />
                    <AlertTitle className="font-bold">Next Step: Activation</AlertTitle>
                    <AlertDescription className="text-sm mt-2">
                        Reply to our message on WhatsApp to complete setup. Once verified, your "Digital Munim" will start recording your bills automatically!
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card className="bg-primary/5 border-2 border-primary/20 shadow-xl overflow-hidden">
      <CardHeader>
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground mb-4 shadow-lg">
            <MessageSquare size={24}/>
        </div>
        <CardTitle className="font-headline text-3xl uppercase tracking-tighter">Activate WhatsApp Munim</CardTitle>
        <CardDescription className="text-lg">
          Connect your business number to start recording transactions via simple WhatsApp messages.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="whatsapp" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Your 10-Digit Business WhatsApp</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                        <div className="h-14 flex items-center border-2 rounded-xl px-4 bg-muted font-bold text-muted-foreground">+91</div>
                        <Input placeholder="9876543210" className="h-14 text-xl rounded-xl border-2 focus:border-primary" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-16 text-xl font-black uppercase tracking-widest rounded-xl shadow-heavy shadow-primary/10" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
              {isPending ? "Connecting..." : "Activate Now"}
            </Button>
          </form>
        </Form>
        <p className="text-[10px] text-center text-muted-foreground mt-6 font-bold uppercase tracking-widest">
            Safe • Private • No Spam
        </p>
      </CardContent>
    </Card>
  );
}
