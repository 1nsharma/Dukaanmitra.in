import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    ArrowRight, MessageSquare, Shield, TrendingUp, Users, Zap, CheckCircle2, 
    Lock, BarChart3, BellRing, Smartphone, Scale 
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';

const modules = [
  {
    name: "Munim AI",
    positioning: "Your AI Accountant for GST, Billing & Cash Flow",
    icon: <Shield />,
    tagline: "Deterministic Accuracy",
    features: [
      { title: "Smart WhatsApp Ledger", description: "Just type 'Ravi 500 udhaar' or 'Sunita paid 200'. Munim AI parses and records it instantly." },
      { title: "One-Tap Bills", description: "Send professional digital bills to your customers directly on WhatsApp." },
      { title: "Udhaar Recovery Agent", description: "Detects overdue payments and prepares polite reminders for your approval." },
      { title: "GST-Ready Export", description: "Download categorized transaction reports ready for your CA or tax filing." }
    ]
  },
  {
    name: "Vyapar AI",
    positioning: "AI Salesman for Smart Inventory & Revenue Growth",
    icon: <TrendingUp />,
    tagline: "Proactive Growth",
    features: [
      { title: "Sales Drop Alerts", description: "Get a notification if your weekly revenue dips so you can take action fast." },
      { title: "Fast-Mover Insights", description: "Identify which 20% of your products are generating 80% of your profit." },
      { title: "Regional Trends", description: "Understand demand patterns in your area to stock the right items at the right time." },
      { title: "Daily Summary", description: "A structured 9PM report on your WhatsApp showing sales, new customers, and collections." }
    ]
  },
  {
    name: "Grahak AI",
    positioning: "AI Assistant for Loyalty & Personalized Offers",
    icon: <Users />,
    tagline: "Customer Retention",
    features: [
      { title: "Loyalty Scoring", description: "Automatically identify your 'VIP' and 'At-Risk' customers based on visit frequency." },
      { title: "Personalized Offers", description: "Send special discounts to customers who haven't visited in over 30 days." },
      { title: "Interactive Demo", description: "A 24/7 salesman on your WhatsApp business line answering customer queries." },
      { title: "Feedback Loop", description: "Collect customer reviews automatically after a purchase to improve service." }
    ]
  }
];

export default function FeaturesPage() {
  return (
    <div className="container py-16 md:py-24 space-y-24">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter uppercase">
          MITRAOS <span className="text-primary">MODULES</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Replace manual registers and complex apps with specialized AI agents working together on a single operating system.
        </p>
      </section>

      {/* Safety Boundary Explanation */}
      <section className="bg-secondary/30 p-8 md:p-12 rounded-[40px] border border-border relative overflow-hidden">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-primary text-xs font-bold uppercase">
              <Scale size={14}/> Human-In-The-Loop
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Your AI <span className="text-primary">Protects</span> You</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We never let AI "guess" with your money. 
              <strong> Munim AI</strong> uses deterministic logic for all financial writes. 
              For complex tasks, our <strong>Guided Automation</strong> prepares the action and asks for your approval first.
            </p>
            <ul className="space-y-3">
              {[
                "AI proposes, You dispose.",
                "Zero-error financial ledger.",
                "Real-time fraud & risk detection."
              ].map(t => (
                <li key={t} className="flex items-center gap-2 font-bold uppercase text-sm">
                  <CheckCircle2 size={18} className="text-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-background rounded-3xl border border-border space-y-2">
              <Lock className="text-primary" />
              <h4 className="font-bold text-sm uppercase">Financial Guardrail</h4>
              <p className="text-xs text-muted-foreground">AI cannot change balances without your explicit tap.</p>
            </div>
            <div className="p-6 bg-background rounded-3xl border border-border space-y-2">
              <BellRing className="text-primary" />
              <h4 className="font-bold text-sm uppercase">Smart Alerts</h4>
              <p className="text-xs text-muted-foreground">System heals its own messaging failures automatically.</p>
            </div>
            <div className="p-6 bg-background rounded-3xl border border-border space-y-2">
              <Smartphone className="text-primary" />
              <h4 className="font-bold text-sm uppercase">WhatsApp Native</h4>
              <p className="text-xs text-muted-foreground">No new training required for your shop staff.</p>
            </div>
            <div className="p-6 bg-background rounded-3xl border border-border space-y-2">
              <BarChart3 className="text-primary" />
              <h4 className="font-bold text-sm uppercase">Live Audit</h4>
              <p className="text-xs text-muted-foreground">Every AI decision is logged with a confidence score.</p>
            </div>
          </div>
        </div>
      </section>

      {modules.map((module) => (
        <section key={module.name} className="space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-6 border-b border-border pb-8">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              {React.cloneElement(module.icon as React.ReactElement, { size: 40 })}
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <h2 className="text-4xl font-black uppercase tracking-tighter">{module.name}</h2>
                <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">{module.tagline}</span>
              </div>
              <p className="text-xl text-primary font-bold">{module.positioning}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {module.features.map((feature) => (
              <Card key={feature.title} className="bg-card/50 hover:border-primary/50 transition-all border-2">
                <CardHeader>
                  <CardTitle className="text-lg font-bold leading-tight">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}

      {/* Call to Action */}
      <section className="text-center py-16 bg-primary/5 rounded-[40px] border-2 border-primary/20">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Digitize Your Dukaan Today</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Join thousands of Indian retailers using MitraOS to automate their daily operations. 14-day free trial.</p>
        <Button size="lg" className="px-12 h-14 text-xl font-black uppercase tracking-widest rounded-full" asChild>
            <Link href="/login?register=true">
              Get Started
              <ArrowRight className="ml-2"/>
            </Link>
        </Button>
      </section>
    </div>
  );
}
