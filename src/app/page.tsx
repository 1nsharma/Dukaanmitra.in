"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import anime from 'animejs';
import { Check, Bot, IndianRupee, BarChart, FileText, Smartphone, MessageCircle, ShieldCheck, TrendingUp, FileClock, Send, Store, Users, AlertTriangle, Clock, Sparkles, Zap, Shield, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const AppWindow = ({ title, icon, children, className, headerClass }: { title: string, icon: React.ReactNode, children: React.ReactNode, className?: string, headerClass?: string }) => (
  <div className={cn("bg-card border border-border rounded-xl shadow-medium", className)}>
    <div className={cn("px-4 py-2 border-b border-border flex items-center gap-2", headerClass)}>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
      </div>
      <div className="flex-1 text-center text-xs font-mono text-muted-foreground flex items-center justify-center gap-2">
        {icon}
        <span>{title}</span>
      </div>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);


export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const heroTexts = heroRef.current?.querySelectorAll('.hero-text');
    const mockupWindows = mockupRef.current?.querySelectorAll('.app-window');

    if (!heroTexts || !mockupWindows || motionQuery.matches) {
      if(heroTexts) heroTexts.forEach(el => ((el as HTMLElement).style.opacity = '1'));
      if(mockupWindows) mockupWindows.forEach(el => ((el as HTMLElement).style.opacity = '1'));
      return;
    }
    
    const tl = (anime as any).timeline({
      easing: 'easeOutExpo',
      duration: 1200
    });

    tl.add({
      targets: heroTexts,
      translateY: [50, 0],
      opacity: [0, 1],
      delay: anime.stagger(150)
    })
    .add({
      targets: mockupWindows,
      translateY: [40, 0],
      scale: [0.95, 1],
      opacity: [0, 1],
      delay: anime.stagger(100, {from: 'center'})
    }, '-=800');
  }, []);

  const aiModules = [
    { title: "Munim AI", desc: "Your AI Accountant for GST, Billing & Cash Flow.", icon: <Shield className="text-primary" /> },
    { title: "Vyapar AI", desc: "AI Salesman for Smart Inventory & Revenue Growth.", icon: <TrendingUp className="text-primary" /> },
    { title: "Grahak AI", desc: "AI Assistant for Loyalty & Personalized Offers.", icon: <Users className="text-primary" /> },
    { title: "Kanoon AI", desc: "AI Lawyer for Shop Licenses & Local Regulations.", icon: <Zap className="text-primary" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8" ref={heroRef}>
              <div className="hero-text inline-flex items-center space-x-3 bg-secondary px-4 py-2 rounded-full border border-border">
                <Cpu size={14} className="text-primary animate-spin-slow" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">MitraOS: The AI Operating System</span>
              </div>
              <h1 className="hero-text font-headline text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter uppercase">
                DIGITIZE <br/>
                <span className="text-primary">INDIA'S</span> SHOPS
              </h1>
              <p className="hero-text text-lg md:text-xl text-muted-foreground max-w-xl font-medium">
                DukaanMitra is the flagship AI-powered business intelligence platform for local shops, built on the scalable MitraOS infrastructure.
              </p>
              <div className="hero-text flex flex-col sm:flex-row gap-4 items-center">
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-6 rounded-full font-bold text-lg shadow-medium shadow-primary/20 motion-safe:hover:scale-105 transition-transform active:scale-[0.98] tracking-tight"
                  size="lg"
                >
                  Launch Your MitraOS 🚀
                </Button>
                <Button 
                  asChild
                  variant="secondary"
                  size="lg"
                  className="px-8 py-6 rounded-full font-bold text-lg hover:bg-muted transition-all shadow-heavy">
                  <Link href="/manifesto">Read Manifesto 📜</Link>
                </Button>
              </div>
            </div>

            <div className="relative h-[500px] hidden lg:block" ref={mockupRef}>
                <AppWindow title="WhatsApp Munim AI" icon={<Bot size={14}/>} className="app-window absolute w-[320px] top-0 left-1/2 -translate-x-1/2 z-10 transform-gpu" headerClass="bg-primary/10">
                   <div className="space-y-3">
                      <div className="bg-muted p-3 rounded-lg rounded-bl-none text-sm self-start max-w-[85%] shadow-sm">
                        Namaste! Munim AI here. Entry for 500 Sugar?
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-primary/20 p-3 rounded-lg rounded-br-none text-sm self-end max-w-[85%] shadow-sm">
                          Ji haan, Ravi ko udhaar do.
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded-lg rounded-bl-none text-sm self-start max-w-[85%] shadow-sm border-l-2 border-primary">
                        <p className="font-bold text-primary text-xs mb-1">Munim AI Logged ✅</p>
                        Ravi: ₹500 (Udhaar)
                      </div>
                   </div>
                </AppWindow>

                <AppWindow title="Vyapar AI Analytics" icon={<BarChart size={14}/>} className="app-window absolute w-[280px] top-1/4 -left-10 z-0 transform-gpu motion-safe:-rotate-[12deg]">
                    <p className="text-sm text-muted-foreground mb-2">Demand Forecast</p>
                    <p className="text-3xl font-bold text-primary flex items-center">
                        <TrendingUp size={24} className="mr-1"/> +18%
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">Expect high Atta sales this weekend.</p>
                </AppWindow>
            </div>
          </div>
        </div>
      </section>

      {/* Modular AI Framework */}
      <section className="py-24 sm:py-32 px-4 bg-card">
        <div className="container mx-auto text-center">
          <h2 className="font-headline text-5xl md:text-6xl font-black uppercase tracking-tighter mb-16">The MitraOS Ecosystem</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
             {aiModules.map((module, i) => (
               <div key={i} className="flex flex-col items-center text-center space-y-4 p-8 bg-background rounded-3xl border border-border transition-all motion-safe:hover:border-primary/50">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-lg">
                    {React.cloneElement(module.icon as React.ReactElement, { size: 32 })}
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-bold uppercase tracking-tight">{module.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{module.desc}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Positioning Quote */}
      <section className="py-16 text-center bg-secondary/30">
        <div className="container">
          <p className="text-2xl font-black text-foreground uppercase tracking-tighter max-w-3xl mx-auto">
            "One intelligent system to replace 5+ traditional tools. That is the promise of MitraOS."
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 sm:py-32 text-center">
        <div className="container">
            <h2 className="font-headline text-4xl font-bold text-primary mb-8">Ready to Build the Future?</h2>
            <Button onClick={() => router.push('/dashboard')} size="lg" className="px-12 py-8 rounded-full font-bold text-xl uppercase tracking-wider">
                Start Your MitraOS Journey
            </Button>
        </div>
      </section>
    </div>
  );
};
