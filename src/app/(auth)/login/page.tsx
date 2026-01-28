"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from './login-form';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const bgImage = getPlaceholderImage('login-background');
  const searchParams = useSearchParams();
  const isRegister = searchParams.get('register') === 'true';
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
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">{isRegister ? 'Create an Account' : 'Welcome Back'}</CardTitle>
            <CardDescription>{isRegister ? 'Enter your details to get started.' : 'Enter your credentials to access your account'}</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <Link href={isRegister ? '/login' : '/login?register=true'} className="font-medium text-primary underline-offset-4 hover:underline">
                {isRegister ? 'Log In' : 'Sign up'}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
