
"use client";

import Link from "next/link";
import { ChevronDown, Menu, LogOut, LayoutDashboard, UserCircle, Shield } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useUser, useAuth } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
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
  
  const getAvatarFallback = (email?: string | null) => {
    return email ? email.charAt(0).toUpperCase() : <UserCircle />;
  }

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
        </nav>

        <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-4">
                {!isUserLoading && (
                    <>
                    {user ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'}/>
                                <AvatarFallback>{getAvatarFallback(user.email)}</AvatarFallback>
                              </Avatar>
                              <span>{user.displayName || user.email}</span>
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                              <LayoutDashboard className="mr-2" />
                              Dashboard
                            </DropdownMenuItem>
                            {user.role === 'super_admin' && (
                              <DropdownMenuItem onClick={() => router.push('/super-admin/dashboard')}>
                                <Shield className="mr-2" />
                                Super Admin
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                              <LogOut className="mr-2" />
                              Sign Out
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                </nav>
                <div className="mt-auto flex flex-col gap-4 border-t border-border pt-6">
                    {!isUserLoading && (
                        <>
                        {user ? (
                            <>
                                <Button onClick={() => {router.push('/dashboard'); setMobileMenuOpen(false);}} size="lg">Dashboard</Button>
                                {user.role === 'super_admin' && (
                                  <Button onClick={() => {router.push('/super-admin/dashboard'); setMobileMenuOpen(false);}} size="lg" variant="secondary">Super Admin</Button>
                                )}
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
