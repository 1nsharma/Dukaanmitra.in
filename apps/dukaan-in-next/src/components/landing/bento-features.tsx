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
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';

export function BentoFeatures() {
  const t = useTranslations('LandingPage');

  const features = [
    {
      id: "whatsapp",
      icon: <MessageCircle className="w-8 h-8 text-mercantile-mint" />,
      size: "lg",
      label: "01"
    },
    {
      id: "aimunim",
      icon: <Bot className="w-8 h-8 text-blue-500" />,
      size: "md",
      label: "02"
    },
    {
      id: "ledger",
      icon: <LayoutGrid className="w-8 h-8 text-mercantile-gold" />,
      size: "md",
      label: "03"
    },
    {
      id: "reports",
      icon: <Zap className="w-8 h-8 text-purple-500" />,
      size: "lg",
      label: "04"
    }
  ];

  return (
    <section className="py-32 container px-6 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-zinc-200 dark:border-zinc-800 pb-12">
        <div className="max-w-2xl">
          <div className="text-[10px] font-mono-ledger font-bold uppercase tracking-[0.4em] text-secondary mb-4">
            Industrial Grade Features
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-medium tracking-tight leading-[0.9]">
            {t.rich('features.title', {
              span: (chunks) => <span className="text-secondary italic">{chunks}</span>
            })}
          </h2>
        </div>
        <p className="text-muted-foreground max-w-sm text-lg leading-relaxed italic border-l-2 border-zinc-200 dark:border-zinc-800 pl-6">
          Powering the next generation of Indian retail with modular AI intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[350px]">
        {features.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
            className={`
              group relative overflow-hidden ledger-card p-10
              ${f.size === 'lg' ? 'md:col-span-2' : 'md:col-span-1'}
            `}
          >
            {/* Number Label */}
            <div className="absolute top-8 right-8 font-mono-ledger text-[10px] font-bold text-muted-foreground/30 group-hover:text-secondary transition-colors">
              [{f.label}]
            </div>
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-fit group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors">
                {f.icon}
              </div>
              
              <div className="mt-auto">
                <h3 className="text-3xl font-display font-medium mb-4 group-hover:text-secondary transition-colors">
                  {t(`features.items.${f.id}.title`)}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm font-medium line-clamp-3">
                  {t(`features.items.${f.id}.desc`)}
                </p>
              </div>
              
              <div className="mt-6 flex items-center gap-2 text-[10px] font-mono-ledger font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                Explore Tech <ArrowUpRight size={12} />
              </div>
            </div>

            {/* Subtle Grid Background for Card */}
            <div className="absolute inset-0 grid-pattern opacity-[0.05] -z-10" />
          </motion.div>
        ))}
        
        {/* Verification / Data Security Card */}
        <div className="md:col-span-1 p-10 ledger-card flex flex-col justify-between border-dashed bg-zinc-50/50 dark:bg-zinc-900/50">
          <ShieldCheck className="w-10 h-10 text-mercantile-mint" />
          <div>
            <h4 className="font-display text-xl mb-2">Sovereign Data</h4>
            <p className="text-xs text-muted-foreground font-mono-ledger leading-loose">
              SECURE_VAULT_ACTIVE<br/>
              END_TO_END_ENCRYPTED<br/>
              LOCALLY_STORED_INDIA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
