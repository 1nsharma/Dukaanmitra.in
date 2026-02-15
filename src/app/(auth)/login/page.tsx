
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from './login-form';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const bgImage = getPlaceholderImage('login-background');
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center p-4">
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
            <CardTitle className="font-headline text-2xl">Welcome to DukaanMitra</CardTitle>
            <CardDescription>Enter your email and password to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
