
"use client";

import Link from 'next/link';
import { Twitter, Github, Linkedin, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Footer() {
  const router = useRouter();
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 lg:col-span-6 space-y-4">
              <Link href="/" className="flex items-center gap-3 cursor-pointer mb-4 w-fit">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground text-2xl font-black">D</span>
                </div>
                <h1 className="text-2xl font-black tracking-tighter text-foreground">DukaanMitra</h1>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                DukaanMitra is an AI-first company dedicated to empowering local businesses in India with simple, powerful digital tools. We believe in growth for everyone.
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
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider">Links</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/insights" className="hover:text-primary transition-colors">Insights</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
            </ul>
          </div>
           <div className="md:col-span-2 lg:col-span-2">
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
           <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Form</Link></li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>+91 12345 67890</span>
              </li>
               <li className="flex items-center gap-2">
                <span>support@dukaanmitra.ai</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 md:mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {year || new Date().getFullYear()} DukaanMitra Technologies Pvt. Ltd. Built with ❤️ in India.</p>
        </div>
      </div>
    </footer>
  );
}
