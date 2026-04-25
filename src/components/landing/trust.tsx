'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export function Trust() {
  const testimonials = [
    { name: "Rajesh", shop: "Kirana Store Owner, Kanpur", quote: "DukaanMitra ne mere 4 ghante ka kaam 10 minute ka kar diya. Ab WhatsApp pe hi sab ho jaata hai!", icon: "👨‍🌾" },
    { name: "Suresh", shop: "General Store, Lucknow", quote: "Udhaar mangne mein sharam aati thi, ab Munim AI apne aap reminder bhej deta hai. Paisa time pe mil raha hai.", icon: "🏪" },
    { name: "Meena", shop: "Dairy Booth, Delhi", quote: "Inventory management ab bahut asaan hai. WhatsApp pe hi pata chal jata hai kya khatam ho raha hai.", icon: "🥛" },
  ];

  return (
    <section className="py-32 container px-6">
      <div className="text-center mb-24">
        <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 text-gradient">
          Shopkeeper Stories
        </h2>
        <p className="text-primary font-bold tracking-widest uppercase text-sm">
          Trusted by 10,000+ Kirana Stores
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all duration-500 relative group"
          >
            <Quote className="absolute top-8 left-8 text-primary/10 w-16 h-16 group-hover:text-primary/20 transition-colors" />
            
            <p className="text-2xl font-black italic tracking-tight text-white leading-tight relative z-10 pt-12 mb-10">
              "{t.quote}"
            </p>
            
            <div className="flex items-center gap-5 pt-8 border-t border-white/5">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-4xl shadow-xl italic">
                {t.icon}
              </div>
              <div>
                <p className="text-xl font-black italic tracking-tight text-white leading-none mb-1">{t.name}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">{t.shop}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
