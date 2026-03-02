
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Cpu, Shield, TrendingUp, Users, ArrowRight, Zap, Bot, 
  Smartphone, Lock, CheckCircle2, Star, MessageCircle,
  BarChart3, BadgeCheck, XCircle, GraduationCap, MonitorOff,
  History, Send, Check
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
              Your WhatsApp <br/>
              <span className="text-primary text-outline">Digital Munim</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0">
              Replace manual registers with AI. Automate your billing, udhaar recovery, and sales growth directly through WhatsApp.
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
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 pt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-2"><Lock size={14} className="text-success"/> 100% Private</span>
                <span className="flex items-center gap-2"><Zap size={14} className="text-success"/> 2-Min Setup</span>
                <span className="flex items-center gap-2"><BadgeCheck size={14} className="text-success"/> No Credit Card</span>
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
            <p className="text-lg text-muted-foreground">Ab dhanda sambhalne ke liye koi course nahi chahiye.</p>
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

      {/* Reality Proof Layer - 1 Day Usage Story */}
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
                  <WhatsAppBubble side="right" text="9876543210 Ravi 500 udhaar" time="09:30 AM" />
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

      {/* Before vs After Section */}
      <section className="py-24 border-b border-border">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter">Ab Register Ki <span className="text-primary">Tension Chhodo</span></h2>
            <p className="text-lg text-muted-foreground">The difference is clear. Your business deserves MitraOS.</p>
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

      {/* How It Works - The Activation Path */}
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

      {/* Trust Layer - Addressing Concerns */}
      <section className="py-24">
        <div className="container grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-success/10 px-3 py-1 rounded-full text-success text-xs font-bold uppercase">
                  <Shield size={14}/> Safe & Secure
                </div>
                <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter">Your Data, <span className="text-primary">Strictly Private</span></h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    We understand your shop data is your lifeblood. MitraOS is built on a "Privacy-First" architecture. 
                </p>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><Lock size={24}/></div>
                        <div>
                            <h4 className="font-bold uppercase tracking-tight">No Data Selling</h4>
                            <p className="text-sm text-muted-foreground">We never share your customer lists or sales data with any third party or competitor.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><CheckCircle2 size={24}/></div>
                        <div>
                            <h4 className="font-bold uppercase tracking-tight">100% Accuracy</h4>
                            <p className="text-sm text-muted-foreground">Deterministic logic ensures your financial balances are always correct. AI never 'guesses' your money.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-card border border-border p-10 rounded-[40px] shadow-heavy relative">
                <Star className="absolute top-6 right-6 text-primary animate-pulse" />
                <h3 className="font-headline text-2xl font-black uppercase mb-6 tracking-tighter">Trusted by Indian Retailers</h3>
                <p className="text-xl text-foreground italic mb-8 leading-relaxed">
                  "DukaanMitra ne mera hisaab-kitaab aasaan kar diya. Ab sab entries WhatsApp par hi ho jati hain, koi register ki tension nahi."
                </p>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center font-bold text-xl text-muted-foreground">RK</div>
                    <div>
                        <p className="font-bold uppercase text-sm tracking-widest">Rajesh Kumar</p>
                        <p className="text-xs text-muted-foreground uppercase font-bold">Kumar Provision Store, Jaipur</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* AI Modules Preview */}
      <section className="py-24 bg-secondary/5 border-y border-border">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="p-8 bg-background rounded-3xl border border-border space-y-4 hover:border-primary transition-all">
              <Shield className="text-primary" size={32} />
              <h3 className="text-2xl font-black uppercase tracking-tighter">Munim AI</h3>
              <p className="text-muted-foreground">Automatic billing and udhaar ledger via WhatsApp. 100% accurate accounting.</p>
            </div>
            <div className="p-8 bg-background rounded-3xl border border-border space-y-4 hover:border-accent transition-all">
              <BarChart3 className="text-accent" size={32} />
              <h3 className="text-2xl font-black uppercase tracking-tighter text-accent">Vyapar AI</h3>
              <p className="text-muted-foreground">Proactive sales insights and inventory alerts sent directly to your phone.</p>
            </div>
            <div className="p-8 bg-background rounded-3xl border border-border space-y-4 hover:border-success transition-all">
              <Users className="text-success" size={32} />
              <h3 className="text-2xl font-black uppercase tracking-tighter text-success">Grahak AI</h3>
              <p className="text-muted-foreground">Personalized loyalty offers and reminders to bring back inactive customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - The Trial Hook */}
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
