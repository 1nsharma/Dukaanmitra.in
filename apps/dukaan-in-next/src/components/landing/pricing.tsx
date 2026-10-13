'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export function Pricing() {
  const plans = [
    { name: "Khata Basic", price: "Free", features: ["100 transactions/mo", "Basic udhaar tracking", "WhatsApp reports"], bestFor: "New shops adopting digital." },
    { name: "Merchant Pro", price: "₹299", features: ["Unlimited transactions", "Inventory alerts", "Google Business Setup", "GST-Ready Billing"], bestFor: "Growing kiranas aiming for more footfall." },
    { name: "Growth + Supply", price: "₹899", features: ["Advanced FMCG analytics", "B2B Supply chain leads", "Google Cloud Backup", "Distributor Referrals"], bestFor: "Established stores wanting to optimize procurement.", popular: true }
  ];

  return (
    <section className="py-32 container px-6">
      <div className="text-center mb-24">
        <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 text-gradient">
          Simple Pricing
        </h2>
        <p className="text-primary font-bold tracking-widest uppercase text-sm">
          Transparent & Scalable Plans
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`
              relative p-10 rounded-[3rem] flex flex-col border transition-all duration-500
              ${p.popular ? 'bg-white/5 border-primary shadow-2xl scale-105 z-10' : 'bg-white/[0.02] border-white/10 hover:border-white/20'}
            `}
          >
            {p.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-black uppercase px-4 py-1 rounded-full">
                Most Popular
              </div>
            )}

            <div className="mb-10">
              <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4 opacity-50">{p.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter text-white">{p.price}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase italic">/month</span>
              </div>
            </div>

            <div className="flex-1 space-y-6 mb-12">
              {p.features.map((feat, j) => (
                <div key={j} className="flex items-center gap-4">
                  <div className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-sm font-medium text-white/80 italic">{feat}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-8">
              <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 italic">
                <p className="text-[9px] font-black uppercase tracking-widest text-primary/60 mb-2">Mission Fit</p>
                <p className="text-xs font-medium tracking-tight leading-relaxed">{p.bestFor}</p>
              </div>
              <Button 
                variant={p.popular ? "default" : "outline"} 
                className={`w-full h-16 rounded-2xl font-black uppercase text-lg italic ${p.popular ? 'glow-primary' : ''}`}
              >
                CHOOSE PLAN
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-center mt-12 text-muted-foreground font-bold italic opacity-40">
        Note: All plans include free onboarding and 24/7 WhatsApp support.
      </p>
    </section>
  );
}
