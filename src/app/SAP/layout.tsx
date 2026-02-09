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
        router.push('/login');
      } else if (user.role !== 'super_admin') {
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

  return (
    <div className="super-admin-theme">
      <div className="flex min-h-screen">
        <SuperAdminSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
