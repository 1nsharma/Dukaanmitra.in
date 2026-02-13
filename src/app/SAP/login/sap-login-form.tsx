
"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

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

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const resetFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type ResetFormValues = z.infer<typeof resetFormSchema>;

const SUPER_ADMIN_BOOTSTRAP_EMAIL = "amitsharmaanxt@gmail.com";

// NOTE: This component is a copy of the main LoginForm, but redirects to the SAP dashboard.
export default function SAPLoginForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [authAction, setAuthAction] = useState<"login" | "signup" | "reset">("login");
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });
  
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: { email: "" },
  });

  const onLoginSubmit = (values: LoginFormValues) => {
    startTransition(async () => {
      const isSignUp = authAction === "signup";
      
      try {
        const userCredential = await (isSignUp
          ? createUserWithEmailAndPassword(auth, values.email, values.password)
          : signInWithEmailAndPassword(auth, values.email, values.password));
        
        const user = userCredential.user;
        const userProfileRef = doc(firestore, "users", user.uid);

        if (isSignUp) {
          try {
            const isSuperAdminBootstrap = values.email.toLowerCase() === SUPER_ADMIN_BOOTSTRAP_EMAIL;
            
            const profileData = {
              uid: user.uid,
              email: user.email,
              createdAt: serverTimestamp(),
              role: isSuperAdminBootstrap ? "super_admin" : "owner",
              status: "active",
              lastLogin: serverTimestamp(),
            };

            setDoc(userProfileRef, profileData, { merge: true }).catch(profileError => {
                 const permissionError = new FirestorePermissionError({
                      path: userProfileRef.path,
                      operation: 'write',
                      requestResourceData: profileData,
                  });
                  errorEmitter.emit('permission-error', permissionError);
            });

          } catch (profileError: any) {
             const permissionError = new FirestorePermissionError({
                  path: `users/${user.uid}`,
                  operation: 'write',
                  requestResourceData: {uid: user.uid, email: user.email, role: 'owner', status: 'active'},
              });
              errorEmitter.emit('permission-error', permissionError);
              toast({
                  title: "Profile Creation Issue",
                  description: "Your account was created, but we couldn't save your profile. Please contact support.",
                  variant: "destructive"
              });
          }
        } else {
            const loginUpdateData = { lastLogin: serverTimestamp() };
            updateDoc(userProfileRef, loginUpdateData).catch(err => {
                const permissionError = new FirestorePermissionError({
                      path: userProfileRef.path,
                      operation: 'update',
                      requestResourceData: loginUpdateData,
                });
                errorEmitter.emit('permission-error', permissionError);
            });
        }

        toast({
          title: "Success!",
          description: isSignUp ? "Your account has been created." : "You have been logged in.",
        });
        // The key change: redirect to SAP dashboard
        router.push('/SAP/Superdashboard');

      } catch (authError: any) {
        console.error(authError);
        toast({
          title: "Authentication Failed",
          description: authError.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    });
  };
  
  const onResetSubmit = (values: ResetFormValues) => {
    startTransition(() => {
      sendPasswordResetEmail(auth, values.email)
        .then(() => {
          toast({
            title: "Password Reset Email Sent",
            description: "Please check your inbox for a link to reset your password.",
          });
          setAuthAction("login");
        })
        .catch((error: any) => {
          console.error(error);
          toast({
            title: "Error",
            description: error.message || "Could not send password reset email. Please try again.",
            variant: "destructive",
          });
        });
    });
  };
  
  if (authAction === "reset") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-center text-muted-foreground">Enter your email and we'll send you a link to reset your password.</p>
        <Form {...resetForm}>
          <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
            <FormField
              control={resetForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="superadmin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </Form>
         <div className="text-center text-sm">
          Remembered your password?{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => setAuthAction("login")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onLoginSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="superadmin@example.com" {...field} />
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
            {isPending ? (authAction === "signup" ? "Creating account..." : "Signing in...") : (authAction === "signup" ? "Create Account" : "Sign In")}
          </Button>
        </form>
      </Form>
      <div className="flex justify-between items-center text-sm">
        <div>
          {authAction === "login" ? "Need to create the super admin account?" : "Already have an account?"}{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => setAuthAction(authAction === "login" ? "signup" : "login")}>
            {authAction === "login" ? "Sign Up" : "Sign In"}
          </Button>
        </div>
        {authAction === "login" && (
            <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground" onClick={() => setAuthAction("reset")}>
                Forgot Password?
            </Button>
        )}
      </div>
    </div>
  );
}
