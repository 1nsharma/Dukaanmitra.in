
'use client';

import React from 'react';
import { Background } from '@/components/landing/background';
import { LandingHero } from '@/components/landing/hero';
import { BentoFeatures } from '@/components/landing/bento-features';
import { LandingCTA } from '@/components/landing/cta';
import { ProblemSolver } from '@/components/landing/problem-solver';
import { MunimFlow } from '@/components/landing/munim-flow';
import { Pricing } from '@/components/landing/pricing';
import { Trust } from '@/components/landing/trust';
import { Founder, SEOContent } from '@/components/landing/seo-sections';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative min-h-screen text-white selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Global Background */}
      <Background />

      {/* Content Sections */}
      <div className="relative z-10">
        <LandingHero />
        
        <div className="space-y-32 pb-32">
          <BentoFeatures />
          
          <ProblemSolver />

          <MunimFlow />


          {/* Stats Section */}
          <div className="container px-6">
            <div className="ledger-card p-12 md:p-20 flex flex-wrap justify-between gap-12 items-center bg-zinc-50 dark:bg-zinc-950">
              {[
                { label: "Active Shops", val: "10,000+", sub: "Verified Merchants" },
                { label: "Ledger Entries", val: "₹500Cr+", sub: "Total Volume" },
                { label: "Language Support", val: "12+", sub: "Indic Dialects" },
                { label: "Precision", val: "99.9%", sub: "AI Extraction Rate" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-4xl md:text-7xl font-display font-medium tracking-tighter text-secondary">{stat.val}</span>
                  <span className="text-[10px] font-mono-ledger font-bold uppercase tracking-widest mt-4 text-foreground/80">{stat.label}</span>
                  <span className="text-[10px] font-mono-ledger text-muted-foreground uppercase mt-1 opacity-50">{stat.sub}</span>
                </div>
              ))}
              
              {/* Background Detail */}
              <div className="absolute inset-0 grid-pattern opacity-[0.05] pointer-events-none" />
            </div>
          </div>


          <Pricing />

          <Trust />

          <Founder />

          <SEOContent />

          <LandingCTA />
        </div>
      </div>
    </main>
  );
}
