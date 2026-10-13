'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Bot, 
  LayoutGrid, 
  FileText 
} from 'lucide-react';

export function MunimFlow() {
  const steps = [
    { title: "Smart Ingress", desc: "Shopkeeper types 'Rahul 500 Chini' in WhatsApp.", icon: <MessageCircle className="w-8 h-8" />, color: "bg-indigo-600", tech: "WhatsApp API + NLP", detail: "99.9% extraction accuracy." },
    { title: "AI Reasoning", desc: "Munim AI parses the message: Customer, Amount, and Item extraction.", icon: <Bot className="w-8 h-8" />, color: "bg-emerald-600", tech: "Gemini / BERT", detail: "Handles slang and local dialects." },
    { title: "Ledger Update", desc: "Transaction is logged in digital ledger automatically.", icon: <LayoutGrid className="w-8 h-8" />, color: "bg-blue-600", tech: "Firebase Realtime", detail: "0.5s latency sync." },
    { title: "Auto Statement", desc: "Customer gets receipt. Shopkeeper gets EOD reports.", icon: <FileText className="w-8 h-8" />, color: "bg-amber-600", tech: "Automated Triggers", detail: "Reduces math time by 95%." },
  ];

  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="container px-6 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 text-gradient">
            The Munim Flow
          </h2>
          <p className="text-primary font-bold tracking-widest uppercase text-sm">
            End-to-End Digital Transformation
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-white/10 -z-0" />
          
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center space-y-8"
            >
              <div className={`w-24 h-24 rounded-[2.5rem] ${step.color} shadow-2xl flex items-center justify-center text-white transform hover:scale-110 hover:rotate-6 transition-all duration-500`}>
                {step.icon}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-3xl font-black italic tracking-tighter uppercase">{step.title}</h3>
                <p className="text-muted-foreground text-sm font-medium italic">"{step.desc}"</p>
                <div className="pt-4 space-y-2">
                  <p className="text-primary text-[10px] font-black uppercase tracking-widest">{step.detail}</p>
                  <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white/50">
                    {step.tech}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
