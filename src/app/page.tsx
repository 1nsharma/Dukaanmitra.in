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
      return `<span class="char-span">${char}</span>`;
    }).join('');
    
    containerRef.current.innerHTML = content;
    const chars = containerRef.current.querySelectorAll('.char-span');

    anime({
      targets: chars,
      translateY: [
        { value: '-2.75rem', easing: 'easeOutExpo', duration: 600 },
        { value: 0, easing: 'easeOutBounce', duration: 800, delay: 100 }
      ],
      rotate: {
        value: '-1turn',
        duration: 800,
        delay: 0
      },
      delay: anime.stagger(50),
      easing: 'easeInOutCirc',
      loop: true,
      loopDelay: 2000
    });
  }, [text]);

  return <h1 ref={containerRef} className="font-headline text-5xl md:text-8xl font-black leading-none tracking-tighter uppercase mb-4" />;
};

const WhatsAppBubble = ({ side, text, time }: { side: 'left' | 'right', text: string, time: string }) => (
  <div className={cn("flex flex-col mb-4", side === 'right' ? "items-end" : "items-start")}>
    <div className={cn(
      "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
      side === 'right' ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted text-foreground rounded-tl-none"
    )}>
      <p className="whitespace-pre-line leading-relaxed font-medium">{text}</p>
      <div className={cn("text-[10px] mt-1 text-right opacity-70")}>{time}</div>
    </div>
  </div>
);

export default function LandingPage() {
  const lifecycleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lifecycle Flow Animation
    anime({
      targets: '.lifecycle-step',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(300, { start: 1000 }),
      easing: 'easeOutElastic(1, .8)',
      duration: 1500,
      loop: true,
      loopDelay: 3000
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* Pilot Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/10 to-background pt-20 pb-32">
        <div className="container px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <span className="text-xs font-black text-primary uppercase tracking-widest">Pilot Program Live</span>
            </div>
            
            <AnimatedTitle text="DIARY BAND." />
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed mx-auto">
              WhatsApp par Udhaar likho. Replace manual registers with India's smartest <strong className="text-foreground">Digital Munim</strong>.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="h-20 px-12 rounded-full font-black text-2xl uppercase tracking-tighter shadow-heavy shadow-primary/20"
                asChild
              >
                <Link href="/login">Start 90-Day Free Trial <ArrowRight className="ml-2" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Loop Section */}
      <section id="animation" className="py-24 bg-card overflow-hidden">
        <div className="container">
          <div className="large grid centered square-grid p-12 rounded-[3rem] border-2 border-primary/10 min-h-[400px] flex flex-col items-center justify-center text-center">
            <h2 className="text-xl mb-12 text-primary font-black tracking-[0.2em]">APNA MUNIM OS</h2>
            
            <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl" ref={lifecycleRef}>
              <div className="lifecycle-step bg-background p-8 rounded-[2rem] border-2 border-border shadow-subtle">
                <Store className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold uppercase text-xs mb-2">1. Input Bill</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-black">Normal WhatsApp Text</p>
              </div>
              
              <div className="lifecycle-step bg-primary/5 p-8 rounded-[2rem] border-2 border-primary/20 shadow-subtle">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold uppercase text-xs mb-2">2. Welcome Msg</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-black">Automatic Grahak Care</p>
              </div>
              
              <div className="lifecycle-step bg-secondary/5 p-8 rounded-[2rem] border-2 border-secondary/20 shadow-subtle">
                <Cpu className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="font-bold uppercase text-xs mb-2">3. Agents Enabled</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-black">Munim AI takes control</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified How it works */}
      <section className="py-24 border-b border-border bg-slate-50 dark:bg-slate-950">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                Diary ki jagah <br/> <span className="text-primary">Munim AI</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium">Dekhiye kitna simple hai:</p>
              
              <div className="space-y-6">
                {[
                  { title: "Step 1", desc: "WhatsApp par likhein: #ABC Ravi 500 udhaar" },
                  { title: "Step 2", desc: "Munim AI entry record karega aur confirmation bhejega." },
                  { title: "Step 3", desc: "Raat 9 baje automatically poore din ka profit report payein." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-3xl bg-background border-2 border-border transition-all hover:border-primary/20">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm shrink-0">{i+1}</div>
                    <p className="text-foreground text-lg font-bold leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="rounded-[3rem] border-8 border-border shadow-heavy overflow-hidden bg-slate-100 dark:bg-slate-900 max-w-sm mx-auto">
                <div className="bg-primary p-6 flex items-center justify-between text-primary-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-bold text-xl">M</div>
                    <div>
                        <div className="text-sm font-black uppercase tracking-widest">DukaanMitra</div>
                        <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Online Munim</div>
                    </div>
                  </div>
                  <MessageCircle size={24} />
                </div>
                <div className="p-6 h-[450px] overflow-y-auto bg-slate-50 dark:bg-slate-950">
                  <WhatsAppBubble side="right" text="#ABC Ravi 500 udhaar" time="11:00 AM" />
                  <WhatsAppBubble 
                    side="left" 
                    text="Ji Namaste 🙏\n\nRavi ke liye ₹500 udhaar record kar liya gaya hai.\n\nTotal Balance: ₹1,450" 
                    time="11:00 AM" 
                  />
                  <WhatsAppBubble side="right" text="Sunita paid 200" time="02:00 PM" />
                  <WhatsAppBubble 
                    side="left" 
                    text="Shukriya! Sunita ka ₹200 jama kar liya gaya hai. 👍" 
                    time="02:00 PM" 
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Moat Section: Customer Memory */}
      <section className="py-24 border-b border-border bg-primary/5">
        <div className="container text-center space-y-12">
            <h2 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter">System sab <span className="text-primary">yaad rakhega</span></h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 bg-background rounded-[2.5rem] border-2 border-border shadow-subtle text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto"><Zap size={32}/></div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Wapas Bulao Alerts</h3>
                    <p className="text-sm text-muted-foreground">Agar koi regular grahak 15 din se nahi aaya, toh system aapko alert dega.</p>
                </div>
                <div className="p-8 bg-background rounded-[2.5rem] border-2 border-border shadow-subtle text-center space-y-4">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mx-auto"><Bot size={32}/></div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">VIP Identification</h3>
                    <p className="text-sm text-muted-foreground">Kaunsa grahak sabse zyada kharch kar raha hai? System automatic batayega.</p>
                </div>
                <div className="p-8 bg-background rounded-[2.5rem] border-2 border-border shadow-subtle text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mx-auto"><BadgeCheck size={32}/></div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Auto Reminders</h3>
                    <p className="text-sm text-muted-foreground">Udhaar ki vasooli ke liye polite WhatsApp messages automatically jayenge.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center bg-primary text-primary-foreground">
        <div className="container max-w-3xl space-y-8">
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-tight">Start Your <br/> 90-Day Free Trial</h2>
          <p className="text-2xl font-bold opacity-90 uppercase tracking-widest">Pilot Launch Exclusive</p>
          <Button size="lg" variant="secondary" className="h-24 px-16 rounded-full font-black text-3xl uppercase tracking-tighter shadow-heavy" asChild>
            <Link href="/login">Activate My Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
