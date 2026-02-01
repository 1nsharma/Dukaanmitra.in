'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import SuperAdminSidebar from './components/super-admin-sidebar';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/login');
      } else if (user.role !== 'super_admin') {
        // Logged in but not a super admin, redirect to their dashboard
        router.push('/dashboard');
      }
    }
  }, [user, isUserLoading, router]);

  // While checking auth, show a loader
  if (isUserLoading || !user || user.role !== 'super_admin') {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is a super_admin, render the layout
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.14))]">
      <SuperAdminSidebar />
      <main className="flex-1 p-8 bg-muted/20">
        {children}
      </main>
    </div>
  );
}
