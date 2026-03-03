'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, ShieldCheck, MessageCircle, Zap, Bot, 
  CheckCircle2, XCircle, BadgeCheck, Smartphone
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const WhatsAppBubble = ({ side, text, time, type = 'text' }: { side: 'left' | 'right', text: string, time: string, type?: 'text' | 'summary' | 'alert' }) => (
  <div className={cn("flex flex-col mb-4", side === 'right' ? "items-end" : "items-start")}>
    <div className={cn(
      "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
      side === 'right' ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted text-foreground rounded-tl-none",
      type === 'alert' && "border-2 border-accent/20 bg-accent/5"
    )}>
      <p className="whitespace-pre-line leading-relaxed">{text}</p>
      <div className={cn("text-[10px] mt-1 text-right opacity-70")}>{time}</div>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* Pilot Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-6 py-20 lg:py-32 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Pilot Launch: Open for 10 Shops</span>
            </div>
            <h1 className="font-headline text-5xl md:text-8xl font-black leading-none tracking-tighter uppercase">
              WhatsApp par Udhaar likho. <br/>
              <span className="text-primary text-outline">Diary band.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed mx-auto">
              Replace manual registers with India's smartest <strong className="text-foreground">Digital Munim</strong>. No app needed. Just WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="h-16 px-10 rounded-full font-black text-xl uppercase tracking-tight shadow-xl shadow-primary/20"
                asChild
              >
                <Link href="/login">Start 90-Day Free Trial <ArrowRight className="ml-2" /></Link>
              </Button>
            </div>

            <div className="pt-8 flex flex-wrap justify-center items-center gap-8 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-success" size={18}/>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">100% Private & Safe</span>
                </div>
                <div className="flex items-center gap-2">
                    <BadgeCheck className="text-success" size={18}/>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">GST-Ready Reports</span>
                </div>
                <div className="flex items-center gap-2">
                    <Smartphone className="text-success" size={18}/>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">No App Required</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified How it works */}
      <section className="py-24 border-b border-border">
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
                  { title: "Step 2", desc: "Munim AI entry record karega aur confirm bhejega." },
                  { title: "Step 3", desc: "Raat 9 baje automatically poore din ka report payein." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-muted/50 border border-border">
                    <div className="text-primary font-black text-sm pt-1">{item.title}</div>
                    <p className="text-foreground font-bold">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="rounded-[40px] border-4 border-border shadow-heavy overflow-hidden bg-slate-100 dark:bg-slate-900 max-w-sm mx-auto">
                <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">M</div>
                    <div className="text-sm font-bold">DukaanMitra Munim</div>
                  </div>
                  <MessageCircle size={20} />
                </div>
                <div className="p-4 h-[400px] overflow-y-auto bg-slate-50 dark:bg-slate-950">
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

      {/* Comparison Section */}
      <section className="py-24 border-b border-border bg-secondary/5">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-destructive/20 bg-card rounded-[40px] overflow-hidden">
              <div className="bg-destructive/10 p-6 border-b border-destructive/10">
                <h3 className="font-black uppercase tracking-widest text-destructive">Old Way (Register)</h3>
              </div>
              <CardContent className="p-8 space-y-4">
                <p className="flex items-center gap-2 text-muted-foreground"><XCircle className="text-destructive" size={16}/> Calculation galti</p>
                <p className="flex items-center gap-2 text-muted-foreground"><XCircle className="text-destructive" size={16}/> Udhaar bhool jaana</p>
                <p className="flex items-center gap-2 text-muted-foreground"><XCircle className="text-destructive" size={16}/> Diary kho jaane ka darr</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-primary/20 bg-card rounded-[40px] overflow-hidden shadow-heavy">
              <div className="bg-primary/10 p-6 border-b border-primary/10">
                <h3 className="font-black uppercase tracking-widest text-primary">New Way (WhatsApp)</h3>
              </div>
              <CardContent className="p-8 space-y-4">
                <p className="flex items-center gap-2 font-bold"><CheckCircle2 className="text-primary" size={16}/> 100% Sahi accounting</p>
                <p className="flex items-center gap-2 font-bold"><CheckCircle2 className="text-primary" size={16}/> Auto payment reminders</p>
                <p className="flex items-center gap-2 font-bold"><CheckCircle2 className="text-primary" size={16}/> Hamesha Cloud par safe</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center bg-primary text-primary-foreground">
        <div className="container max-w-3xl space-y-8">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight">Start Your <br/> 90-Day Free Trial</h2>
          <p className="text-xl font-medium opacity-90">Join 10 elite shops in the exclusive pilot program.</p>
          <Button size="lg" variant="secondary" className="h-20 px-12 rounded-full font-black text-2xl uppercase tracking-widest" asChild>
            <Link href="/login">Activate Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
