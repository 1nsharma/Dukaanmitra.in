'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useRouter } from '@/i18n/routing';
import { Zap, ArrowRight } from 'lucide-react';
import { WhatsAppSimulation } from './whatsapp-simulation';

export const LandingHero = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      
      <div className="container relative z-10 px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
            >
              <Zap size={14} className="text-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                AAPKA DIGITAL MUNIM INDIA #1
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] uppercase mb-10 text-gradient italic">
              Best Dukaan <br/>
              <span className="text-primary">Management App</span> <br/>
              for India
            </h1>
            
            <p className="max-w-xl text-lg md:text-xl text-muted-foreground font-medium mb-12 leading-relaxed">
              Transform your Kirana shop with India's first AI-powered WhatsApp Munim. 
              <span className="text-white"> No app downloads. </span> 
              Just message "Rahul 500" and you're done.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <Button size="lg" className="h-20 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-black font-black uppercase group transition-all glow-primary text-xl" asChild>
                <Link href="/login" className="flex items-center gap-3">
                  START MANAGING DUKAAN
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-20 px-10 rounded-2xl border-white/10 hover:bg-white/5 font-black uppercase backdrop-blur-sm text-xl" onClick={() => router.push('/demo')}>
                VIEW DEMO 📊
              </Button>
            </div>

            <div className="mt-16 flex items-center gap-8 grayscale opacity-30">
              <span className="text-xs font-bold tracking-widest uppercase text-white/50">Trusted by 10k+ Shops</span>
              <div className="h-px w-20 bg-white/10" />
              <div className="flex gap-6 font-black italic text-sm">
                <span>UP KIRANA</span>
                <span>DELHI RETAIL</span>
                <span>MUMBAI FOOD</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative perspective-1000 hidden lg:block"
          >
            <div className="relative z-20 w-[420px] mx-auto h-[700px] rounded-[3.5rem] border-[12px] border-slate-800 shadow-2xl overflow-hidden bg-slate-900">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-900 rounded-b-3xl z-30 flex items-center justify-center">
                 <div className="w-14 h-1 bg-slate-800 rounded-full" />
              </div>
              
              <WhatsAppSimulation />
            </div>

            {/* Decorative Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 glass p-6 rounded-[2rem] z-30 shadow-2xl border-primary/20"
            >
              <div className="text-primary font-black text-3xl tracking-tighter">INR 12,500</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Today's Sales</div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 glass p-6 rounded-[2rem] z-30 shadow-2xl border-blue-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <div className="text-white font-black text-xs uppercase tracking-[0.2em]">AI Parsing Active</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
