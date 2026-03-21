"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MessageCircle, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getPlaceholderImage } from '@/lib/placeholder-images';

export default function LandingPage() {
  const router = useRouter();
  const heroImage = getPlaceholderImage('hero');
  
  useEffect(() => {
    // Dynamic import to avoid SSR issues with Anime.js modules
    (0, eval)('import("https://cdn.jsdelivr.net/npm/animejs/+esm")').then((anime: any) => {
      const { waapi, stagger, onScroll, animate, utils } = anime;

      // Hero character bounce logic
      const heroTitle = utils.$('.hero-title')[0];
      if (heroTitle) {
        const text = heroTitle.innerText;
        heroTitle.innerHTML = text.split('').map((char: string) => 
          `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        waapi.animate('.hero-title span', {
          translateY: [0, -15, 0],
          delay: stagger(50),
          duration: 1200,
          loop: true,
          easing: 'easeOutElastic(1, .6)'
        });
      }

      // Scroll-triggered entry animations
      onScroll({
        targets: '.reveal-section',
        enter: (self: any) => {
          animate(self.target, {
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutQuart'
          });
        }
      });

      // Feature card stagger
      onScroll({
        targets: '.feature-card',
        enter: () => {
          animate('.feature-card', {
            opacity: [0, 1],
            scale: [0.95, 1],
            translateY: [20, 0],
            delay: stagger(100),
            duration: 600,
            easing: 'easeOutBack'
          });
        }
      });
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f] text-white font-sans overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 px-6">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#25D366] rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFC107] rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="container relative z-10 text-center space-y-8 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#25D366]">India's #1 WhatsApp Munim</span>
          </div>

          <h1 className="hero-title font-headline text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter uppercase">
            BILLBOOK FEKO.<br/>
            DUKAAN <span className="text-[#25D366]">SMART</span> BANAO.
          </h1>

          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-xl md:text-2xl font-medium text-white/70">
              WhatsApp se order lo. Udhaar automatic track karo. Roz ka hisaab tension-free.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-white/50">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#25D366]" /> No App Download</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#25D366]" /> 10 Minute Setup</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#25D366]" /> 100% Secure</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold bg-[#25D366] text-black hover:bg-[#25D366]/90 shadow-[0_0_40px_rgba(37,211,102,0.3)] transition-all transform hover:scale-105" asChild>
              <Link href="/dashboard">WhatsApp Se Connect Karo 🚀</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-bold border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md">
              Demo Dekho (30 sec)
            </Button>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section className="reveal-section py-24 px-6 bg-white/5 border-y border-white/10">
        <div className="container max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Kya Aapki Dukaan Me Ye Hota Hai?</h2>
            <p className="text-white/60 text-lg">Har shopkeeper ki asli kahani.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📝", title: "Udhaar bhool jaate ho?", desc: "Register me entry bhool gaye toh paisa gaya. DukaanMitra kabhi nahi bhoolta." },
              { icon: "📱", title: "Reminders me darr lagta hai?", desc: "Customer ko maangne me sharam aati hai? Hum automatic polite reminders bhejte hain." },
              { icon: "🤯", title: "Hisaab me sar-dard?", desc: "Din ke aakhir me galle ka hisaab nahi milta? Hum 1 minute me report dete hain." }
            ].map((item, i) => (
              <Card key={i} className="bg-[#1b1b1b] border-white/5 rounded-[2rem] p-8 hover:border-[#25D366]/30 transition-colors">
                <div className="text-5xl mb-6">{item.icon}</div>
                <CardTitle className="text-2xl font-bold text-white mb-4">{item.title}</CardTitle>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section className="reveal-section py-24 px-6">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="text-[#25D366] font-bold tracking-widest uppercase text-sm">DukaanMitra = Aapka Digital Munim</div>
                <h2 className="font-headline text-5xl md:text-6xl font-black tracking-tight leading-none uppercase">Money Making<br/>Features</h2>
              </div>

              <div className="space-y-8">
                {[
                  { icon: <ShieldCheck className="text-[#25D366]" />, title: "Digital Khata (Automatic)", desc: "Bas WhatsApp par likho 'Ravi 500 udhaar'. Entry khud ho jayegi." },
                  { icon: <Bot className="text-[#FFC107]" />, title: "WhatsApp Salesman (24/7)", desc: "AI aapke customers ko rate aur availability batayega, jab aap so rahe honge tab bhi." },
                  { icon: <TrendingUp className="text-[#25D366]" />, title: "Roz Ka Profit Report", desc: "Har raat report paaiye—kitni sale hui aur kitna udhaar aaya." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-white/60 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-[#25D366]/10 rounded-[3rem] blur-3xl" />
              <div className="relative h-full w-full bg-[#1b1b1b] border border-white/10 rounded-[3rem] p-8 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center font-bold text-black text-xl">K</div>
                  <div>
                    <div className="font-bold">Kumar Kirana Store</div>
                    <div className="text-xs text-[#25D366]">Munim AI Active</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-2xl max-w-[80%] ml-auto text-sm">Rahul 500 udhaar chini</div>
                  <div className="bg-[#25D366]/10 border border-[#25D366]/20 p-4 rounded-2xl max-w-[80%] text-sm flex gap-3">
                    <Bot className="w-5 h-5 text-[#25D366] shrink-0" />
                    <p>Done! ✅ Rahul ka hisaab update ho gaya. Total Udhaar: <span className="font-bold">₹1250</span></p>
                  </div>
                  <div className="pt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="text-xs text-white/40 mb-1">Today's Sale</div>
                      <div className="text-xl font-bold">₹12,500</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="text-xs text-white/40 mb-1">Pending Udhaar</div>
                      <div className="text-xl font-bold text-red-400">₹84,350</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUST SECTION */}
      <section className="reveal-section py-24 px-6 bg-[#25D366] text-black overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <MessageCircle size={400} />
        </div>
        <div className="container max-w-4xl text-center relative z-10 space-y-8">
          <h2 className="font-headline text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Join 500+ Shops In<br/>Kanpur & Lucknow
          </h2>
          <p className="text-xl font-medium max-w-2xl mx-auto opacity-80">
            Digital India ka Digital Munim. Aapki dukaan ki unnati, hamari zimmedari.
          </p>
          <Button size="lg" variant="secondary" className="h-16 px-12 rounded-2xl text-xl font-bold bg-black text-white hover:bg-black/90 transition-transform hover:scale-105" asChild>
            <Link href="/dashboard">Abhi Start Karo <ArrowRight className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black">
        <div className="container max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8 opacity-50 text-sm">
          <div className="font-bold tracking-tighter text-xl">DukaanMitra</div>
          <div>DukaanMitra Technologies Pvt. Ltd. | Built with ❤️ in India</div>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}