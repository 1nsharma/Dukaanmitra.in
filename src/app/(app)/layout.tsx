
'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  useEffect(() => {
    // Wait until the user's auth and profile state are fully resolved.
    if (isUserLoading) {
      return;
    }

    // If no user is found, redirect to the main login page.
    if (!user) {
      router.replace('/login');
      return;
    }
    
    // If the user's account is suspended, sign them out and redirect.
    if (user.status === 'suspended' && auth) {
      auth.signOut();
      toast({
        title: 'Account Suspended',
        description: 'Your account has been suspended. Please contact support.',
        variant: 'destructive',
      });
      router.replace('/login');
      return;
    }
  }, [user, isUserLoading, router, auth, toast]);

  // While loading, show a full-screen spinner.
  // This also covers the brief moment before the redirect happens for an unauthorized user.
  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is authenticated and not suspended, render the protected content.
  return <>{children}</>;
}
