"use client";

import Link from "next/link";
import { Menu, Store } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser, useAuth } from "@/firebase";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold">
            <Store className="h-6 w-6 text-primary" />
            <span className="font-semibold">DukaanMitra</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:flex-1 items-center justify-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-medium text-foreground/60 transition-colors hover:text-foreground/80"
            >
              {link.label}
            </Link>
          ))}
          {user && (
             <Link
              href="/dashboard"
              className="font-medium text-foreground/60 transition-colors hover:text-foreground/80"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {!isUserLoading && (
            <>
              {user ? (
                <Button onClick={handleSignOut} variant="ghost">Sign Out</Button>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/login?register=true">Get Started</Link>
                  </Button>
                </>
              )}
            </>
          )}
          
          {/* Mobile Navigation */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden"
                size="icon"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 pt-8">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Store className="h-6 w-6 text-primary" />
                  <span className="font-headline text-lg font-bold">DukaanMitra</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {user && (
                    <Link
                      href="/dashboard"
                      className="text-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
