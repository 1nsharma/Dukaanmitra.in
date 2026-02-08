
"use client";

import Link from 'next/link';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { format, differenceInDays, isFuture, addMonths } from 'date-fns';
import { Star, Clock, CreditCard, MessageSquare, CheckCircle } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { cn } from '@/lib/utils';
import WhatsAppOnboarding from './whatsapp-onboarding';
import { Switch } from '@/components/ui/switch';


const formSchema = z.object({
  name: z.string().min(2, "Shop name must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  settings_allow_credit: z.boolean().default(true),
  settings_credit_limit_per_transaction: z.coerce.number().positive().default(5000),
  settings_working_hours_start: z.string().optional(),
  settings_working_hours_end: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ShopDetailsProps {
  shop: Shop;
}

export default function ShopDetails({ shop }: ShopDetailsProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isActivating, startActivatingTransition] = useTransition();
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: shop.name || "",
      phone: shop.phone || "",
      address: shop.address || "",
      city: shop.city || "",
      state: shop.state || "",
      pincode: shop.pincode || "",
      settings_allow_credit: shop.settings?.allow_credit ?? true,
      settings_credit_limit_per_transaction: shop.settings?.credit_limit_per_transaction ?? 5000,
      settings_working_hours_start: shop.settings?.working_hours?.start || "",
      settings_working_hours_end: shop.settings?.working_hours?.end || "",
    },
  });

  const onUpdateDetailsSubmit = (values: FormValues) => {
    startTransition(() => {
      const shopRef = doc(firestore, "shops", shop.id);
      const { settings_allow_credit, settings_credit_limit_per_transaction, settings_working_hours_start, settings_working_hours_end, ...shopDetails } = values;
      
      const shopData = {
        ...shopDetails,
        "settings.allow_credit": settings_allow_credit,
        "settings.credit_limit_per_transaction": settings_credit_limit_per_transaction,
        "settings.working_hours.start": settings_working_hours_start,
        "settings.working_hours.end": settings_working_hours_end,
        updated_at: serverTimestamp(),
      };
      
      updateDoc(shopRef, shopData)
        .then(() => {
            toast({
              title: "Shop Updated!",
              description: "Your shop details have been saved.",
            });
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
              description: "Failed to update shop details. Please try again.",
              variant: "destructive",
            });
        });
    });
  };

  const handleActivateSubscription = () => {
    startActivatingTransition(() => {
      const shopRef = doc(firestore, "shops", shop.id);
      const newPaidTillDate = addMonths(new Date(), 1);

      const shopData = {
        plan: 'basic',
        status: 'active',
        paid_till: newPaidTillDate,
      };

      updateDoc(shopRef, shopData)
        .then(() => {
          toast({
            title: "Subscription Activated!",
            description: `You are now on the Basic plan until ${format(newPaidTillDate, "PPP")}.`,
          });
        })
        .catch(serverError => {
          const permissionError = new FirestorePermissionError({
            path: shopRef.path,
            operation: 'update',
            requestResourceData: shopData,
          });
          errorEmitter.emit('permission-error', permissionError);
          toast({
            title: "Activation Error",
            description: "Could not activate your subscription. Please try again.",
            variant: "destructive",
          });
        });
    });
  };

  const getSubscriptionInfo = () => {
    if (shop.status === 'active' && shop.paid_till) {
      const paidTillDate = shop.paid_till.toDate ? shop.paid_till.toDate() : new Date(shop.paid_till);
      return {
        text: `Active until ${format(paidTillDate, "PPP")}`,
        isExpired: !isFuture(paidTillDate),
        status: 'active'
      };
    }
    
    if (shop.status === 'trial' && shop.trial_ends_at) {
      const trialEndDate = shop.trial_ends_at.toDate ? shop.trial_ends_at.toDate() : new Date(shop.trial_ends_at);
      if (!isFuture(trialEndDate)) {
        return { text: "Trial Expired", isExpired: true, status: 'trial' };
      }
      const daysLeft = differenceInDays(trialEndDate, new Date());
      return { text: `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`, isExpired: false, status: 'trial' };
    }

    return null;
  };

  const subInfo = getSubscriptionInfo();

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>Your current plan and status.</CardDescription>
                </div>
                <div>
                    {subInfo?.status === 'trial' ? (
                        <Button onClick={handleActivateSubscription} disabled={isActivating}>
                            {isActivating ? 'Activating...' : 'Activate Basic Plan'}
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link href="/pricing">Manage Subscription</Link>
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                    <Star className="text-primary w-6 h-6"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Current Plan</p>
                        <p className="text-lg font-bold capitalize">{shop.plan}</p>
                    </div>
                </div>
                {subInfo && (
                    <div className="flex items-center gap-3 rounded-lg border p-4">
                        <Clock className={cn("w-6 h-6", subInfo.isExpired ? "text-destructive" : "text-primary")} />
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className={cn("text-lg font-bold", subInfo.isExpired && "text-destructive")}>{subInfo.text}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* WhatsApp Onboarding Section */}
        {shop.whatsapp ? (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <MessageSquare className="text-success" />
                        WhatsApp Munim Active
                    </CardTitle>
                    <CardDescription>Your Digital Munim is connected and ready to assist your customers.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex items-center gap-3 rounded-lg border p-4 bg-secondary">
                        <CheckCircle className="text-success w-6 h-6"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Connected Number</p>
                            <p className="text-lg font-bold">{shop.whatsapp}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ) : (
            <WhatsAppOnboarding shopId={shop.id} />
        )}

        <Card>
            <CardHeader>
                <CardTitle>Your Shop Details</CardTitle>
                <CardDescription>Manage your store's information. This is how customers will see you.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onUpdateDetailsSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Shop Name</FormLabel>
                        <FormControl>
                            <Input {...field} />
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <div className="space-y-6 rounded-lg border bg-secondary/30 p-4 my-4">
                        <h4 className="font-semibold">Business Rules</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="settings_working_hours_start"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Opening Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="settings_working_hours_end"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Closing Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <FormField
                            control={form.control}
                            name="settings_allow_credit"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Allow Credit (Udhaar)</FormLabel>
                                        <FormDescription>
                                            Permit the AI to record credit transactions.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="settings_credit_limit_per_transaction"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Credit Limit per Transaction (₹)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="5000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
