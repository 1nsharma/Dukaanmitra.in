'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Cpu, Shield, TrendingUp, Users, ArrowRight, Zap, Bot, 
  Smartphone, Lock, CheckCircle2, Star, MessageCircle,
  BarChart3, BadgeCheck
} from 'lucide-react';
import Link from 'next/link';

const StepCard = ({ number, title, description }: { number: string, title: string, description: string }) => (
  <div className="relative p-8 bg-card border border-border rounded-[32px] space-y-4">
    <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
      {number}
    </div>
    <h4 className="font-headline text-xl font-bold uppercase tracking-tight pt-2">{title}</h4>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
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
