
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
            <div className="glass-dark rounded-[3rem] p-12 md:p-20 flex flex-wrap justify-between gap-12 items-center">
              {[
                { label: "Active Shops", val: "10,000+", sub: "Growing daily" },
                { label: "Ledger Entries", val: "INR 500Cr+", sub: "Processed safely" },
                { label: "Language Support", val: "12+", sub: "Local dialects" },
                { label: "Uptime", val: "99.9%", sub: "Enterprise grade" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-4xl md:text-6xl font-black tracking-tighter text-primary">{stat.val}</span>
                  <span className="text-xs font-bold uppercase tracking-widest mt-2">{stat.label}</span>
                  <span className="text-[10px] text-muted-foreground uppercase mt-1">{stat.sub}</span>
                </div>
              ))}
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
