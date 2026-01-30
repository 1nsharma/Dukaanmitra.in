"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
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
import { useAuth, useFirestore } from "@/firebase";

const phoneFormSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number with country code."),
});

const otpFormSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 characters.").max(6, "OTP must be 6 characters."),
});

type PhoneFormValues = z.infer<typeof phoneFormSchema>;
type OtpFormValues = z.infer<typeof otpFormSchema>;

export default function LoginForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [showOtpForm, setShowOtpForm] = useState(false);

  // Setup Recaptcha
  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
  }, [auth]);


  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: { phone: "" },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: "" },
  });

  const onPhoneSubmit = (values: PhoneFormValues) => {
    startTransition(async () => {
      try {
        const verifier = window.recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, values.phone, verifier);
        setConfirmationResult(result);
        setShowOtpForm(true);
        toast({
          title: "OTP Sent!",
          description: "Please check your phone for the verification code.",
        });
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Authentication Failed",
          description: error.message || "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const onOtpSubmit = (values: OtpFormValues) => {
    if (!confirmationResult) return;
    startTransition(async () => {
      try {
        const userCredential = await confirmationResult.confirm(values.otp);
        const user = userCredential.user;

        // Create user profile in Firestore if it's a new user
        await setDoc(doc(firestore, "users", user.uid), {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          displayName: user.phoneNumber,
          createdAt: serverTimestamp(),
        }, { merge: true });

        toast({
          title: "Success!",
          description: "You have been logged in.",
        });
        router.push('/dashboard');
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Authentication Failed",
          description: "Invalid OTP or an error occurred. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <div id="recaptcha-container"></div>
      {!showOtpForm ? (
        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+91 98765 43210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter OTP</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Verifying..." : "Verify & Log In"}
            </Button>
            <Button variant="link" onClick={() => setShowOtpForm(false)} className="w-full">
              Back to phone number
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}

// Add recaptchaVerifier to window interface
declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}
