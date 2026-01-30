"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";

export default function LoginForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    startTransition(async () => {
      try {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        // Create user profile in Firestore if it's a new user
        await setDoc(doc(firestore, "users", user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
        }, { merge: true });

        toast({
          title: "Success!",
          description: "You have been logged in.",
        });
        router.push('/dashboard');
      } catch (error: any) {
        console.error(error);
        if (error.code === 'auth/popup-closed-by-user') {
            toast({
                title: "Sign-in cancelled",
                description: "You closed the sign-in window. Please try again.",
                variant: "destructive",
            });
        } else {
            toast({
                title: "Authentication Failed",
                description: error.message || "Failed to sign in with Google. Please try again.",
                variant: "destructive",
            });
        }
      }
    });
  };

  const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} role="img" viewBox="0 0 24 24">
        <g fill="none" fillRule="evenodd">
            <path d="M20.64 12.2c0-.65-.06-1.28-.17-1.9H12v3.6h4.84c-.2 1.18-.84 2.2-1.79 2.85v2.3h3.06c1.79-1.65 2.82-4.02 2.82-6.85z" fill="#4285F4"></path>
            <path d="M12 21c2.56 0 4.7-1.06 6.25-2.84l-3.06-2.3c-.85.57-1.94.9-3.19.9-2.49 0-4.6-1.67-5.36-3.95H3.5v2.38C5.07 18.99 8.27 21 12 21z" fill="#34A853"></path>
            <path d="M6.64 13.03c-.2-.57-.31-1.18-.31-1.8s.11-1.23.31-1.8V7.05H3.5C2.72 8.44 2.22 10.13 2.22 12s.5 3.56 1.28 4.95l3.14-2.42z" fill="#FBBC05"></path>
            <path d="M12 6.55c1.33 0 2.45.45 3.36 1.32l2.72-2.72C16.7.83 14.56 0 12 0 8.27 0 5.07 2.01 3.5 4.95l3.14 2.42C7.4 5.02 9.51 6.55 12 6.55z" fill="#EA4335"></path>
        </g>
    </svg>
  );

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="w-full"
      disabled={isPending}
      variant="outline"
    >
      {isPending ? "Signing in..." : (
        <>
          <GoogleIcon className="mr-2 h-4 w-4" />
          Sign in with Google
        </>
      )}
    </Button>
  );
}

    