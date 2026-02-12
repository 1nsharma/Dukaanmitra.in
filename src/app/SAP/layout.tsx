'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import SuperAdminSidebar from './components/super-admin-sidebar';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  // If we are on the login page, don't render the protected layout
  if (pathname === '/SAP/login') {
    return <>{children}</>;
  }

  useEffect(() => {
    // Wait for the user's auth state to be fully resolved.
    if (!isUserLoading) {
      // If no user is found, redirect them to the dedicated SAP login page.
      if (!user) {
        router.replace('/SAP/login');
      } else if (user.role !== 'super_admin') {
        // If a non-admin user tries to access, send them to their own dashboard.
        router.replace('/dashboard');
      }
    }
  }, [user, isUserLoading, router]);

  // CRITICAL LOADING GUARD:
  // While `isUserLoading` is true, or if the resolved user is not a super_admin,
  // show a loading spinner. This prevents any unauthorized content from flickering
  // and covers the brief moment during a redirect.
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
