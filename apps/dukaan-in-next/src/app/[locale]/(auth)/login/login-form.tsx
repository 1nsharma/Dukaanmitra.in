
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
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  getAdditionalUserInfo
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

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.251,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);


export default function LoginForm() {
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

  const handleSuccessfulLogin = async (userCredential: UserCredential) => {
    if (!firestore) return;
    const user = userCredential.user;
    const additionalInfo = getAdditionalUserInfo(userCredential);
    const userProfileRef = doc(firestore, "users", user.uid);
    
    if (additionalInfo?.isNewUser) {
      try {
        const profileData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          role: "owner",
          status: "active",
          lastLogin: serverTimestamp(),
        };
        await setDoc(userProfileRef, profileData, { merge: true });
      } catch (profileError) {
        const permissionError = new FirestorePermissionError({
          path: `users/${user.uid}`,
          operation: 'write',
          requestResourceData: { uid: user.uid, email: user.email, role: 'owner', status: 'active' },
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          title: "Profile Creation Issue",
          description: "Your account was created, but we couldn't save your profile. Please contact support.",
          variant: "destructive"
        });
        return;
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
      description: additionalInfo?.isNewUser ? "Your account has been created." : "You have been logged in.",
    });
    router.push('/dashboard');
  };

  const onEmailSubmit = (values: LoginFormValues) => {
    startTransition(async () => {
      if (!auth) {
        toast({ title: "Firebase Not Configured", description: "Please check your environment variables.", variant: "destructive" });
        return;
      }
      const isSignUp = authAction === "signup";
      try {
        const userCredential = await (isSignUp
          ? createUserWithEmailAndPassword(auth, values.email, values.password)
          : signInWithEmailAndPassword(auth, values.email, values.password));
        
        await handleSuccessfulLogin(userCredential);

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

  const onGoogleSignIn = () => {
    startTransition(async () => {
      if (!auth) {
        toast({ title: "Firebase Not Configured", description: "Please check your environment variables.", variant: "destructive" });
        return;
      }
      const provider = new GoogleAuthProvider();
      try {
        const userCredential = await signInWithPopup(auth, provider);
        await handleSuccessfulLogin(userCredential);
      } catch (error: any) {
        console.error("Google Sign-In Error:", error);
        toast({
          title: "Google Sign-In Failed",
          description: error.message || "Could not sign in with Google. Please try again.",
          variant: "destructive",
        });
      }
    });
  };
  
  const onResetSubmit = (values: ResetFormValues) => {
    startTransition(() => {
      if (!auth) {
        toast({ title: "Firebase Not Configured", description: "Please check your environment variables.", variant: "destructive" });
        return;
      }
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
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending || !auth}>
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
      <Button variant="outline" className="w-full" onClick={onGoogleSignIn} disabled={isPending || !auth}>
        <GoogleIcon />
        Sign in with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={isPending || !auth}>
            {isPending ? (authAction === "signup" ? "Creating account..." : "Signing in...") : (authAction === "signup" ? "Create Account" : "Sign In")}
          </Button>
        </form>
      </Form>
      <div className="flex justify-between items-center text-sm">
        <div>
          {authAction === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
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
