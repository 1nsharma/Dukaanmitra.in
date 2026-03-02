import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    ArrowRight, MessageSquare, BookOpen, BarChart3, Bell, Users,
    ShieldCheck, Smartphone, Zap, Bot, CalendarCheck, FileClock, ClipboardList, FileDown, ShieldAlert,
    Package, TrendingDown, TrendingUp, Lock, DatabaseBackup, Shield, Cpu
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';

const modules = [
  {
    name: "Munim AI",
    positioning: "Your AI Accountant for GST, Billing & Cash Flow",
    icon: <Shield />,
    features: [
      { title: "Deterministic Ledger", description: "Bulletproof accounting logic that never makes a math error." },
      { title: "WhatsApp Billing", description: "Send professional bills directly via WhatsApp." },
      { title: "Auto GST Ready", description: "Categorized transactions ready for tax filing." },
      { title: "Udhaar Recovery", description: "Munim AI automatically detects and reminds overdue customers." }
    ]
  },
  {
    name: "Vyapar AI",
    positioning: "AI Salesman for Smart Inventory & Revenue Growth",
    icon: <TrendingUp />,
    features: [
      { title: "Inventory Prediction", description: "Get alerts before you run out of stock." },
      { title: "Sales Drop Alerts", description: "Proactive notifications if your daily revenue dips." },
      { title: "Fast-Mover Reports", description: "Know exactly which products are making you money." },
      { title: "Trend Intelligence", description: "Analyze regional demand trends to stock the right items." }
    ]
  },
  {
    name: "Grahak AI",
    positioning: "AI Assistant for Loyalty & Personalized Offers",
    icon: <Users />,
    features: [
      { title: "Customer Segments", description: "Automatically identify your VIP and At-Risk customers." },
      { title: "Personalized Offers", description: "Send special deals to customers who haven't visited in 30 days." },
      { title: "Interactive Demo", description: "A 24/7 salesman on WhatsApp answering customer queries." },
      { title: "Loyalty Scoring", description: "Score every customer based on lifetime value." }
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
          Replace fragmented tools with specialized AI agents working on a single operating system.
        </p>
      </section>

      {modules.map((module) => (
        <section key={module.name} className="space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-6 border-b border-border pb-8">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              {React.cloneElement(module.icon as React.ReactElement, { size: 40 })}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-black uppercase tracking-tighter">{module.name}</h2>
              <p className="text-xl text-primary font-bold">{module.positioning}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {module.features.map((feature) => (
              <Card key={feature.title} className="bg-card/50 hover:border-primary/50 transition-all">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}

      {/* Call to Action */}
      <section className="text-center py-16 bg-primary/5 rounded-3xl border border-primary/20">
        <h2 className="text-3xl font-bold mb-4">Start with Munim AI Today</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Experience the power of MitraOS with our 14-day free trial. No credit card required.</p>
        <Button size="lg" className="px-12 h-14 text-xl font-black uppercase tracking-widest" asChild>
            <Link href="/login?register=true">
              Get Started
              <ArrowRight className="ml-2"/>
            </Link>
        </Button>
      </section>
    </div>
  );
}
