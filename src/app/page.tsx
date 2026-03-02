'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Cpu, Shield, TrendingUp, Users, ArrowRight, Zap, Bot, 
  Smartphone, Lock, CheckCircle2, Star, MessageCircle,
  BarChart3, BadgeCheck, XCircle, GraduationCap, MonitorOff,
  History, Send, Check, Cloud, Database, EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const StepCard = ({ number, title, description }: { number: string, title: string, description: string }) => (
  <div className="relative p-8 bg-card border border-border rounded-[32px] space-y-4">
    <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
      {number}
    </div>
    <h4 className="font-headline text-xl font-bold uppercase tracking-tight pt-2">{title}</h4>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const WhatsAppBubble = ({ side, text, time, type = 'text' }: { side: 'left' | 'right', text: string, time: string, type?: 'text' | 'summary' }) => (
  <div className={cn("flex flex-col mb-4", side === 'right' ? "items-end" : "items-start")}>
    <div className={cn(
      "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
      side === 'right' ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted text-foreground rounded-tl-none",
      type === 'summary' && "border-2 border-primary/20 bg-card text-foreground"
    )}>
      {type === 'summary' && <div className="font-bold text-[10px] uppercase tracking-widest text-primary mb-1">Daily Report</div>}
      <p className="whitespace-pre-line">{text}</p>
      <div className={cn("text-[10px] mt-1 text-right opacity-70")}>{time}</div>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container px-6 py-20 lg:py-32 relative z-10 text-center lg:text-left">
          <div className="max-w-4xl mx-auto lg:mx-0 space-y-8">
            <div className="inline-flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Cpu size={14} className="text-primary animate-pulse" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">MitraOS: The AI Operating System</span>
            </div>
            <h1 className="font-headline text-5xl md:text-8xl font-black leading-none tracking-tighter uppercase">
              The Digital <br/>
              <span className="text-primary text-outline">Manual Book</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0">
              Replace manual registers with the smartest <strong className="text-foreground">digital khata</strong> and <strong className="text-foreground">udhaar app</strong> on WhatsApp. Built for the busy Indian shopkeeper.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                className="h-16 px-10 rounded-full font-black text-xl uppercase tracking-tight shadow-xl"
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
                <Link href="/features">How it works</Link>
              </Button>
            </div>

            {/* TRUST BAR */}
            <div className="pt-8 grid grid-cols-2 md:flex md:flex-wrap justify-center lg:justify-start items-center gap-4 md:gap-8 border-t border-border/50">
                <div className="flex items-center gap-2 group cursor-default">
                    <div className="p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-colors">
                        <Lock size={16} className="text-success"/>
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">100% Private Data</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
                    <div className="p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-colors">
                        <Cloud size={16} className="text-success"/>
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">Indian Cloud Secure</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
                    <div className="p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-colors">
                        <EyeOff size={16} className="text-success"/>
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">No Data Selling</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
                    <div className="p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-colors">
                        <BadgeCheck size={16} className="text-success"/>
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">GST-Ready Reports</span>
                </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10 pointer-events-none hidden lg:block">
            <Bot size={600} className="text-primary rotate-12" />
        </div>
      </section>

      {/* Zero Learning Curve Section */}
      <section className="py-24 border-b border-border">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter">Built for <span className="text-primary">Real Reality</span></h2>
            <p className="text-lg text-muted-foreground">The most intuitive <strong className="text-primary">kirana software</strong> designed for busy Indian retailers. No apps to learn.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-primary border border-border shadow-subtle">
                <Smartphone size={32} />
              </div>
              <div>
                <h4 className="font-bold uppercase text-xs tracking-widest mb-1">No New App</h4>
                <p className="text-sm text-muted-foreground">Everything stays on WhatsApp.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-destructive border border-border shadow-subtle">
                <MonitorOff size={32} />
              </div>
              <div>
                <h4 className="font-bold uppercase text-xs tracking-widest mb-1">No Computer</h4>
                <p className="text-sm text-muted-foreground">No extra hardware needed.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-primary border border-border shadow-subtle">
                <GraduationCap size={32} />
              </div>
              <div>
                <h4 className="font-bold uppercase text-xs tracking-widest mb-1">No Training</h4>
                <p className="text-sm text-muted-foreground">If you can chat, you can bill.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-success border border-border shadow-subtle">
                <Zap size={32} />
              </div>
              <div>
                <h4 className="font-bold uppercase text-xs tracking-widest mb-1">Instant Start</h4>
                <p className="text-sm text-muted-foreground">Connected in under 2 minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1 Day Usage Story */}
      <section className="py-24 bg-secondary/10 border-b border-border">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Experience the Magic <br/> of <span className="text-primary">WhatsApp Munim</span>
              </h2>
              <p className="text-xl text-muted-foreground">See how MitraOS automates a typical day in your shop.</p>
              
              <div className="space-y-6">
                {[
                  { time: "09:30 AM", title: "Easy Billing", desc: "Just type 'Ravi 500 udhaar'. AI records it instantly." },
                  { time: "04:00 PM", title: "Auto Recovery", desc: "System prepares polite reminders for pending udhaar." },
                  { time: "09:00 PM", title: "Daily Summary", desc: "Get a full sales report on WhatsApp before you sleep." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-background transition-colors border border-transparent hover:border-border group">
                    <div className="text-primary font-black text-sm pt-1 whitespace-nowrap">{item.time}</div>
                    <div>
                      <h4 className="font-bold uppercase text-sm tracking-widest group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 blur-3xl -z-10 rounded-full" />
              <Card className="rounded-[40px] border-2 border-border shadow-heavy overflow-hidden bg-slate-100 dark:bg-slate-900 max-w-sm mx-auto">
                <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">M</div>
                    <div>
                      <div className="text-xs font-bold">DukaanMitra AI</div>
                      <div className="text-[8px] opacity-80 uppercase tracking-widest font-black">Digital Munim</div>
                    </div>
                  </div>
                  <MessageCircle size={18} />
                </div>
                <div className="p-4 h-[450px] overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-contain">
                  <WhatsAppBubble side="right" text="#SHP123 Ravi 500 udhaar" time="09:30 AM" />
                  <WhatsAppBubble side="left" text="Ji Namaste 🙏\n\nRavi Kumar ke liye ₹500 Udhaar add kar diya gaya hai.\n\nTotal Udhaar: ₹1,450" time="09:31 AM" />
                  
                  <WhatsAppBubble side="left" text="🔔 *Munim Alert*\n\nSunita ji ka payment 7 din se pending hai. Reminder bhejein?" time="04:00 PM" />
                  <WhatsAppBubble side="right" text="Bhej do" time="04:02 PM" />
                  <WhatsAppBubble side="left" text="Done! Polite reminder Sunita ji ko bhej diya gaya hai. 👍" time="04:02 PM" />

                  <WhatsAppBubble 
                    side="left" 
                    type="summary"
                    text="📊 *Aaj ki Summary*\n\nBikri: ₹12,450\nNew Customers: 4\nUdhaar Recovery: ₹2,100\n\nShubh Ratri! 🌙" 
                    time="09:00 PM" 
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 border-b border-border">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter">Ab Register Ki <span className="text-primary">Tension Chhodo</span></h2>
            <p className="text-lg text-muted-foreground">Upgrade your store with the most powerful <strong className="text-primary">udhaar app</strong> in India.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-destructive/20 bg-destructive/5 rounded-[40px] overflow-hidden">
              <div className="bg-destructive/10 p-6 border-b border-destructive/10 flex items-center justify-between">
                <h3 className="font-black uppercase tracking-widest text-destructive">Purana Tarika</h3>
                <XCircle className="text-destructive" />
              </div>
              <CardContent className="p-8 space-y-6">
                {[
                  "Diary me hisaab likhna (Jo kabhi bhi kho sakti hai)",
                  "Customer ko phone karke udhaar mangne me sharam",
                  "Pata hi nahi chalta kaunsa maal bik raha hai",
                  "Raat ko 1 ghanta baith kar hisaab joddna",
                  "Staff ki entry me galtiyan"
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3 text-muted-foreground">
                    <XCircle className="shrink-0 w-5 h-5 text-destructive/40 mt-0.5" />
                    <p className="text-sm font-medium">{text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-primary/5 rounded-[40px] overflow-hidden shadow-heavy shadow-primary/10">
              <div className="bg-primary/10 p-6 border-b border-primary/10 flex items-center justify-between">
                <h3 className="font-black uppercase tracking-widest text-primary">DukaanMitra Life</h3>
                <BadgeCheck className="text-primary" />
              </div>
              <CardContent className="p-8 space-y-6">
                {[
                  "WhatsApp par 1 second me entry (100% Secure)",
                  "AI automatically polite reminders bhejta hai",
                  "Smart phone par analytics (Top selling items)",
                  "Automatic daily report (No manual work)",
                  "Deterministic logic (Zero calculation error)"
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3 text-foreground">
                    <CheckCircle2 className="shrink-0 w-5 h-5 text-primary mt-0.5" />
                    <p className="text-sm font-bold">{text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-primary/5">
        <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter">Bharosa Hi <span className="text-primary">Dhanda Hai</span></h2>
                <p className="text-lg text-muted-foreground">Your shop's data is your property. We protect it like a bank.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 bg-background rounded-3xl border-2 border-border hover:border-primary transition-all space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Database size={24}/>
                    </div>
                    <h4 className="font-black uppercase tracking-tight">Your Data, Your Property</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Aapki shop ka sara data aapka hai. Hum sirf usay manage karne me aapki help karte hain. Aap jab chahein export kar sakte hain.</p>
                </div>
                <div className="p-8 bg-background rounded-3xl border-2 border-border hover:border-primary transition-all space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Shield size={24}/>
                    </div>
                    <h4 className="font-black uppercase tracking-tight">Strict No Data-Selling</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Hum aapka sales data ya customer list kisi ko nahi bechte. Hamara business model subscriptions par hai, data trading par nahi.</p>
                </div>
                <div className="p-8 bg-background rounded-3xl border-2 border-border hover:border-primary transition-all space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Cloud size={24}/>
                    </div>
                    <h4 className="font-black uppercase tracking-tight">Indian Cloud Secure</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">All data is stored on secure servers with bank-grade encryption. Aapka hisaab-kitaab physically aur digitally safe hai.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Activation Preview */}
      <section className="py-24 border-b border-border bg-secondary/10">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter">Automate in <span className="text-primary">3 Steps</span></h2>
            <p className="text-lg text-muted-foreground">Simple enough for your staff, powerful enough for your business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard 
              number="1"
              title="Create Account"
              description="Sign up in 30 seconds with your email or Google account. No complex forms."
            />
            <StepCard 
              number="2"
              title="Connect WhatsApp"
              description="Submit your business number. Our system connects to your WhatsApp instantly."
            />
            <StepCard 
              number="3"
              title="Type & Record"
              description="Type 'Ravi 500 udhaar' on WhatsApp. AI records it and updates your ledger automatically."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center">
        <div className="container max-w-3xl space-y-8">
          <MessageCircle size={48} className="mx-auto text-primary mb-2 animate-bounce" />
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Start Your <span className="text-primary">14-Day Free Trial</span></h2>
          <p className="text-xl text-muted-foreground">No credit card required. Connect your shop in 2 minutes and see the power of MitraOS.</p>
          <div className="pt-4">
            <Button size="lg" className="h-20 px-12 rounded-full font-black text-2xl uppercase tracking-widest shadow-heavy shadow-primary/20" asChild>
              <Link href="/login">Launch MitraOS Now</Link>
            </Button>
          </div>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest pt-4">Zero Risk. Cancel Anytime.</p>
        </div>
      </section>
    </div>
  );
}
