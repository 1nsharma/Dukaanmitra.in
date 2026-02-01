
"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import anime from 'animejs';
import { Check, Bot, IndianRupee, BarChart, FileText, Smartphone, MessageCircle, ShieldCheck, TrendingUp, FileClock, Send, Store, Users, AlertTriangle } from 'lucide-react';
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

    if (!heroTexts || !mockupWindows) return;

    if (motionQuery.matches) {
      // For users who prefer reduced motion, just make elements visible
      heroTexts.forEach(el => ((el as HTMLElement).style.opacity = '1'));
      mockupWindows.forEach(el => ((el as HTMLElement).style.opacity = '1'));
      return;
    }
    
    // Cast anime to any to fix timeline access error
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

  const dukaanFlow = [
    { title: "WhatsApp Se Entry", desc: 'Sirf WhatsApp par message likho: "Ravi 200 ka tel". Koi app, koi form nahi.', icon: <MessageCircle size={40} /> },
    { title: "AI Munim Ka Jaadu", desc: 'Hamara AI turant samajh jaata hai - customer ka naam, rakam, aur samaan.', icon: <Bot size={40} /> },
    { title: "Automatic Hisaab", desc: 'Aapka digital ledger (khata) apne aap update ho jaata hai. No tension.', icon: <FileText size={40} /> },
    { title: "Smart Reports & Alerts", desc: 'Customer ko instant raseed aur aapko EOD sales report, sab WhatsApp par.', icon: <BarChart size={40} /> },
  ];

  const digitalKhataBenefits = [
      { title: "Udhaar bhoolne ka risk khatam", icon: <ShieldCheck className="text-green-400" /> },
      { title: "Automatic WhatsApp reminders se fast payment recovery", icon: <Send className="text-blue-400" /> },
      { title: "Galle ka hisaab easy, har din ka auto closing report", icon: <FileClock className="text-yellow-400" /> },
      { title: "Customer ke saath relationship strong", icon: <TrendingUp className="text-purple-400" /> },
  ];

  const setupSteps = [
      {
        title: "WhatsApp Connect Karo",
        description: "Apna business WhatsApp number scan karke connect karein.",
        icon: <MessageCircle size={32} />
      },
      {
        title: "Shop Details Add Karo",
        description: "Apni dukaan ka naam aur address set karein.",
        icon: <Store size={32} />
      },
      {
        title: "Pehla Message Bhejo",
        description: "Pehli entry karke dekhein: 'Ravi 100 udhaar'. Ho gaya shuru!",
        icon: <Send size={32} />
      }
  ];
  
  const trustFeatures = [
    "Made for Indian Kiranas",
    "Works on your existing WhatsApp",
    "No app download needed",
    "Secure & auto-backed up data"
  ];

  const pricingPreviewPlans = [
    { title: 'Free Trial', price: '₹0', features: ['14 Days Full Access', 'Basic WhatsApp Tools', 'Daily Reports'] },
    { title: 'Pro', price: '₹4999', features: ['Everything in Basic', 'AI-Powered Tools', 'Advanced Analytics'] },
    { title: 'Enterprise', price: 'Custom', features: ['Dedicated API Access', 'Unlimited Users', 'Priority Support'] },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8" ref={heroRef}>
              <div className="hero-text inline-flex items-center space-x-3 bg-secondary px-4 py-2 rounded-full border border-border">
                <span className="w-2 h-2 rounded-full bg-primary motion-safe:animate-pulse"></span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Aapka Digital Munim India #1</span>
              </div>
              <h1 className="hero-text font-headline text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter uppercase">
                Register Feko, <br/>
                <span className="text-primary">WhatsApp</span> Chalao!
              </h1>
              <p className="hero-text text-lg md:text-xl text-muted-foreground max-w-xl font-medium">
                Transform your Kirana shop with India's first AI-powered WhatsApp Munim. No app downloads. Just message "Rahul 500 udhaar chini" and you're done.
              </p>
              <div className="hero-text flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex flex-col gap-2">
                    <Button
                    onClick={() => router.push('/dashboard')}
                    className="px-8 py-6 rounded-full font-bold text-lg shadow-medium shadow-primary/20 motion-safe:hover:scale-105 transition-transform active:scale-[0.98] tracking-tight"
                    size="lg"
                    >
                    Start Free Trial 🚀
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">Agar 14 din me value na mile to cancel, no questions asked.</p>
                </div>
                <Button 
                  variant="secondary"
                  size="lg"
                  className="px-8 py-6 rounded-full font-bold text-lg hover:bg-muted transition-all shadow-heavy">
                  Watch Demo 🎥
                </Button>
              </div>
            </div>

            <div className="relative h-[500px] hidden lg:block" ref={mockupRef}>
                <AppWindow title="WhatsApp" icon={<MessageCircle size={14}/>} className="app-window absolute w-[320px] top-0 left-1/2 -translate-x-1/2 z-10 transform-gpu" headerClass="bg-green-400/10">
                   <div className="space-y-3">
                      <div className="bg-muted p-3 rounded-lg rounded-bl-none text-sm self-start max-w-[85%] shadow-sm">
                        Namaste Bhaiya! Aaj ka hisaab likhein? 🏠
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-primary/20 p-3 rounded-lg rounded-br-none text-sm self-end max-w-[85%] shadow-sm">
                          Rahul 500 udhaar chini
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded-lg rounded-bl-none text-sm self-start max-w-[85%] shadow-sm border-l-2 border-primary">
                        <p className="font-bold text-primary text-xs mb-1">Entry Confirmed! ✅</p>
                        Rahul: ₹500 (Sugar)
                      </div>
                   </div>
                </AppWindow>

                <AppWindow title="Analytics" icon={<BarChart size={14}/>} className="app-window absolute w-[280px] top-1/4 -left-10 z-0 transform-gpu motion-safe:-rotate-[12deg]">
                    <p className="text-sm text-muted-foreground mb-2">Today's Revenue</p>
                    <p className="text-3xl font-bold text-primary flex items-center">
                        <IndianRupee size={24} className="mr-1"/> 5,430
                    </p>
                     <div className="h-2 w-full bg-muted rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-primary" style={{width: '75%'}}></div>
                     </div>
                </AppWindow>
                
                <AppWindow title="Ledger.txt" icon={<FileText size={14}/>} className="app-window absolute w-[300px] bottom-10 -right-10 z-20 transform-gpu motion-safe:rotate-[8deg]">
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

      {/* Trust Bar Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {trustFeatures.map((text, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <Check className="w-6 h-6 text-primary" />
                        <p className="text-sm font-semibold text-muted-foreground">{text}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Differentiation Line */}
      <section className="py-16 text-center bg-background">
        <div className="container">
          <p className="text-xl font-semibold text-muted-foreground italic max-w-3xl mx-auto">
            “Not an app, not a software – aapka apna WhatsApp hi aapka digital munim ban jaata hai.”
          </p>
        </div>
      </section>


      {/* Munim Flow Section */}
      <section id="features" className="py-24 sm:py-32 px-4">
        <div className="container mx-auto space-y-16 text-center">
          <div className="max-w-3xl mx-auto">
             <h2 className="font-headline text-5xl md:text-6xl font-black uppercase tracking-tighter">The Munim Flow</h2>
             <p className="text-lg text-muted-foreground mt-4">A fully automated, end-to-end digital transformation for your shop, powered by AI.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
             {dukaanFlow.map((step, i) => (
               <div key={i} className="flow-step flex flex-col items-center text-center space-y-4 p-6 bg-card/50 rounded-3xl border border-border transition-all duration-normal motion-safe:hover:border-primary/50 motion-safe:hover:scale-105 motion-safe:hover:-translate-y-2">
                  <div className="w-20 h-20 rounded-2xl bg-secondary shadow-lg flex items-center justify-center text-primary">
                    {step.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-headline text-xl font-bold uppercase tracking-tight">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

       {/* Digital Khata Benefits Section */}
      <section className="py-24 sm:py-32 px-4 bg-card border-y border-border">
        <div className="container mx-auto text-center">
          <h2 className="font-headline text-5xl md:text-6xl font-black uppercase tracking-tighter">Digital Khata Ke Fayde</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">Manual hisaab ki tension chodo aur business badhao.</p>
          <div className="mt-16 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
            {digitalKhataBenefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-secondary flex items-center justify-center">{benefit.icon}</div>
                <div>
                  <h3 className="text-lg font-bold">{benefit.title}</h3>
                </div>
              </div>
            ))}
          </div>
           <div className="mt-16">
              <Button onClick={() => router.push('/dashboard')} size="lg" className="px-8 py-6 rounded-full font-bold text-lg">Connect Your WhatsApp</Button>
          </div>
        </div>
      </section>
      
      {/* Testimonial */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto">
            <div className="bg-secondary p-8 md:p-12 rounded-3xl text-center max-w-4xl mx-auto border border-border">
                <blockquote className="text-2xl md:text-3xl font-bold italic text-foreground">
                    “Pehle 10–12 din lagte the udhaar wapas aane me, ab 4–5 din me payment aa jata hai.”
                </blockquote>
                <cite className="mt-6 block font-headline text-lg font-semibold text-primary not-italic">
                    – Ramesh Gupta, Kirana Owner, Delhi
                </cite>
            </div>
            <div className="text-center mt-12">
                 <Button onClick={() => router.push('/dashboard')} size="lg" className="px-8 py-6 rounded-full font-bold text-lg">
                    Start Free Trial 🚀
                </Button>
            </div>
        </div>
      </section>

      {/* Live Dashboard Preview Section */}
      <section className="pb-24 sm:pb-32 px-4">
          <div className="container mx-auto">
              <div className="max-w-3xl mx-auto text-center mb-16">
                  <h2 className="font-headline text-5xl md:text-6xl font-black uppercase tracking-tighter">Aapki Poori Dukaan, Ek Digital Nazar Me.</h2>
                  <p className="text-lg text-muted-foreground mt-4">Apni dukaan ka poora control ek hi screen par. Aisa dikhta hai aapka dashboard.</p>
              </div>
              
              <AppWindow title="DukaanMitra Dashboard" icon={<Store size={14}/>} className="max-w-5xl mx-auto" headerClass="bg-primary/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card className="lg:col-span-1 bg-secondary/30">
                          <CardHeader className="pb-2">
                              <CardDescription>Today's Revenue</CardDescription>
                              <CardTitle className="font-headline text-3xl text-primary flex items-center"><IndianRupee size={24} className="mr-1"/>12,500</CardTitle>
                          </CardHeader>
                      </Card>
                      <Card className="lg:col-span-1 bg-secondary/30">
                          <CardHeader className="pb-2">
                              <CardDescription>Total Udhaar</CardDescription>
                              <CardTitle className="font-headline text-3xl flex items-center"><IndianRupee size={24} className="mr-1"/>84,350</CardTitle>
                          </CardHeader>
                      </Card>
                      <Card className="lg:col-span-2 bg-secondary/30">
                           <CardHeader className="pb-2">
                              <CardDescription className="flex items-center gap-2"><AlertTriangle className="text-yellow-400" /> Low Stock Alerts</CardDescription>
                              <CardTitle className="font-headline text-2xl">Parle-G, Amul Milk (1L)</CardTitle>
                          </CardHeader>
                      </Card>

                      <Card className="md:col-span-2 lg:col-span-4 bg-secondary/30">
                          <CardHeader>
                              <CardTitle className="font-headline">Top 5 Customers by Credit</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <ul className="space-y-3">
                                  {["Ravi Sharma", "Sunita Devi", "Pappu General Store", "Anjali Mehra", "Vikas Kumar"].map((name, i) => (
                                      <li key={i} className="flex justify-between items-center bg-background/50 p-3 rounded-lg">
                                          <div className="flex items-center gap-3">
                                              <Users size={16} className="text-muted-foreground"/>
                                              <span className="font-medium">{name}</span>
                                          </div>
                                          <span className="font-mono font-bold text-red-400">₹{ (12500 - i * 1800).toLocaleString('en-IN') }</span>
                                      </li>
                                  ))}
                              </ul>
                          </CardContent>
                      </Card>
                  </div>
              </AppWindow>

               <div className="text-center mt-8">
                  <p className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-400" />
                      Aapka pura hisaab secure cloud par auto backup hota hai. Data kabhi lose nahi hota.
                  </p>
              </div>
          </div>
      </section>

      {/* Setup Section */}
      <section className="py-24 sm:py-32 px-4 bg-card border-y border-border">
        <div className="container mx-auto text-center">
            <h2 className="font-headline text-5xl md:text-6xl font-black uppercase tracking-tighter">Setup in 10 Minutes</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">System complicated nahi, bahot simple hai. Bas 3 aasaan steps.</p>
            <p className="mt-4 text-primary font-bold">10 minute me live hone ke liye free personal onboarding support.</p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
                {setupSteps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center p-6 bg-secondary/50 border border-border rounded-2xl">
                        <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4 ring-8 ring-primary/5">
                            {step.icon}
                        </div>
                        <h3 className="font-headline text-xl font-bold mb-2">{index + 1}. {step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                    </div>
                ))}
            </div>
             <div className="mt-16">
                <Button onClick={() => router.push('/dashboard')} size="lg" className="px-8 py-6 rounded-full font-bold text-lg">Start Your 10-Minute Setup</Button>
            </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="container text-center">
            <h2 className="font-headline text-5xl md:text-6xl font-black uppercase tracking-tighter">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">Plans for every Kirana store, big or small. Get started for free.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {pricingPreviewPlans.map((plan) => (
                    <Card key={plan.title} className="flex flex-col text-center bg-card/50">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl font-bold">{plan.title}</CardTitle>
                            <CardDescription className="font-headline text-4xl font-black tracking-tighter">{plan.price}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2 text-muted-foreground">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 justify-center">
                                        <Check className="w-4 h-4 text-green-400" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Button asChild size="lg" className="mt-12 px-8 py-6 rounded-full font-bold text-lg">
                <Link href="/pricing">View Full Pricing & Comparison</Link>
            </Button>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 sm:py-32 text-center">
        <div className="container">
            <h2 className="font-headline text-3xl font-bold text-primary">Koi Bhi Dikkat?</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                Direct WhatsApp ya call par <span className="text-foreground font-bold">real insaan</span> se madad. Hum yahaan hain aapke liye.
            </p>
        </div>
      </section>
    </div>
  );
};
