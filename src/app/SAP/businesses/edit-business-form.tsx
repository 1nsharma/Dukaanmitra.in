
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { type Shop } from '@/docs/backend-types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { updateBusinessDetails } from '@/firebase/admin-actions';

const formSchema = z.object({
  name: z.string().min(2, 'Shop name must be at least 2 characters.'),
  owner_name: z.string().optional(),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  plan: z.enum(['free', 'basic', 'pro', 'enterprise']),
  mrr: z.coerce.number().min(0, 'MRR must be a positive number.'),
});

type FormValues = z.infer<typeof formSchema>;

interface EditBusinessFormProps {
  shop: Shop;
  onFinished: () => void;
}

export default function EditBusinessForm({ shop, onFinished }: EditBusinessFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const firestore = useFirestore();
  const { user: currentUser } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: shop.name || '',
      owner_name: shop.owner_name || '',
      phone: shop.phone || '',
      plan: shop.plan || 'free',
      mrr: shop.mrr || 0,
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!currentUser) return;
    startTransition(async () => {
      try {
        await updateBusinessDetails(firestore, currentUser.uid, shop.id, values);
        toast({
          title: 'Business Updated',
          description: `${shop.name} has been successfully updated.`,
        });
        onFinished();
      } catch (error: any) {
        console.error('Failed to update business:', error);
        toast({
          title: 'Update Failed',
          description: error.message || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
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
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-slate-800 border-purple-600" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="owner_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-slate-800 border-purple-600" />
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
              <FormLabel>Contact Phone</FormLabel>
              <FormControl>
                <Input {...field} className="bg-slate-800 border-purple-600" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Plan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger className="bg-slate-800 border-purple-600">
                        <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-900 border-purple-700 text-white">
                        <SelectItem value="free" className="focus:bg-purple-800">Free</SelectItem>
                        <SelectItem value="basic" className="focus:bg-purple-800">Basic</SelectItem>
                        <SelectItem value="pro" className="focus:bg-purple-800">Pro</SelectItem>
                        <SelectItem value="enterprise" className="focus:bg-purple-800">Enterprise</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="mrr"
            render={({ field }) => (
                <FormItem>
                <FormLabel>MRR (₹)</FormLabel>
                <FormControl>
                    <Input type="number" {...field} className="bg-slate-800 border-purple-600" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending} className="bg-purple-600 hover:bg-purple-700">
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
