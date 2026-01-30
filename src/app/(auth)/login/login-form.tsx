
"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
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
import { useAuth, useFirestore, FirestorePermissionError, errorEmitter } from "@/firebase";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      const authPromise = isSignUp
        ? createUserWithEmailAndPassword(auth, values.email, values.password)
        : signInWithEmailAndPassword(auth, values.email, values.password);

      authPromise
        .then((userCredential) => {
          const user = userCredential.user;

          if (isSignUp) {
            // Create user profile in Firestore for new users
            const userProfileRef = doc(firestore, "users", user.uid);
            const profileData = {
              uid: user.uid,
              email: user.email,
              createdAt: serverTimestamp(),
            };
            
            setDoc(userProfileRef, profileData, { merge: true })
              .catch(serverError => {
                const permissionError = new FirestorePermissionError({
                  path: userProfileRef.path,
                  operation: 'write',
                  requestResourceData: profileData
                });
                errorEmitter.emit('permission-error', permissionError);
              });
          }

          toast({
            title: "Success!",
            description: isSignUp ? "Your account has been created." : "You have been logged in.",
          });
          router.push('/dashboard');
        })
        .catch((error: any) => {
          console.error(error);
          toast({
            title: "Authentication Failed",
            description: error.message || "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
        });
    });
  };

  return (
    <div className="space-y-4">
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
            {isPending ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <Button variant="link" className="p-0 h-auto" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Sign In" : "Sign Up"}
        </Button>
      </div>
    </div>
  );
}
