'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useRouter } from '@/i18n/routing';
import { ArrowRight, ScrollText, CheckCircle2 } from 'lucide-react';
import { WhatsAppSimulation } from './whatsapp-simulation';

export const LandingHero = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-[100vh] lg:min-h-screen flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden selection:bg-mercantile-gold/30 selection:text-mercantile-ink">
      
      <div className="container relative z-10 px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-4 items-center">
          
          {/* Left Content Column - 7 Columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Tagline */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-3 px-3 py-1 border-l-2 border-secondary/50 bg-secondary/5"
            >
              <ScrollText size={14} className="text-secondary" />
              <span className="text-[10px] font-mono-ledger font-bold uppercase tracking-[0.4em] text-foreground/70">
                The Digital Manual Book
              </span>
            </motion.div>
            
            {/* Headline */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-medium tracking-tight leading-[0.85] mb-8 text-foreground">
              Modern <br/>
              <span className="text-secondary italic">Mercantile</span> <br/>
              Intelligence.
            </h1>
            
            {/* Sub-headline */}
            <div className="max-w-xl mb-12 border-l-2 border-zinc-200 dark:border-zinc-800 pl-8">
              <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
                Transform your Kirana shop with India's first AI-powered WhatsApp Munim. 
                <span className="text-foreground block mt-2">No app downloads. No learning curve. Just efficiency.</span>
              </p>
            </div>
            
            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button 
                size="lg" 
                className="h-16 px-8 rounded-sm bg-mercantile-ink dark:bg-mercantile-paper text-mercantile-paper dark:text-mercantile-ink font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95" 
                asChild
              >
                <Link href="/login" className="flex items-center gap-3">
                  Start Managing
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-16 px-8 rounded-sm border-2 border-mercantile-ink/10 dark:border-white/10 hover:bg-mercantile-ink/5 font-bold uppercase tracking-widest"
                onClick={() => router.push('/demo')}
              >
                View Ledger 📊
              </Button>
            </div>

            {/* Industrial Trust Bar */}
            <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-mercantile-mint" />
                <span className="text-[10px] font-mono-ledger font-bold uppercase tracking-widest">10,000+ Active Shops</span>
              </div>
              <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
              <div className="flex gap-6 text-[10px] font-mono-ledger font-bold uppercase tracking-[0.2em] opacity-40">
                <span>UP</span>
                <span>Delhi</span>
                <span>Mumbai</span>
                <span>Gujarat</span>
              </div>
            </div>
          </motion.div>

          {/* Right Simulation Column - 5 Columns */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative z-20 w-full max-w-[380px] mx-auto aspect-[9/18] ledger-card rounded-[2rem] p-4 bg-zinc-50 dark:bg-zinc-950">
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden bg-white dark:bg-black relative">
                <WhatsAppSimulation />
              </div>
              
              {/* Floating Industrial Details */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white dark:bg-zinc-900 border-2 border-mercantile-ink p-4 shadow-2xl z-30 min-w-[160px]"
              >
                <div className="text-[10px] font-mono-ledger uppercase text-muted-foreground mb-1">Entry Confirmed</div>
                <div className="font-display text-2xl text-mercantile-ink dark:text-mercantile-paper">₹12,500.00</div>
              </motion.div>

              <div className="absolute -bottom-6 -left-6 bg-mercantile-gold p-3 shadow-2xl z-30">
                <div className="text-[10px] font-mono-ledger font-bold text-mercantile-ink uppercase tracking-tighter">Verified Merchant</div>
              </div>
            </div>
            
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-secondary/5 rounded-full blur-[100px] -z-10" />
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};
