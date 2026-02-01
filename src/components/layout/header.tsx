
"use client";

import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useUser, useAuth } from "@/firebase";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const builderLinks = [
    { href: "/guide", label: "A-Z Guide" },
    { href: "/build", label: "Build Protocols" },
    { href: "/assets", label: "Asset Archive" },
    { href: "/architecture", label: "Architecture" },
    { href: "/insights", label: "Insights" },
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

  const NavLink = ({ href, label }: { href: string, label: string }) => {
    return (
        <Link 
            href={href} 
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
        <nav className="hidden lg:flex space-x-8 text-sm font-semibold text-muted-foreground items-center">
          {navLinks.map(link => <NavLink key={link.href} {...link} />)}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors outline-none">
              Builder Zone <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {builderLinks.map(link => (
                    <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
              </SheetHeader>
              <div className="flex flex-col gap-6 pt-8">
                <nav className="flex flex-col gap-4 text-lg font-medium">
                  {navLinks.map((link) => <NavLink key={link.href} {...link} />)}
                  
                  <div className="pt-4 mt-4 border-t border-border">
                    <h3 className="text-sm font-bold text-muted-foreground mb-4">Builder Zone</h3>
                    {builderLinks.map((link) => <NavLink key={link.href} {...link} />)}
                  </div>
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
