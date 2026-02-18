
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition, useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { MessageSquare, Loader2, CheckCircle } from "lucide-react";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  whatsapp: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number."),
});

type FormValues = z.infer<typeof formSchema>;

interface WhatsAppOnboardingProps {
  shopId: string;
}

export default function WhatsAppOnboarding({ shopId }: WhatsAppOnboardingProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { whatsapp: "" },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
        const shopRef = doc(firestore, "shops", shopId);
        const shopData = { 
            whatsapp: `+91${values.whatsapp}`,
            updated_at: serverTimestamp()
        };
        updateDoc(shopRef, shopData)
            .then(() => {
                toast({
                    title: "Number Submitted!",
                    description: "Your WhatsApp number has been submitted for verification.",
                });
                setIsSubmitted(true);
            })
            .catch(serverError => {
                 const permissionError = new FirestorePermissionError({
                    path: shopRef.path,
                    operation: 'update',
                    requestResourceData: shopData,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({
                    title: "Error",
                    description: "Failed to submit number. Please try again.",
                    variant: "destructive",
                });
            });
    });
  };
  
  if (isSubmitted) {
      return (
        <Card>
            <CardHeader>
                 <CardTitle className="flex items-center gap-2 font-headline">
                    <MessageSquare className="text-primary"/>
                    WhatsApp Munim Activation
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Verification Pending!</AlertTitle>
                    <AlertDescription>
                        We have submitted your number to Meta for verification. You will receive a call or SMS with a verification code shortly. Please follow the instructions to complete the setup. Your dashboard will update once connected.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card className="bg-secondary/50 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
            <MessageSquare className="text-primary"/>
            Activate Your WhatsApp Munim
        </CardTitle>
        <CardDescription>
          Connect your business WhatsApp number to enable AI-powered replies, automatic ledger entries, and daily reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>10-Digit Business WhatsApp Number</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                        <div className="border rounded-md px-3 py-2 bg-muted text-muted-foreground text-sm">+91</div>
                        <Input placeholder="9876543210" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isPending ? "Submitting..." : "Connect Number"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
