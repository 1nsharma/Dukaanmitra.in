'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Cpu, Shield, TrendingUp, Users, ArrowRight, Zap, Bot, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container px-6 py-24 lg:py-32 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="inline-flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Cpu size={14} className="text-primary animate-pulse" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">MitraOS: The AI Operating System</span>
            </div>
            <h1 className="font-headline text-6xl md:text-8xl font-black leading-none tracking-tighter uppercase">
              The Intelligence <br/>
              <span className="text-primary text-outline">Layer for SMBs</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
              DukaanMitra is the first application built on MitraOS. 
              A WhatsApp-native "Digital Munim" that automates accounting, inventory, and growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="h-16 px-8 rounded-full font-black text-xl uppercase tracking-tight shadow-xl"
                asChild
              >
                <Link href="/pricing">Get Started <ArrowRight className="ml-2" /></Link>
              </Button>
              <Button 
                variant="secondary"
                size="lg"
                className="h-16 px-8 rounded-full font-black text-xl uppercase tracking-tight"
                asChild
              >
                <Link href="/manifesto">The Manifesto 📜</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10 pointer-events-none">
            <Bot size={600} className="text-primary rotate-12" />
        </div>
      </section>

      {/* AI Modules Section */}
      <section className="py-24 bg-card/50">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="p-8 bg-background rounded-3xl border border-border space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Shield size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">Munim AI</h3>
              <p className="text-muted-foreground">Deterministic accounting. Your AI Accountant for GST, Billing, and Udhaar recovery via WhatsApp.</p>
            </div>
            <div className="p-8 bg-background rounded-3xl border border-border space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-accent">Vyapar AI</h3>
              <p className="text-muted-foreground">The AI Salesman. Proactive inventory predictions and revenue growth analytics for the shop owner.</p>
            </div>
            <div className="p-8 bg-background rounded-3xl border border-border space-y-4">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-success">Grahak AI</h3>
              <p className="text-muted-foreground">Loyalty automation. Segment customers, send personalized offers, and recover churned buyers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Positioning Quote */}
      <section className="py-32 text-center bg-primary text-primary-foreground">
        <div className="container max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
            "Software shouldn't feel like work. It should feel like a partner."
          </h2>
          <p className="text-xl font-bold uppercase tracking-widest opacity-80">— Amit Sharma, Founder</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
        <div className="container">
          <Zap size={48} className="mx-auto text-primary mb-6 animate-bounce" />
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-8">Ready to evolve your shop?</h2>
          <Button size="lg" className="h-16 px-12 rounded-full font-black text-2xl uppercase tracking-widest" asChild>
            <Link href="/pricing">Join MitraOS</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
