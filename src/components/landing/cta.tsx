'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function LandingCTA() {
  const t = useTranslations('LandingPage');

  return (
    <section className="py-40 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/20 blur-[150px] rounded-full opacity-50" />
      <div className="noise absolute inset-0 opacity-[0.03]" />

      <div className="container relative z-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-12 text-gradient">
            {t.rich('cta.title', {
              span: (chunks) => <span className="text-primary">{chunks}</span>
            })}
          </h2>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button 
              size="lg" 
              className="h-24 px-16 rounded-full bg-primary hover:bg-primary/90 text-black font-black uppercase text-2xl md:text-4xl shadow-heavy glow-primary transition-all"
              asChild
            >
              <Link href="/login">
                {t('cta.button')}
              </Link>
            </Button>
          </motion.div>

          <div className="mt-16 flex flex-col items-center gap-4">
            <div className="px-4 py-2 rounded-full glass text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80 border-primary/20">
              {t('cta.security')}
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 opacity-20 grayscale mt-8 font-black uppercase italic text-sm">
              <span>Hyperlocal AI</span>
              <span>Cloud Ledger</span>
              <span>WhatsApp Native</span>
              <span>100% Offline Compatible</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
