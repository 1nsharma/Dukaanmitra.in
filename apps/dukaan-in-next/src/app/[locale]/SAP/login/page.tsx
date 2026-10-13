
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SAPLoginForm from './sap-login-form';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { getPlaceholderImage } from '@/lib/placeholder-images';

export default function SuperAdminLoginPage() {
  const bgImage = getPlaceholderImage('login-background');
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user?.role === 'super_admin') {
      router.push('/SAP/Superdashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user?.role === 'super_admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          fill
          className="object-cover"
          data-ai-hint={bgImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md" />
      <div className="relative z-10 w-full max-w-md">
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Super Dashboard</CardTitle>
            <CardDescription>Enter your administrator credentials to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <SAPLoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
