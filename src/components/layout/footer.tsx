
"use client";

import Link from 'next/link';
import { Twitter, MessageSquare, ShieldCheck, Zap, Globe } from 'lucide-react';
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
    <footer className="relative bg-[#050505] border-t border-white/5 overflow-hidden">
      <div className="noise absolute inset-0 opacity-[0.03]" />
      <div className="container py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-4 space-y-6">
              <Link href="/" className="flex items-center gap-3 cursor-pointer mb-4 w-fit">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg glow-primary">
                  <span className="text-black text-2xl font-black">D</span>
                </div>
                <h1 className="text-2xl font-black tracking-tighter text-white uppercase">DukaanMitra</h1>
              </Link>
              <p className="text-muted-foreground text-sm max-w-sm font-medium leading-relaxed">
                Empowering India's Kirana stores with deterministic AI intelligence. The Digital Manual Book for the modern shopkeeper.
              </p>
              
              {/* Trust Badges in Footer */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-white/5 p-2 rounded-lg glass-dark">
                      <ShieldCheck size={14} className="text-primary"/> 100% Private
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-white/5 p-2 rounded-lg glass-dark">
                      <Globe size={14} className="text-primary"/> Made in India
                  </div>
              </div>

              <div className="space-y-2 pt-4">
                <h4 className="font-bold text-foreground uppercase tracking-widest text-xs">Community</h4>
                <div className="flex items-center gap-1">
                    <Button onClick={() => router.push('#')} size="icon" variant="ghost" className="hover:text-primary">
                        <Twitter className="h-5 w-5" />
                    </Button>
                    <Button onClick={() => router.push('#')} size="icon" variant="ghost" className="hover:text-primary">
                        <MessageSquare className="h-5 w-5" />
                    </Button>
                </div>
              </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider text-xs">Product</h4>
            <ul className="space-y-3 text-muted-foreground text-sm font-medium">
              <li><Link href="/features" className="hover:text-primary transition-colors">AI Modules</Link></li>
              <li><Link href="/insights" className="hover:text-primary transition-colors">Intelligence</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider text-xs">Resources</h4>
            <ul className="space-y-3 text-muted-foreground text-sm font-medium">
              <li><Link href="/docs" className="hover:text-primary transition-colors">Guides</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/manifesto" className="hover:text-primary transition-colors">Manifesto</Link></li>
            </ul>
          </div>
           
           <div className="md:col-span-2">
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-3 text-muted-foreground text-sm font-medium">
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Pledge</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

           <div className="md:col-span-2">
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider text-xs">Support</h4>
            <ul className="space-y-3 text-muted-foreground text-sm font-medium">
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="font-bold">+91 12345 67890</span>
              </li>
               <li className="flex items-center gap-2 truncate">
                <span className="font-bold">support@dukaanmitra.ai</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 md:mt-16 border-t border-white/5 pt-8 text-center text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
          <p>&copy; {year} MitraOS Technologies. Built with ❤️ for Bharat.</p>
        </div>
      </div>
    </footer>
  );
}
