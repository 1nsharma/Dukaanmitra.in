'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export function ProblemSolver() {
  const problems = [
    { problem: "Udhaar ka hisaab kaise rakhe?", icon: "📉", cta: "Manage Khaata" },
    { problem: "Daily Sales record nahi ho rahi?", icon: "📊", cta: "Setup Sales Tracker" },
    { problem: "WhatsApp se order kaise le?", icon: "📱", cta: "Start WhatsApp Shop" }
  ];

  return (
    <section className="py-32 container px-6 relative">
      <div className="text-center mb-24">
        <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 text-gradient">
          What problem can I solve <br/> for you today?
        </h2>
        <p className="text-primary font-bold tracking-widest uppercase text-sm">
          Stop searching for features, start finding solutions.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {problems.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-12 flex flex-col items-center text-center space-y-8 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-500 group"
          >
            <div className="text-8xl group-hover:scale-110 transition-transform duration-500">{p.icon}</div>
            <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-tight">{p.problem}</h3>
            <Button 
              className="w-full h-16 rounded-2xl font-black uppercase text-lg italic glow-primary"
              asChild
            >
              <Link href="/login">
                {p.cta} ➔
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
