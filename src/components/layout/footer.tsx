
"use client";

import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();
  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 lg:col-span-8 space-y-4">
              <Link href="/" className="flex items-center gap-3 cursor-pointer mb-4 w-fit">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground text-2xl font-black">D</span>
                </div>
                <h1 className="text-2xl font-black tracking-tighter text-foreground">DukaanMitra</h1>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                Transform your Kirana shop with India's first AI-powered WhatsApp Munim. No app downloads. Just message and you're done.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Button onClick={() => router.push('#')} size="icon" variant="ghost">
                    <Twitter className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button onClick={() => router.push('#')} size="icon" variant="ghost">
                    <Github className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button onClick={() => router.push('#')} size="icon" variant="ghost">
                    <Linkedin className="h-5 w-5 text-muted-foreground" />
                </Button>
            </div>
          </div>
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider">Links</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/insights" className="hover:text-primary transition-colors">Insights</Link></li>
            </ul>
          </div>
           <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider">About</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="/docs" className="hover:text-primary transition-colors">Docs</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
               <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 md:mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DukaanMitra. Built with Next.js and ❤️ in India.</p>
        </div>
      </div>
    </footer>
  );
}
