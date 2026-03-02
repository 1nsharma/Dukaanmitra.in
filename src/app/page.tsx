
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Cpu, Shield, TrendingUp, Users, ArrowRight, Zap, Bot, 
  Smartphone, Lock, CheckCircle2, Star, MessageCircle,
  BarChart3, BadgeCheck, XCircle, History, Cloud, 
  Database, EyeOff, Scale, ShieldCheck, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const WhatsAppBubble = ({ side, text, time, type = 'text' }: { side: 'left' | 'right', text: string, time: string, type?: 'text' | 'summary' | 'alert' }) => (
  <div className={cn("flex flex-col mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500", side === 'right' ? "items-end" : "items-start")}>
    <div className={cn(
      "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
      side === 'right' ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted text-foreground rounded-tl-none",
      type === 'summary' && "border-2 border-primary/20 bg-card text-foreground",
      type === 'alert' && "border-2 border-accent/20 bg-accent/5 text-foreground"
    )}>
      {type === 'summary' && <div className="font-bold text-[10px] uppercase tracking-widest text-primary mb-1">Daily Report</div>}
      {type === 'alert' && <div className="font-bold text-[10px] uppercase tracking-widest text-accent mb-1">Munim Verification</div>}
      <p className="whitespace-pre-line leading-relaxed">{text}</p>
      <div className={cn("text-[10px] mt-1 text-right opacity-70")}>{time}</div>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* Hero Section - The Digital Manual Book */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container px-6 py-20 lg:py-32 relative z-10 text-center lg:text-left">
          <div className="max-w-4xl mx-auto lg:mx-0 space-y-8">
            <div className="inline-flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Cpu size={14} className="text-primary animate-pulse" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">MitraOS: Intelligence for Real Dukaans</span>
            </div>
            <h1 className="font-headline text-5xl md:text-8xl font-black leading-none tracking-tighter uppercase">
              The Digital <br/>
              <span className="text-primary text-outline">Manual Book</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0">
              Replace manual registers with India's smartest <strong className="text-foreground">digital khata</strong>. Reliable accounting on WhatsApp with <strong className="text-primary uppercase">Total Boss Control</strong>.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <Button
                size="lg"
                className="h-16 px-10 rounded-full font-black text-xl uppercase tracking-tight shadow-xl shadow-primary/20"
                asChild
              >
                <Link href="/login">Launch My Shop <ArrowRight className="ml-2" /></Link>
              </Button>
              <Button 
                variant="secondary"
                size="lg"
                className="h-16 px-10 rounded-full font-black text-xl uppercase tracking-tight"
                asChild
              >
                <Link href="/features">How it Works</Link>
              </Button>
            </div>

            {/* TRUST BAR - Immediate Assurances */}
            <div className="pt-8 grid grid-cols-2 md:flex md:flex-wrap justify-center lg:justify-start items-center gap-4 md:gap-8 border-t border-border/50">
                <div className="flex items-center gap-2 group">
                    <div className="p-2 bg-success/10 rounded-lg"><Lock size={16} className="text-success"/></div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">100% Private Data</span>
                </div>
                <div className="flex items-center gap-2 group">
                    <div className="p-2 bg-success/10 rounded-lg"><Scale size={16} className="text-success"/></div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">Owner Verified Only</span>
                </div>
                <div className="flex items-center gap-2 group">
                    <div className="p-2 bg-success/10 rounded-lg"><Cloud size={16} className="text-success"/></div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">Indian Cloud Secure</span>
                </div>
                <div className="flex items-center gap-2 group">
                    <div className="p-2 bg-success/10 rounded-lg"><BadgeCheck size={16} className="text-success"/></div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">No Data Selling</span>
                </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10 pointer-events-none hidden lg:block">
            <Bot size={600} className="text-primary rotate-12" />
        </div>
      </section>

      {/* Activation Preview - Removing Technical Fear */}
      <section className="py-24 border-b border-border bg-secondary/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter">Automate in <span className="text-primary">3 Easy Steps</span></h2>
            <p className="text-lg text-muted-foreground italic">"Bina kisi training ke, aaj hi shuru karein."</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative p-8 bg-card border-2 border-border rounded-[32px] space-y-4 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">1</div>
              <h4 className="font-headline text-xl font-bold uppercase tracking-tight pt-2">Create Account</h4>
              <p className="text-muted-foreground text-sm">Sirf 30 seconds lagte hain. Register karein aur apni shop details add karein.</p>
            </div>
            <div className="relative p-8 bg-card border-2 border-border rounded-[32px] space-y-4 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">2</div>
              <h4 className="font-headline text-xl font-bold uppercase tracking-tight pt-2">Connect WhatsApp</h4>
              <p className="text-muted-foreground text-sm">Apna business number link karein. Hum aapke liye aapka "Digital Munim" activate kar denge.</p>
            </div>
            <div className="relative p-8 bg-card border-2 border-border rounded-[32px] space-y-4 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">3</div>
              <h4 className="font-headline text-xl font-bold uppercase tracking-tight pt-2">Type & Record</h4>
              <p className="text-muted-foreground text-sm">WhatsApp par likhein "Ravi 500 udhaar". Munim khud entry record karke confirmation bhej dega.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reality Proof Layer - Real WhatsApp Story */}
      <section className="py-24 border-b border-border">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-success/10 px-4 py-2 rounded-full text-success text-xs font-bold uppercase tracking-widest border border-success/20">
                <CheckCircle size={14} /> Real Usage Story
              </div>
              <h2 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                Safe & Reliable <br/> <span className="text-primary text-outline">Digital Partner</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium">Dekhiye MitraOS kaise aapka dhanda automate karta hai — aapki purani habit (WhatsApp) ke saath.</p>
              
              <div className="space-y-6">
                {[
                  { time: "09:30 AM", title: "Smart Billing", desc: "Type 'Ravi 500 udhaar'. AI parses the intent instantly." },
                  { time: "11:00 AM", title: "High-Value Check", desc: "For large amounts, AI asks for your verification first." },
                  { time: "09:00 PM", title: "Verified Summary", desc: "All owner-approved entries summarized accurately." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-muted transition-colors border border-transparent hover:border-border group">
                    <div className="text-primary font-black text-sm pt-1 whitespace-nowrap">{item.time}</div>
                    <div>
                      <h4 className="font-bold uppercase text-sm tracking-widest group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 blur-3xl -z-10 rounded-full" />
              <Card className="rounded-[40px] border-4 border-border shadow-heavy overflow-hidden bg-slate-100 dark:bg-slate-900 max-w-sm mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">M</div>
                    <div>
                      <div className="text-sm font-bold">DukaanMitra AI</div>
                      <div className="text-[10px] opacity-80 uppercase tracking-widest font-black">Digital Munim</div>
                    </div>
                  </div>
                  <MessageCircle size={20} />
                </div>
                <div className="p-4 h-[500px] overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-contain">
                  <WhatsAppBubble side="right" text="#SHP123 Ravi 5000 udhaar" time="11:00 AM" />
                  
                  <WhatsAppBubble 
                    side="left" 
                    type="alert"
                    text="⚠️ *Verification Alert*\n\nHigh-value entry detect hui hai: ₹5,000 for Ravi.\n\nApprove karein?" 
                    time="11:01 AM" 
                  />
                  
                  <WhatsAppBubble side="right" text="Approve" time="11:02 AM" />
                  
                  <WhatsAppBubble side="left" text="Ji Namaste 🙏\n\nEntry verified aur record kar di gayi hai.\n\nTotal Udhaar: ₹6,450" time="11:02 AM" />
                  
                  <WhatsAppBubble side="left" text="🔔 *Munim Insight*\n\nSunita ji ka payment 3 din se pending hai. Reminder bhejun?" time="04:00 PM" />
                  <WhatsAppBubble side="right" text="Ha bhej do" time="04:02 PM" />
                  <WhatsAppBubble side="left" text="Done! Polite reminder Sunita ji ko bhej diya gaya hai. 👍" time="04:02 PM" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section - Zero Learning Curve Proof */}
      <section className="py-24 border-b border-border bg-secondary/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter">Zero <span className="text-primary text-outline">Learning Curve</span></h2>
            <p className="text-lg text-muted-foreground font-medium">MitraOS aapke business ko automate karta hai, bina habits badle.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-destructive/20 bg-card rounded-[40px] overflow-hidden">
              <div className="bg-destructive/10 p-6 border-b border-destructive/10 flex items-center justify-between">
                <h3 className="font-black uppercase tracking-widest text-destructive">Manual Register / App</h3>
                <XCircle className="text-destructive" />
              </div>
              <CardContent className="p-8 space-y-6">
                {[
                  "Calculation galti (Human error)",
                  "Important udhaar bhool jaana",
                  "Data loss (Diary gum hona)",
                  "Staff ki akele manmaani entry",
                  "Report banana bahut mushkil"
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3 text-muted-foreground">
                    <XCircle className="shrink-0 w-5 h-5 text-destructive/40 mt-0.5" />
                    <p className="text-sm font-medium">{text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-4 border-primary/20 bg-card rounded-[40px] overflow-hidden shadow-heavy shadow-primary/10">
              <div className="bg-primary/10 p-6 border-b border-primary/10 flex items-center justify-between">
                <h3 className="font-black uppercase tracking-widest text-primary">DukaanMitra Life</h3>
                <BadgeCheck className="text-primary" />
              </div>
              <CardContent className="p-8 space-y-6">
                {[
                  "100% Sahi calculation (Zero error)",
                  "AI automatic reminders (No loss)",
                  "Cloud safety (Hamesha secure)",
                  "Owner approval (Total control)",
                  "Instant report (Hamesha ready)"
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3 text-foreground">
                    <CheckCircle2 className="shrink-0 w-5 h-5 text-primary mt-0.5" />
                    <p className="text-sm font-bold italic">"{text}"</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Safety - Bharosa Section */}
      <section className="py-24 border-b border-border">
        <div className="container text-center max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <h2 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter">Bharosa Hi <span className="text-primary">Dhanda Hai</span></h2>
            <p className="text-lg text-muted-foreground">Hum jaante hain aapka data kitna important hai. Isliye humne MitraOS ko 100% secure banaya hai.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-primary mx-auto shadow-subtle border border-border">
                <ShieldCheck size={32} />
              </div>
              <h4 className="font-bold uppercase text-xs tracking-widest">Bank-Grade Safety</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Aapka sara records encrypted hain aur sirf aap hi unhe dekh sakte hain.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-primary mx-auto shadow-subtle border border-border">
                <EyeOff size={32} />
              </div>
              <h4 className="font-bold uppercase text-xs tracking-widest">No Data Selling</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Hum aapka data kisi ko nahi bechte. Hamara revenue sirf subscription se aata hai.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-primary mx-auto shadow-subtle border border-border">
                <Database size={32} />
              </div>
              <h4 className="font-bold uppercase text-xs tracking-widest">Daily Backups</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Agar aapka phone kho bhi jaye, aapka hisaab-kitaab cloud par hamesha safe rahega.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Stage-5 Safety */}
      <section className="py-32 text-center">
        <div className="container max-w-3xl space-y-8">
          <ShieldCheck size={48} className="mx-auto text-primary mb-2 animate-bounce" />
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Launch Your <span className="text-primary">Co-Pilot Store</span></h2>
          <p className="text-xl text-muted-foreground font-medium">Join the elite club of Indian retailers using deterministic AI to scale safely.</p>
          <div className="pt-4 space-y-4">
            <Button size="lg" className="h-20 px-12 rounded-full font-black text-2xl uppercase tracking-widest shadow-heavy shadow-primary/20" asChild>
              <Link href="/login">Activate Free Trial</Link>
            </Button>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              No Credit Card Required • Setup in 2 Minutes
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
