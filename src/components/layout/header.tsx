
"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { useUser, useAuth } from "@/firebase";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/insights", label: "Insights" },
  { href: "/blog", label: "Blog" },
  { href: "/docs", label: "Docs" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  const isLandingPage = pathname === '/';

  const NavLink = ({ href, label }: { href: string, label: string }) => {
    const isExternalPageLink = href.startsWith('/');
    const finalHref = !isLandingPage && href.startsWith('/#') ? `/${href}` : href;
    
    if (isLandingPage && href.startsWith('/#')) {
         return (
            <a 
                href={href} 
                className="hover:text-primary transition-colors"
                onClick={(e) => {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false)
                }}
            >
                {label}
            </a>
        );
    }

    return (
        <Link 
            href={finalHref} 
            className="hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(false)}
        >
            {label}
        </Link>
    );
  };

  return (
    <header className="px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-lg z-[100] border-b border-border shadow-sm">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/10">
             <span className="text-primary-foreground text-2xl font-black">D</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-foreground">DukaanMitra</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-10 text-sm font-semibold text-muted-foreground items-center">
          {navLinks.map(link => <NavLink key={link.href} {...link} />)}
        </nav>

        <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2">
                {!isUserLoading && (
                    <>
                    {user ? (
                        <Button
                            onClick={() => router.push('/dashboard')}
                        >
                            <span>Dashboard</span>
                        </Button>
                    ) : (
                        <Button
                            onClick={() => router.push('/login')}
                        >
                            <span>Go to App</span>
                        </Button>
                    )}
                    </>
                )}
            </div>

            {/* Mobile Navigation */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="lg:hidden"
                size="icon"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="border-b border-border pb-4">
                <SheetTitle>
                    <Link
                    href="/"
                    className="flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                    >
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-primary-foreground text-2xl font-black">D</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-foreground">DukaanMitra</h1>
                    </Link>
                </SheetTitle>
                <SheetDescription className="sr-only">Mobile Menu Navigation</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 pt-8">
                <nav className="flex flex-col gap-4 text-lg font-medium">
                  {navLinks.map((link) => <NavLink key={link.href} {...link} />)}
                </nav>
                <div className="mt-auto flex flex-col gap-4 border-t border-border pt-6">
                    {!isUserLoading && (
                        <>
                        {user ? (
                            <>
                                <Button onClick={() => {router.push('/dashboard'); setMobileMenuOpen(false);}} size="lg">Dashboard</Button>
                                <Button onClick={() => {handleSignOut(); setMobileMenuOpen(false);}} variant="outline" size="lg">Sign Out</Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => {router.push('/login'); setMobileMenuOpen(false);}} size="lg">Log In</Button>
                                <Button onClick={() => {router.push('/login?register=true'); setMobileMenuOpen(false);}} variant="secondary" size="lg">Sign Up</Button>
                            </>
                        )}
                        </>
                    )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
    </header>
  );
}
