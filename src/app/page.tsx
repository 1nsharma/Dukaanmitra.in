
"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import anime from 'animejs';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const plans = [
  {
    title: 'Free Trial',
    price: '₹0',
    period: '/ 14 days',
    description: 'Get a feel for our platform.',
    features: ['Basic WhatsApp Integration', '1 Admin User', 'Basic Analytics'],
    isRecommended: false,
    cta: 'Start Trial',
  },
  {
    title: 'Basic',
    price: '₹1999',
    period: '/ month',
    description: 'Perfect for small stores just getting started.',
    features: ['Full WhatsApp Integration', 'Mobile App Access', '2 Admin Users', 'Standard Analytics'],
    isRecommended: false,
    cta: 'Choose Basic',
  },
  {
    title: 'Pro',
    price: '₹4999',
    period: '/ month',
    description: 'For growing businesses that need more power.',
    features: ['All Basic features', 'AI-Powered Tools', '5 Admin Users', 'Advanced Analytics & Reports'],
    isRecommended: true,
    cta: 'Choose Pro',
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large-scale operations.',
    features: ['All Pro features', 'Dedicated API Access', 'Unlimited Users', 'Dedicated Support'],
    isRecommended: false,
    cta: 'Contact Us',
  },
];


export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cast anime to any to fix timeline access error
    const tl = (anime as any).timeline({
      easing: 'easeOutExpo',
      duration: 1200
    });

    tl.add({
      targets: '.hero-text',
      translateY: [50, 0],
      opacity: [0, 1],
      delay: anime.stagger(150)
    })
    .add({
      targets: mockupRef.current,
      scale: [0.9, 1],
      rotate: [5, 2],
      opacity: [0, 1],
      duration: 1500
    }, '-=800');
  }, []);

  const dukaanFlow = [
    { title: "Smart Ingress", desc: "Customer buys item. Shopkeeper types 'Rahul 500 Milk' in WhatsApp.", icon: "📱" },
    { title: "AI Reasoning", desc: "Munim AI (Gemini) extracts intent, amount, and items instantly.", icon: "🧠" },
    { title: "Ledger Update", desc: "Google Sheets or SQL DB updated automatically in the background.", icon: "📑" },
    { title: "Auto Statement", desc: "Customer gets instant receipt. WhatsApp EOD reports sent to Owner.", icon: "📄" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-6 lg:px-20 py-24 lg:py-40 bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-12 hero-text-container" ref={heroRef}>
            <div className="hero-text inline-flex items-center space-x-3 bg-secondary px-5 py-2 rounded-full border border-border shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Aapka Digital Munim India #1</span>
            </div>
            <h1 className="hero-text text-7xl lg:text-9xl font-black text-foreground leading-[0.85] tracking-tighter italic">
              Register Feko, <br/>
              <span className="text-primary">WhatsApp</span> <br/>
              Chalao!
            </h1>
            <p className="hero-text text-2xl text-muted-foreground leading-relaxed max-w-xl font-bold opacity-80 uppercase tracking-tight">
              Transform your Kirana shop with India's first AI-powered WhatsApp Munim. No app downloads. Just message "Rahul 500" and you're done.
            </p>
            <div className="hero-text flex flex-col sm:flex-row gap-6">
              <Button
                onClick={() => router.push('/dashboard')}
                className="px-12 py-6 rounded-[2.5rem] font-black text-2xl shadow-[0_25px_60px_-15px_rgba(234,255,150,0.2)] hover:scale-105 transition-all active:scale-[0.98] italic tracking-tighter"
                size="lg"
              >
                Start Free Trial 🚀
              </Button>
              <Button 
                variant="secondary"
                size="lg"
                className="px-12 py-6 rounded-[2.5rem] font-black text-2xl hover:bg-muted transition-all shadow-xl shadow-black/20 italic tracking-tighter">
                Watch Demo 🎥
              </Button>
            </div>
          </div>
          <div className="relative" ref={mockupRef}>
            <div className="bg-secondary p-8 rounded-[4.5rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.5)] border-[12px] border-black/50 rotate-2 transform hover:rotate-0 transition-transform duration-1000 group">
               <div className="bg-[#1a1a1a] h-[550px] rounded-[3.5rem] overflow-hidden flex flex-col relative border border-border">
                  <div className="bg-primary/90 p-7 pt-12 text-primary-foreground flex items-center space-x-4 shadow-xl z-10">
                    <div className="w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center font-bold shadow-inner">DM</div>
                    <div>
                      <p className="font-black text-lg tracking-tight">Munim AI</p>
                      <p className="text-[10px] opacity-70 font-black uppercase tracking-widest">Typing insights...</p>
                    </div>
                  </div>
                  <div className="flex-1 p-8 space-y-6 font-bold overflow-hidden relative">
                    <div className="bg-muted p-5 rounded-3xl rounded-tl-none shadow-xl text-sm self-start max-w-[85%]">
                      Namaste Bhaiya! Aaj ka hisaab likhein? 🏠
                    </div>
                    <div className="bg-primary/20 p-5 rounded-3xl rounded-tr-none shadow-xl text-sm self-end ml-auto max-w-[85%] text-foreground">
                      Rahul 500 udhaar chini
                    </div>
                    <div className="bg-muted p-6 rounded-3xl rounded-tl-none shadow-2xl text-sm self-start max-w-[85%] border-l-[6px] border-primary">
                      <p className="font-black text-primary text-xs mb-1 uppercase tracking-widest">Entry Confirmed! ✅</p>
                      Rahul: ₹500 (Sugar) <br/>
                      Total Udhaari: <span className="text-green-400">₹1,250</span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#1a1a1a] to-transparent pointer-events-none"></div>
                  </div>
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-full z-20 flex items-center justify-center">
                    <div className="w-14 h-1 bg-border rounded-full"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Munim Flow Section */}
      <section id="features" className="py-32 px-6 lg:px-20 bg-card text-foreground overflow-hidden">
        <div className="max-w-[1600px] mx-auto space-y-24">
          <div className="text-center space-y-4">
             <h2 className="text-6xl lg:text-8xl font-black italic tracking-tighter uppercase leading-none">The Munim Flow</h2>
             <p className="text-xl text-primary font-bold tracking-widest uppercase">End-to-End Digital Transformation</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-12 relative">
             <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 -translate-y-1/2"></div>
             
             {dukaanFlow.map((step, i) => (
               <div key={i} className="flow-step relative z-10 flex flex-col items-center text-center space-y-8">
                  <div className={`w-24 h-24 rounded-[2.5rem] bg-secondary shadow-2xl shadow-black/50 flex items-center justify-center text-4xl transform hover:scale-110 hover:rotate-6 transition-all duration-500`}>
                    {step.icon}
                  </div>
                  <div className="space-y-3 px-6">
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase">{step.title}</h3>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed italic">"{step.desc}"</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section id="insights" className="py-32 px-6 lg:px-20 bg-background">
        <div className="max-w-[1600px] mx-auto space-y-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-border pb-12">
            <div className="space-y-4">
               <div className="inline-flex items-center space-x-3 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  Retail Intelligence
               </div>
               <h2 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter italic">The Bharat Retail Feed</h2>
            </div>
            <Button 
              onClick={() => router.push('/insights')}
              variant="link"
              className="text-primary font-black text-xl uppercase tracking-tighter italic"
            >
              Explore Daily Insights ➔
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { title: "UPI Lite: The Game Changer for Small Kiranas", tag: "Tech", excerpt: "How low-latency payments are reducing queue times in Delhi's busy markets." },
              { title: "Managing Winter Stocks in Northern India", tag: "Inventory", excerpt: "Strategic stock management for Tier-2 cities during the coldest months." },
              { title: "Building Trust with Digital Udhaar Reminders", tag: "Retention", excerpt: "Data shows 40% faster recovery when reminders are sent via WhatsApp." }
            ].map((b, i) => (
              <div key={i} className="bg-card p-10 rounded-[3.5rem] shadow-xl shadow-black/20 border border-border hover:border-primary/50 hover:scale-105 transition-all duration-500 group">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] group-hover:text-primary transition-colors">{b.tag}</span>
                <h3 className="text-2xl font-black text-foreground mt-4 mb-6 italic tracking-tight leading-tight group-hover:text-primary transition-colors">{b.title}</h3>
                <p className="text-muted-foreground font-bold opacity-80 leading-relaxed mb-8 italic">"{b.excerpt}"</p>
                <Button 
                   onClick={() => router.push('/insights')}
                   variant="link"
                   className="text-[11px] font-black uppercase tracking-widest text-foreground p-0 h-auto pb-1 border-b-4 border-primary/50 group-hover:border-primary transition-all"
                >
                  Read Analysis
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-card">
        <div className="container">
            <div className="text-center mb-12">
            <h2 className="text-6xl lg:text-8xl font-black italic tracking-tighter uppercase leading-none">Pricing</h2>
            <p className="text-xl text-muted-foreground font-bold tracking-widest uppercase mt-4">Simple, transparent plans.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
                <Card
                key={plan.title}
                className={cn('flex flex-col transition-all duration-300 hover:scale-[1.03] rounded-[2rem] bg-background', plan.isRecommended && 'border-primary ring-4 ring-primary/20 shadow-2xl shadow-primary/10 bg-card')}
                >
                <CardHeader className="items-center text-center">
                    <CardTitle className="font-headline text-2xl">{plan.title}</CardTitle>
                    <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <ul className="space-y-3">
                    {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-2 mt-1 shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                    ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button asChild className={cn('w-full rounded-[1.5rem] font-bold text-lg py-6')} variant={plan.isRecommended ? "default" : "secondary"}>
                    <Link href="/login?register=true">{plan.cta}</Link>
                    </Button>
                </CardFooter>
                </Card>
            ))}
            </div>
        </div>
      </section>
    </div>
  );
};
