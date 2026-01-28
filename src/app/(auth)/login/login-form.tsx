"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

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
import { useAuth, useFirestore } from "@/firebase";


const formSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  const isRegister = searchParams.get('register') === 'true';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        if (isRegister) {
          const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
          const user = userCredential.user;

          // Create user profile in Firestore
          await setDoc(doc(firestore, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.email?.split('@')[0] || '',
            createdAt: serverTimestamp(),
          });

          toast({
            title: "Account Created!",
            description: "You have been successfully registered.",
          });
          router.push('/dashboard');
        } else {
          await signInWithEmailAndPassword(auth, values.email, values.password);
          toast({
            title: "Success!",
            description: "You have been logged in.",
          });
          router.push('/dashboard');
        }
      } catch (error: any) {
        let message = "An unexpected error occurred.";
        switch(error.code) {
          case 'auth/email-already-in-use':
            message = "This email is already in use. Please log in or use a different email.";
            break;
          case 'auth/invalid-email':
            message = "Please enter a valid email address.";
            break;
          case 'auth/weak-password':
            message = "The password is too weak. Please use at least 8 characters.";
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
             message = 'Invalid email or password. Please try again.';
             break;
          default:
            console.error(error); // Log other errors to the console
        }
        toast({
          title: "Authentication Failed",
          description: message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Authenticating..." : (isRegister ? "Create Account" : "Log In")}
        </Button>
      </form>
    </Form>
  );
}
