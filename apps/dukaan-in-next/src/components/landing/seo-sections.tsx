'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function Founder() {
  return (
    <section className="py-32 container px-6">
      <div className="grid lg:grid-cols-2 gap-24 items-center">
        <div className="relative">
          <motion.div 
            initial={{ rotate: 3 }}
            whileHover={{ rotate: 0 }}
            className="w-full aspect-video bg-white/5 rounded-[4rem] flex items-center justify-center shadow-2xl border-8 border-[#050505] overflow-hidden group relative"
          >
            <div className="text-center space-y-6 p-12">
              <div className="w-24 h-24 bg-primary rounded-full mx-auto flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform">
                ✍️
              </div>
              <h3 className="text-3xl font-black italic text-white tracking-tighter uppercase">A Message from the Founder</h3>
              <div className="w-20 h-1 bg-primary mx-auto" />
            </div>
          </motion.div>
          <motion.div 
            initial={{ rotate: -3 }}
            className="absolute -bottom-10 -right-10 bg-primary text-black p-10 rounded-[3rem] shadow-2xl"
          >
            <p className="text-4xl font-black italic tracking-tighter">Amit Sharma</p>
            <p className="text-xs font-black uppercase tracking-widest opacity-60">Founder, DukaanMitra</p>
          </motion.div>
        </div>

        <div className="space-y-10">
          <div className="inline-flex items-center space-x-3 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            Meet the Visionary
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter italic leading-none uppercase">Empowering <br/> Bharat's Retailers</h2>
          <p className="text-2xl text-muted-foreground font-bold italic leading-relaxed">
            "My mission is to bring the power of AI to every Kirana store in India. No complex apps, just the simplicity of WhatsApp to manage your business with intelligence."
          </p>
          <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-10">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">WhatsApp Business</p>
              <p className="text-xl font-black italic text-white">+91 63937 41171</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</p>
              <p className="text-xl font-black italic text-white">amit@dukaanmitra.in</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SEOContent() {
  return (
    <section className="py-32 bg-white/[0.01] border-y border-white/5">
      <div className="container px-6 max-w-4xl mx-auto space-y-16">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white leading-tight">
            DukaanMitra – AI-Powered Shop Management for Indian Retailers
          </h2>
          <div className="prose prose-invert max-w-none text-muted-foreground font-medium italic leading-relaxed space-y-6">
            <p>
              In the rapidly evolving landscape of Indian retail, managing a traditional kirana store or a small business requires more than just a bahi-khata. 
              <strong> DukaanMitra</strong> is designed to be your ultimate <strong>AI shop management tool</strong>, specifically built for the unique needs of 
              Indian दुकानदार. Whether you are in a bustling metro or a Tier 2 city like Lucknow or Kanpur, our platform empowers you to 
              <strong> automate dukaan tasks</strong> and transition into the digital age.
            </p>
            <p>
              Why is DukaanMitra considered the <strong>best dukaan management app</strong>? It's because we understand that your time is valuable. 
              Instead of spending hours on manual entries, our <strong>AI-powered WhatsApp Munim</strong> allows you to log sales, track inventory, 
              and manage udhaar by simply sending a message. This <strong>retail management software in India</strong> is not just an app; 
              it's a comprehensive <strong>CRM for Indian retailers</strong> that lives where you already are—on WhatsApp.
            </p>
            <h3 className="text-2xl font-black italic text-white uppercase mt-12">How to Manage Small Shop Digitally with AI</h3>
            <p>
              Many shop owners ask, <em>"Dukaan ka hisaab kaise rakhe app?"</em> The answer lies in simplicity and intelligence. 
              DukaanMitra uses advanced Natural Language Processing (NLP) to understand your business language. When you type 
              "Rahul 500 Chini", our AI automatically identifies the customer (Rahul), the amount (₹500), and the item (Sugar/Chini).
            </p>
            <p>
              Our <strong>small business automation in India</strong> initiative aims to bridge the digital divide. By providing 
              <strong>kirana store software</strong> that requires zero training, we ensure that every merchant can benefit from 
              <strong>AI retail analytics</strong>. You get daily reports on your sales, pending udhaar, and stock alerts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
