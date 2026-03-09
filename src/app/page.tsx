
'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, ShieldCheck, MessageCircle, Zap, Bot, 
  CheckCircle2, XCircle, BadgeCheck, Smartphone, Cpu, Store
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import anime from 'animejs';

const AnimatedTitle = ({ text }: { text: string }) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const content = text.split('').map(char => {
      if (char === ' ') return '<span>&nbsp;</span>';
      return `<span class="char-span inline-block">${char}</span>`;
    }).join('');
    
    containerRef.current.innerHTML = content;
    const chars = containerRef.current.querySelectorAll('.char-span');

    anime({
      targets: chars,
      translateY: [
        { value: '-1rem', easing: 'easeOutExpo', duration: 600 },
        { value: 0, easing: 'easeOutBounce', duration: 800, delay: 100 }
      ],
      delay: anime.stagger(80),
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine'
    });
  }, [text]);

  return <h1 ref={containerRef} className="font-headline text-5xl md:text-8xl font-black leading-none tracking-tighter uppercase mb-4" />;
};

const WhatsAppBubble = ({ side, text, time }: { side: 'left' | 'right', text: string, time: string }) => (
  <div className={cn("flex flex-col mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500", side === 'right' ? "items-end" : "items-start")}>
    <div className={cn(
      "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
      side === 'right' ? "bg-[#25D366] text-white rounded-tr-none" : "bg-muted text-foreground rounded-tl-none"
    )}>
      <p className="whitespace-pre-line leading-relaxed font-medium">{text}</p>
      <div className={cn("text-[10px] mt-1 text-right opacity-70")}>{time}</div>
    </div>
  </div>
);

