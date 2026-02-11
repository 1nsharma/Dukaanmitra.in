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
    if (!isUserLoading) {
      if (!user) {
        // Redirect to the dedicated SAP login page
        router.push('/SAP/login');
      } else if (user.role !== 'super_admin') {
        // If a non-admin tries to access, send them to their dashboard
        router.push('/dashboard');
      }
    }
  }, [user, isUserLoading, router]);

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
