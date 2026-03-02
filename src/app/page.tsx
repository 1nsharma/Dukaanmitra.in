'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Cpu, Shield, TrendingUp, Users, ArrowRight, Zap, Bot, 
  MessageSquare, Store, ShoppingBasket, Stethoscope, Hammer 
} from 'lucide-react';
import Link from 'next/link';

const IndustryCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="p-6 bg-card border border-border rounded-2xl space-y-3 hover:border-primary/50 transition-colors">
    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
      <Icon size={20} />
    </div>
    <h4 className="font-bold uppercase tracking-tight">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container px-6 py-24 lg:py-32 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="inline-flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Cpu size={14} className="text-primary animate-pulse" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">MitraOS: The AI Operating System</span>
            </div>
            <h1 className="font-headline text-6xl md:text-8xl font-black leading-none tracking-tighter uppercase">
              The Intelligence <br/>
              <span className="text-primary text-outline">Layer for SMBs</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
              DukaanMitra is your "Digital Munim" on WhatsApp. 
              Deterministic accounting, automated billing, and AI growth agents for the modern Indian shopkeeper.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="h-16 px-8 rounded-full font-black text-xl uppercase tracking-tight shadow-xl"
                asChild
              >
                <Link href="/pricing">Start Free Trial <ArrowRight className="ml-2" /></Link>
              </Button>
              <Button 
                variant="secondary"
                size="lg"
                className="h-16 px-8 rounded-full font-black text-xl uppercase tracking-tight"
                asChild
              >
                <Link href="/manifesto">The Manifesto 📜</Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10 pointer-events-none">
            <Bot size={600} className="text-primary rotate-12" />
        </div>
      </section>

      {/* Built For Your Business - Use Cases */}
      <section className="py-24 border-b border-border">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter">Built for <span className="text-primary">Every Shop</span></h2>
            <p className="text-lg text-muted-foreground">Whether you sell milk or medicine, DukaanMitra adapts to your business workflow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <IndustryCard 
              icon={ShoppingBasket} 
              title="Kirana Stores" 
              description="Manage daily udhaar, fast-moving items, and send evening sales summaries automatically."
            />
            <IndustryCard 
              icon={ShoppingBasket} 
              title="Dairy & Milk" 
              description="Track daily delivery subscriptions and send monthly payment reminders with one tap."
            />
            <IndustryCard 
              icon={Stethoscope} 
              title="Medical Stores" 
              description="Keep a digital record of customer prescriptions and track high-value credit sales."
            />
            <IndustryCard 
              icon={Hammer} 
              title="Hardware Shops" 
              description="Secure high-ticket transactions with professional WhatsApp bills and automated ledger."
            />
          </div>
        </div>
      </section>

      {/* AI Modules Section */}
      <section className="py-24 bg-card/50">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="p-8 bg-background rounded-3xl border border-border space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Shield size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">Munim AI</h3>
              <p className="text-muted-foreground">Deterministic accounting. Your AI Accountant for GST, Billing, and Udhaar recovery via WhatsApp. 100% accurate, 0% errors.</p>
            </div>
            <div className="p-8 bg-background rounded-3xl border border-border space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-accent">Vyapar AI</h3>
              <p className="text-muted-foreground">The AI Salesman. Proactive inventory predictions and revenue growth analytics sent directly to your phone.</p>
            </div>
            <div className="p-8 bg-background rounded-3xl border border-border space-y-4">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-success">Grahak AI</h3>
              <p className="text-muted-foreground">Loyalty automation. Segment customers, send personalized festival offers, and bring back inactive buyers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 border-y border-border">
        <div className="container text-center max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <h2 className="font-headline text-4xl font-black uppercase tracking-tighter">Aapka Data, <span className="text-primary">Aapka Control</span></h2>
            <p className="text-xl text-muted-foreground italic">"We believe small business data belongs to the business owner, not the software provider."</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="space-y-2">
              <h4 className="font-bold flex items-center gap-2"><Shield className="text-primary" size={18}/> Zero Data Selling</h4>
              <p className="text-sm text-muted-foreground">We never share your customer or sales data with third parties. Your business is your own.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold flex items-center gap-2"><Zap className="text-primary" size={18}/> 100% Accuracy</h4>
              <p className="text-sm text-muted-foreground">Our deterministic engine ensures your ledger balance is always correct to the last paisa.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold flex items-center gap-2"><MessageSquare className="text-primary" size={18}/> WhatsApp Native</h4>
              <p className="text-sm text-muted-foreground">No new apps to install. If you can use WhatsApp, you can use DukaanMitra.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
        <div className="container">
          <Zap size={48} className="mx-auto text-primary mb-6 animate-bounce" />
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-8">Ready to evolve your shop?</h2>
          <Button size="lg" className="h-16 px-12 rounded-full font-black text-2xl uppercase tracking-widest" asChild>
            <Link href="/pricing">Join MitraOS</Link>
          </Button>
          <p className="mt-6 text-muted-foreground">No credit card required. 14-day free trial.</p>
        </div>
      </section>
    </div>
  );
}