export default function LandingPage() {
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dashboard Cards Entrance
    anime({
      targets: '.dashboard-card',
      translateY: [40, 0],
      opacity: [0, 1],
      delay: anime.stagger(150),
      duration: 900,
      easing: 'easeOutQuad'
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* Pilot Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/10 to-background pt-20 pb-32">
        <div className="container px-6 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="inline-flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <span className="text-xs font-black text-primary uppercase tracking-widest">India's First WhatsApp AI Munim</span>
            </div>
            
            <AnimatedTitle text="BILLBOOK FEKO WHATSAPP CHALAO" />
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed mx-auto">
              Replace manual registers with your digital shop companion. 
              <strong className="text-foreground"> Bas bill bhejo, baaki system yaad rakhega.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="h-20 px-12 rounded-full font-black text-2xl uppercase tracking-tighter shadow-heavy shadow-primary/20 bg-[#25D366] hover:bg-[#20ba56]"
                asChild
              >
                <Link href="/login">Start Free Trial 🚀</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Simulation Section */}
      <section className="py-24 border-b border-border bg-slate-50 dark:bg-slate-950">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                Diary ki jagah <br/> <span className="text-[#25D366]">WhatsApp Munim</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium italic">"Kirana store ka digital transformation ab ek message door hai."</p>
              
              <div className="space-y-6">
                {[
                  { title: "WhatsApp Entry", desc: "Write: 'Ravi 200 udhaar tel' on WhatsApp." },
                  { title: "AI Understanding", desc: "Munim AI automatically identifies customer, item, and amount." },
                  { title: "Digital Ledger", desc: "Your shop khata is updated in real-time. No more errors." },
                  { title: "Daily Reports", desc: "Every night at 9 PM, receive your total profit summary." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-3xl bg-background border-2 border-border transition-all hover:border-[#25D366]/20 group">
                    <div className="w-10 h-10 bg-[#25D366]/10 rounded-xl flex items-center justify-center text-[#25D366] font-black text-sm shrink-0 group-hover:scale-110 transition-transform">{i+1}</div>
                    <div>
                        <h4 className="text-lg font-bold">{item.title}</h4>
                        <p className="text-muted-foreground text-sm leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="rounded-[3.5rem] border-[12px] border-slate-200 dark:border-slate-800 shadow-heavy overflow-hidden bg-slate-100 dark:bg-slate-900 max-w-sm mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-[#075E54] p-6 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">M</div>
                    <div>
                        <div className="text-sm font-black uppercase tracking-widest">DukaanMitra AI</div>
                        <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Online Munim</div>
                    </div>
                  </div>
                  <MessageCircle size={24} />
                </div>
                <div className="p-6 h-[480px] overflow-y-auto bg-[#e5ddd5] dark:bg-slate-950 flex flex-col pt-8">
                  <WhatsAppBubble side="right" text="Ravi 500 udhaar cheeni" time="11:00 AM" />
                  <WhatsAppBubble 
                    side="left" 
                    text="Ji Namaste 🙏\n\nRavi ke liye ₹500 Udhaar record ho gaya hai.\n\nTotal Balance: ₹1,450" 
                    time="11:00 AM" 
                  />
                  <WhatsAppBubble side="right" text="Sunita paid 200" time="02:00 PM" />
                  <WhatsAppBubble 
                    side="left" 
                    text="Shukriya! Sunita ka ₹200 jama kar liya gaya hai. 👍" 
                    time="02:00 PM" 
                  />
                  <div className="mt-auto bg-white/80 dark:bg-slate-800 p-2 rounded-full flex items-center gap-2 px-4 shadow-sm">
                    <span className="text-xs text-muted-foreground italic">Type entry here...</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 bg-card relative overflow-hidden">
        <div className="container" ref={dashboardRef}>
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter">Merchant <span className="text-primary">Overview</span></h2>
            <p className="text-muted-foreground font-medium">Control your entire business from one simple dashboard.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="dashboard-card border-none shadow-medium rounded-3xl p-8 bg-primary/5 hover:bg-primary/10 transition-colors">
                <h3 className="text-4xl font-black tracking-tighter text-primary">₹12,500</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">Today's Revenue</p>
            </Card>
            <Card className="dashboard-card border-none shadow-medium rounded-3xl p-8 bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
                <h3 className="text-4xl font-black tracking-tighter text-blue-500">₹84,350</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">Total Udhaar</p>
            </Card>
            <Card className="dashboard-card border-none shadow-medium rounded-3xl p-8 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                <h3 className="text-xl font-bold tracking-tight text-destructive">Amul Milk, Parle-G</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">Low Stock Alert</p>
            </Card>
            <Card className="dashboard-card border-none shadow-medium rounded-3xl p-8 bg-success/5 hover:bg-success/10 transition-colors">
                <h3 className="text-xl font-bold tracking-tight text-success">Ravi, Sunita, Rohan</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">Top Customers</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Moat Section: Customer Memory */}
      <section className="py-24 border-b border-border bg-primary/5">
        <div className="container text-center space-y-12">
            <h2 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter">System sab <span className="text-primary">yaad rakhega</span></h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-10 bg-background rounded-[3rem] border-2 border-border shadow-subtle text-center space-y-4 hover:border-primary/50 transition-all">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto"><Zap size={32}/></div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight">Wapas Bulao</h3>
                    <p className="text-sm text-muted-foreground font-medium">Automatic alerts for customers who haven't visited in 15 days.</p>
                </div>
                <div className="p-10 bg-background rounded-[3rem] border-2 border-border shadow-subtle text-center space-y-4 hover:border-primary/50 transition-all">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mx-auto"><Bot size={32}/></div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight">VIP Grahak</h3>
                    <p className="text-sm text-muted-foreground font-medium">Instantly identify your top 10 spenders and reward them.</p>
                </div>
                <div className="p-10 bg-background rounded-[3rem] border-2 border-border shadow-subtle text-center space-y-4 hover:border-primary/50 transition-all">
                    <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mx-auto"><BadgeCheck size={32}/></div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight">Auto Reminders</h3>
                    <p className="text-sm text-muted-foreground font-medium">Polite WhatsApp reminders for pending udhaar collection.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center bg-[#111] text-white">
        <div className="container max-w-4xl space-y-10">
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-tight">Aaj hi apni dukaan <br/> <span className="text-primary">Digital banao</span></h2>
          <p className="text-2xl font-bold opacity-70 uppercase tracking-widest italic">"Bharat-First AI Technology"</p>
          <Button size="lg" className="h-24 px-16 rounded-full font-black text-3xl uppercase tracking-tighter shadow-heavy bg-[#25D366] hover:bg-[#20ba56]" asChild>
            <Link href="/login">Start Free Trial Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
