"use client";

import { Link, useRouter, usePathname } from "@/i18n/routing";
import { ChevronDown, Menu, LogOut, LayoutDashboard, UserCircle, Shield } from "lucide-react";
import { useState } from "react";

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
import { ThemeToggle } from "../theme-toggle";
import LocaleSwitcher from "../i18n/locale-switcher";

const navLinks = [
  { href: "/features", label: "AI Modules" },
  { href: "/insights", label: "Intelligence" },
  { href: "/pricing", label: "Plans" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/blog", label: "Blog" },
];

const IS_PUBLIC_ONLY = true;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
    }
    router.push('/');
  };

  const NavLink = ({ href, label }: { href: string, label: string }) => {
    return (
        <Link 
            href={href as any} 
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
    <header className="px-6 lg:px-8 py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-[100] transition-all duration-300 glass-dark border-none">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg glow-primary">
             <span className="text-black text-2xl font-black">M</span>
          </div>
          <div className="flex flex-col leading-tight">
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase">MitraOS</h1>
            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary">Powered by DukaanMitra</span>
          </div>
        </Link>
        
        <nav className="hidden lg:flex space-x-8 text-sm font-semibold text-muted-foreground items-center">
          {navLinks.map(link => <NavLink key={link.href} {...link} />)}
        </nav>

        <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-4">
                {!IS_PUBLIC_ONLY && !isUserLoading && (
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
                            <DropdownMenuLabel>Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                              <LayoutDashboard className="mr-2" />
                              Dashboard
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                              <LogOut className="mr-2" />
                              Sign Out
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button onClick={() => router.push('/login')}>
                            <span>Enter MitraOS</span>
                        </Button>
                    )}
                    </>
                )}
                 <LocaleSwitcher />
                 <ThemeToggle />
            </div>

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
                            <span className="text-primary-foreground text-2xl font-black">M</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-foreground">MitraOS</h1>
                    </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 pt-8">
                <nav className="flex flex-col gap-4 text-lg font-medium">
                  {navLinks.map((link) => <NavLink key={link.href} {...link} />)}
                </nav>
                <div className="mt-auto flex flex-col gap-4 border-t border-border pt-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Language</span>
                        <LocaleSwitcher />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Appearance</span>
                        <ThemeToggle />
                    </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
    </header>
  );
}
