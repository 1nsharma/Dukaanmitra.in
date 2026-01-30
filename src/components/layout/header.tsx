
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
  { href: "/architecture", label: "How it Works" },
  { href: "/guide", label: "A-Z Guide" },
  { href: "/assets", label: "Builder Archive" },
  { href: "/build", label: "Build Guide" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/insights", label: "Insights Hub" },
  { href: "/docs", label: "Docs" },
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
    // For in-page links on the landing page, we want smooth scroll.
    // For other pages, we do a standard navigation.
    const isExternalPageLink = href.startsWith('/');
    const finalHref = !isLandingPage && href.startsWith('/#') ? `/${href}` : href;
    
    if (isLandingPage && href.startsWith('/#')) {
         return (
            <a 
                href={href} 
                className="hover:text-indigo-600 transition-colors"
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
            className="hover:text-indigo-600 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
        >
            {label}
        </Link>
    );
  };

  return (
    <header className="px-6 lg:px-20 py-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-[100] border-b border-slate-100 shadow-sm transition-all duration-500">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-indigo-200">
             <span className="text-white text-xl font-black italic">D</span>
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900">DukaanMitra</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-12 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] items-center">
          {navLinks.map(link => <NavLink key={link.href} {...link} />)}
        </nav>

        <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4">
                {!isUserLoading && (
                    <>
                    {user ? (
                        <Button
                            onClick={() => router.push('/dashboard')}
                            className="bg-slate-900 text-white px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-3"
                        >
                            <span>Dashboard</span>
                            <span className="text-lg">➔</span>
                        </Button>
                    ) : (
                        <Button
                            onClick={() => router.push('/dashboard')}
                            className="bg-slate-900 text-white px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-3"
                        >
                            <span>Go to App</span>
                            <span className="text-lg">➔</span>
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
              <SheetHeader>
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <SheetDescription className="sr-only">Navigation links and user actions.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 pt-8">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                    <div className="w-10 h-10 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-indigo-200">
                        <span className="text-white text-xl font-black italic">D</span>
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-slate-900">DukaanMitra</h1>
                </Link>
                <nav className="flex flex-col gap-4 mt-8 text-lg font-medium">
                  {navLinks.map((link) => <NavLink key={link.href} {...link} />)}
                </nav>
                <div className="mt-auto flex flex-col gap-4">
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
                                <Button onClick={() => {router.push('/login?register=true'); setMobileMenuOpen(false);}} variant="outline" size="lg">Sign Up</Button>
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
