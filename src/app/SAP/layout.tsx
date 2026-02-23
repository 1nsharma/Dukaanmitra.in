'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import SuperAdminSidebar from './components/super-admin-sidebar';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Wait for the user's auth state to be fully resolved.
    if (isUserLoading) {
      return;
    }
    
    // If no user is found, or if the user is not a super admin, redirect away.
    if (!user || user.role !== 'super_admin') {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  // While loading, or if the user is not a super admin (before redirect), show a spinner.
  if (isUserLoading || !user || user.role !== 'super_admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const getThemeClass = () => {
    if (resolvedTheme === 'eco') {
      return 'eco';
    }
    // Admin panels get a special theme
    if (resolvedTheme === 'dark') {
      return 'admin-dark';
    }
    if (resolvedTheme === 'light') {
      return 'admin-light';
    }
    // Default fallback
    return '';
  };


  // Only render the admin layout if all checks have passed.
  return (
    <div className={cn(getThemeClass())}>
      <div className="flex min-h-screen">
        <SuperAdminSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
