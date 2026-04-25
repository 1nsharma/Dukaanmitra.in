'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  MessageCircle, 
  Bot, 
  LayoutGrid, 
  Zap, 
  Smartphone, 
  ShieldCheck 
} from 'lucide-react';

export function BentoFeatures() {
  const t = useTranslations('LandingPage');

  const features = [
    {
      id: "whatsapp",
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      size: "lg",
      gradient: "from-primary/20 to-transparent"
    },
    {
      id: "aimunim",
      icon: <Bot className="w-8 h-8 text-blue-500" />,
      size: "md",
      gradient: "from-blue-500/20 to-transparent"
    },
    {
      id: "ledger",
      icon: <LayoutGrid className="w-8 h-8 text-amber-500" />,
      size: "md",
      gradient: "from-amber-500/20 to-transparent"
    },
    {
      id: "reports",
      icon: <Zap className="w-8 h-8 text-purple-500" />,
      size: "lg",
      gradient: "from-purple-500/20 to-transparent"
    }
  ];

  return (
    <section className="py-32 container px-6">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
          {t.rich('features.title', {
            span: (chunks) => <span className="text-primary">{chunks}</span>
          })}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Powering the next generation of Indian retail with modular AI intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
        {features.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`
              group relative overflow-hidden rounded-[2.5rem] p-8 glass-dark hover:border-primary/30 transition-all duration-500
              ${f.size === 'lg' ? 'md:col-span-2' : 'md:col-span-1'}
            `}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-6 p-3 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-500">
                {f.icon}
              </div>
              
              <div className="mt-auto">
                <h3 className="text-2xl font-black uppercase mb-3 tracking-tight">
                  {t(`features.items.${f.id}.title`)}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {t(`features.items.${f.id}.desc`)}
                </p>
              </div>
            </div>

            {/* Decorative element for large cards */}
            {f.size === 'lg' && (
              <div className="absolute top-1/2 right-[-10%] translate-y-[-50%] opacity-10 group-hover:opacity-20 transition-opacity">
                {f.icon}
              </div>
            )}
          </motion.div>
        ))}
        
        {/* Extra dynamic cards */}
        <div className="md:col-span-1 p-8 glass-dark rounded-[2.5rem] flex flex-col justify-center items-center text-center border-dashed border-white/10">
          <ShieldCheck className="w-12 h-12 text-emerald-500 mb-4 animate-pulse" />
          <h4 className="font-bold uppercase text-sm tracking-widest mb-2">Sovereign Data</h4>
          <p className="text-xs text-muted-foreground">End-to-end encrypted locally in India.</p>
        </div>
      </div>
    </section>
  );
}
