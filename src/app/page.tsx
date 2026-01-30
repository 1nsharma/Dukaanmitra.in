
"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import anime from 'animejs';
import { Check, Bot, IndianRupee, BarChart, FileText, Smartphone } from 'lucide-react';
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

const AppWindow = ({ title, icon, children, className, headerClass }: { title: string, icon: React.ReactNode, children: React.ReactNode, className?: string, headerClass?: string }) => (
  <div className={cn("bg-card border border-border rounded-xl shadow-2xl shadow-black/30", className)}>
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
      targets: mockupRef.current.querySelectorAll('.app-window'),
      translateY: [40, 0],
      scale: [0.95, 1],
      opacity: [0, 1],
      delay: anime.stagger(100, {from: 'center'})
    }, '-=800');
  }, []);

  const dukaanFlow = [
    { title: "Smart Ingress", desc: "Customer buys item. Shopkeeper types 'Rahul 500 Milk' in WhatsApp.", icon: "📱" },
    { title: "AI Reasoning", desc: "Munim AI (Gemini) extracts intent, amount, and items instantly.", icon: "🧠" },
    { title: "Ledger Update", desc: "Google Sheets or SQL DB updated automatically in the background.", icon: "📑" },
    { title: "Auto Statement", desc: "Customer gets instant receipt. WhatsApp EOD reports sent to Owner.", icon: "📄" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-headline">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 hero-text-container" ref={heroRef}>
              <div className="hero-text inline-flex items-center space-x-3 bg-secondary px-4 py-2 rounded-full border border-border">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Aapka Digital Munim India #1</span>
              </div>
              <h1 className="hero-text text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter uppercase">
                Register Feko, <br/>
                <span className="text-primary">WhatsApp</span> Chalao!
              </h1>
              <p className="hero-text text-lg md:text-xl text-muted-foreground max-w-xl font-medium">
                Transform your Kirana shop with India's first AI-powered WhatsApp Munim. No app downloads. Just message "Rahul 500" and you're done.
              </p>
              <div className="hero-text flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-6 rounded-full font-bold text-lg shadow-[0_15px_40px_-15px_rgba(234,255,150,0.2)] hover:scale-105 transition-transform active:scale-[0.98] tracking-tight"
                  size="lg"
                >
                  Start Free Trial 🚀
                </Button>
                <Button 
                  variant="secondary"
                  size="lg"
                  className="px-8 py-6 rounded-full font-bold text-lg hover:bg-muted transition-all shadow-xl shadow-black/20">
                  Watch Demo 🎥
                </Button>
              </div>
            </div>

            <div className="relative h-[500px] hidden lg:block" ref={mockupRef}>
                <AppWindow title="DukaanMitra AI" icon={<Smartphone size={14}/>} className="app-window absolute w-[320px] top-0 left-1/2 -translate-x-1/2 z-10 transform-gpu" headerClass="bg-primary/10">
                   <div className="space-y-3">
                      <div className="bg-muted p-3 rounded-lg rounded-bl-none text-sm self-start max-w-[85%] shadow-md">
                        Namaste Bhaiya! Aaj ka hisaab likhein? 🏠
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-primary/20 p-3 rounded-lg rounded-br-none text-sm self-end max-w-[85%] shadow-md">
                          Rahul 500 udhaar chini
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded-lg rounded-bl-none text-sm self-start max-w-[85%] shadow-md border-l-2 border-primary">
                        <p className="font-bold text-primary text-xs mb-1">Entry Confirmed! ✅</p>
                        Rahul: ₹500 (Sugar)
                      </div>
                   </div>
                </AppWindow>

                <AppWindow title="Analytics" icon={<BarChart size={14}/>} className="app-window absolute w-[280px] top-1/4 -left-10 z-0 transform-gpu -rotate-[12deg]">
                    <p className="text-sm text-muted-foreground mb-2">Today's Revenue</p>
                    <p className="text-3xl font-bold text-primary flex items-center">
                        <IndianRupee size={24} className="mr-1"/> 5,430
                    </p>
                     <div className="h-2 w-full bg-muted rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-primary" style={{width: '75%'}}></div>
                     </div>
                </AppWindow>
                
                <AppWindow title="Ledger.txt" icon={<FileText size={14}/>} className="app-window absolute w-[300px] bottom-10 -right-10 z-20 transform-gpu rotate-[8deg]">
                    <div className="font-mono text-xs text-muted-foreground space-y-1.5">
                        <p><span className="text-green-400">[+]</span> Ravi Kumar - ₹250 (Paid)</p>
                        <p><span className="text-yellow-400">[~]</span> Sunita Devi - ₹120 (Credit)</p>
                        <p><span className="text-green-400">[+]</span> Ashok General - ₹1250 (Paid)</p>
                        <p className="opacity-50">...</p>
                    </div>
                </AppWindow>
            </div>

          </div>
        </div>
      </section>

      {/* Munim Flow Section */}
      <section id="features" className="py-24 sm:py-32 px-4 bg-card border-y border-border">
        <div className="container mx-auto space-y-16 text-center">
          <div className="max-w-3xl mx-auto">
             <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">The Munim Flow</h2>
             <p className="text-lg text-muted-foreground mt-4">A fully automated, end-to-end digital transformation for your shop, powered by AI.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
             {dukaanFlow.map((step, i) => (
               <div key={i} className="flow-step flex flex-col items-center text-center space-y-4 p-6 bg-background/50 rounded-3xl border border-border transition-all duration-300 hover:border-primary/50 hover:scale-105 hover:-translate-y-2">
                  <div className="w-20 h-20 rounded-2xl bg-secondary shadow-lg flex items-center justify-center text-3xl">
                    {step.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold uppercase tracking-tight">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section id="insights" className="py-24 sm:py-32 px-4">
        <div className="container mx-auto space-y-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-border pb-8">
            <div className="max-w-2xl">
               <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold mb-4">
                  Retail Intelligence
               </div>
               <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">The Bharat Retail Feed</h2>
            </div>
            <Button 
              onClick={() => router.push('/insights')}
              variant="link"
              className="text-primary font-bold text-lg uppercase tracking-tight p-0 h-auto"
            >
              Explore Daily Insights →
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "UPI Lite: The Game Changer for Small Kiranas", tag: "Tech", excerpt: "How low-latency payments are reducing queue times in Delhi's busy markets." },
              { title: "Managing Winter Stocks in Northern India", tag: "Inventory", excerpt: "Strategic stock management for Tier-2 cities during the coldest months." },
              { title: "Building Trust with Digital Udhaar Reminders", tag: "Retention", excerpt: "Data shows 40% faster recovery when reminders are sent via WhatsApp." }
            ].map((b, i) => (
              <Card key={i} className="bg-card rounded-3xl shadow-lg border border-border hover:border-primary/50 hover:scale-105 transition-transform duration-300 group flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{b.title}</CardTitle>
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary/80 transition-colors pt-1">{b.tag}</span>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground leading-relaxed">{b.excerpt}</p>
                </CardContent>
                <CardFooter>
                   <Button 
                      onClick={() => router.push('/insights')}
                      variant="link"
                      className="text-sm font-bold uppercase tracking-wider text-foreground p-0 h-auto group-hover:text-primary transition-colors"
                   >
                     Read Analysis
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 sm:py-32 bg-card border-t border-border">
        <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">Pricing</h2>
              <p className="text-lg text-muted-foreground mt-4">Simple, transparent plans for every Kirana store.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
                <Card
                  key={plan.title}
                  className={cn(
                    'flex flex-col rounded-3xl bg-background/50 border-2 border-border transition-all duration-300 hover:scale-[1.03] hover:border-primary', 
                    plan.isRecommended && 'border-primary ring-4 ring-primary/20 shadow-2xl shadow-primary/10'
                  )}
                >
                  <CardHeader className="items-center text-center">
                      <CardTitle className="text-2xl font-bold uppercase tracking-tight">{plan.title}</CardTitle>
                      <div className="flex items-baseline">
                      <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground font-semibold">{plan.period}</span>}
                      </div>
                      <CardDescription className="pt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                      <ul className="space-y-4">
                      {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-1 shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                          </li>
                      ))}
                      </ul>
                  </CardContent>
                  <CardFooter>
                      <Button asChild className={cn('w-full rounded-full font-bold text-lg py-7')} variant={plan.isRecommended ? "default" : "secondary"}>
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
