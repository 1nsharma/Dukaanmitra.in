'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { HelpCircle, ArrowRight } from 'lucide-react';

export function ProblemSolver() {
  const problems = [
    { problem: "Udhaar ka hisaab kaise rakhe?", icon: "01", cta: "Manage Khaata" },
    { problem: "Daily Sales record nahi ho rahi?", icon: "02", cta: "Setup Sales Tracker" },
    { problem: "WhatsApp se order kaise le?", icon: "03", cta: "Start WhatsApp Shop" }
  ];

  return (
    <section className="py-32 container px-6 relative">
      <div className="flex flex-col items-center text-center mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border-l-2 border-secondary mb-6">
          <HelpCircle size={14} className="text-secondary" />
          <span className="text-[10px] font-mono-ledger font-bold uppercase tracking-[0.4em] text-foreground/70">
            Industrial Solutions
          </span>
        </div>
        <h2 className="text-5xl md:text-8xl font-display font-medium tracking-tight leading-[0.85] mb-8 text-foreground max-w-4xl">
          What problem can we <br/>
          <span className="text-secondary italic">solve</span> for you today?
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-0 border border-zinc-200 dark:border-zinc-800">
        {problems.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-12 flex flex-col items-start text-left space-y-8 bg-white dark:bg-zinc-950 border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-500 group relative"
          >
            <div className="font-mono-ledger text-[10px] font-bold text-muted-foreground/30 group-hover:text-secondary transition-colors">
              QUERY_UID_{p.icon}
            </div>
            <h3 className="text-3xl font-display font-medium leading-tight group-hover:translate-x-2 transition-transform">{p.problem}</h3>
            <Button 
              variant="link"
              className="px-0 text-secondary font-mono-ledger font-bold uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all"
              asChild
            >
              <Link href="/login" className="flex items-center gap-2">
                {p.cta} <ArrowRight size={14} />
              </Link>
            </Button>
            
            {/* Corner Detail */}
            <div className="absolute bottom-4 right-4 w-2 h-2 border-r border-b border-zinc-200 dark:border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
