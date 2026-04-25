
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowRight, BarChart3, Bell, CheckCircle, FileDown, Gauge, 
    Plug, Store, User, Users, Zap, Brain, TrendingUp, Package,
    Clock, Repeat, Gem, ShieldAlert, Megaphone, Star, Database, Bot, Sparkles, Scale,
    ShieldCheck, Smartphone, DollarSign, History, Lock
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';

const coreFeatures = [
  {
    title: 'Guided Health Score',
    description: 'AI suggests a score based on data; you set the benchmarks for success.',
    icon: <Gauge className="w-8 h-8" />,
  },
  {
    title: 'Decision Dashboard',
    description: 'Insights are framed as action points. You click to execute.',
    icon: <BarChart3 className="w-8 h-8" />,
  },
  {
    title: 'Customer Logic Segments',
    description: 'Rule-based grouping of customers. AI proposes the rules, you finalize.',
    icon: <Users className="w-8 h-8" />,
  },
  {
    title: 'Smart Signal Alerts',
    description: 'Low-latency signals for risks. No automatic actions taken without owner.',
    icon: <Bell className="w-8 h-8" />,
  },
  {
    title: 'Human-Verified Automation',
    description: 'Auto-triggers for reminders that you pre-approve and monitor.',
    icon: <Zap className="w-8 h-8" />,
  },
  {
    title: 'Auditable Data Exports',
    description: '100% deterministic exports for your CA and financial records.',
    icon: <FileDown className="w-8 h-8" />,
  },
];

const howItWorks = [
    {
        title: 'Connect Shop Data',
        icon: <Plug className="w-8 h-8 text-primary" />
    },
    {
        title: 'AI Proposes Intelligence',
        icon: <Brain className="w-8 h-8 text-primary" />
    },
    {
        title: 'Owner Verifies Signals',
        icon: <Scale className="w-8 h-8 text-primary" />
    },
    {
        title: 'Execute Guided Actions',
        icon: <CheckCircle className="w-8 h-8 text-primary" />
    }
]

const adminFeatures = [
    "Master overview of all signals",
    "Global safety rule templates",
    "Centralized approval workflows",
    "High-risk action logs",
    "Platform health monitoring"
]

const benefits = [
    "Data-backed certainty",
    "Eliminate manual math errors",
    "Focus on growth, not data entry",
    "Total financial governance",
    "100% Control at scale"
]

const advancedAnalytics = [
    { title: 'Deterministic Revenue Trend', description: 'Fact-based growth tracking with zero AI hallucination.', icon: <TrendingUp /> },
    { title: 'Inventory Movement Matrix', description: 'Spot slow movers based on real purchase history.', icon: <Package /> },
    { title: 'Verified Peak Hours', description: 'Exact timestamps of your busiest store moments.', icon: <Clock /> },
    { title: 'True Repeat Rate', description: 'The mathematical reality of customer loyalty.', icon: <Repeat /> },
];

const customerIntelligence = [
    { title: 'Calculated Lifetime Value', description: 'Precise financial value of each customer segment.', icon: <Gem /> },
    { title: 'Churn Risk Signals', description: 'Early warnings for customers who haven\'t visited.', icon: <ShieldAlert /> },
    { title: 'Guided Offer Proposing', description: 'AI suggests the discount; you approve the margin.', icon: <Megaphone /> },
    { title: 'Feedback Loop Monitoring', description: 'Human-verified feedback from your regular grahaks.', icon: <Star /> },
];

const securityTrust = [
    { title: 'Role Based Guardrails', description: 'Owner, manager, staff ke alag rights aur permissions.', icon: <Users /> },
    { title: 'Encrypted Data Vault', description: 'Your business secrets stay in your vault only.', icon: <Lock /> },
    { title: 'Deterministic Audit Trail', description: 'A perfect, unchangeable record of every system event.', icon: <History /> },
    { title: 'Safety-First Backups', description: 'Daily snapshots of your ledger for ultimate safety.', icon: <Database /> },
];

const futureAiUpgrades = [
    { title: 'Co-Pilot Demand Forecasting', description: 'Data-driven guesses for next month\'s stock needs.', icon: <TrendingUp /> },
    { title: 'Guided Pricing Assistant', description: 'AI suggests prices based on demand signals.', icon: <DollarSign /> },
    { title: 'Owner Chat Co-Pilot', description: 'Ask the AI about your data in natural language.', icon: <Bot /> },
    { title: 'Strategic Action Recommendations', description: 'Guided paths for shop expansion and growth.', icon: <Sparkles /> },
];

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
    <Card className="bg-card/50 hover:border-primary/50 hover:bg-card transition-all transform hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
            <CardTitle className="text-lg font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

interface SectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
    badge?: string;
}

const FeatureSection: React.FC<SectionProps> = ({ title, description, badge, children }) => (
    <section>
        <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title} {badge && <Badge>{badge}</Badge>}</h2>
            <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {children}
        </div>
    </section>
);


export default function InsightsPage() {
  return (
    <div className="container py-16 md:py-24 space-y-24">
      {/* 1. Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="font-headline text-4xl md:text-6xl font-black tracking-tighter">
          Guided Intelligence <br/> <span className="text-primary text-outline">for Local Shops</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          MitraOS Intelligence Feed gives you the data to make better decisions. You stay in control.
        </p>
        <div className="mt-6 flex justify-center items-center gap-4 text-sm font-semibold text-primary">
            <span>Verified Insights</span>
            <span className="text-muted-foreground/50">•</span>
            <span>Deterministic Math</span>
            <span className="text-muted-foreground/50">•</span>
            <span>Owner Approved Actions</span>
        </div>
      </section>

      {/* 2. Core Features Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature) => (
                <FeatureCard key={feature.title} {...feature} icon={React.cloneElement(feature.icon as React.ReactElement, { className: "w-8 h-8" })} />
            ))}
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 tracking-tight">The Co-Pilot Workflow</h2>
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
             {howItWorks.map((step, index) => (
                <div key={step.title} className="relative flex flex-col items-center gap-4">
                     {index < howItWorks.length - 1 && (
                        <div className="hidden md:block absolute top-12 left-1/2 -translate-y-1/2 w-full border-t-2 border-dashed border-border"></div>
                     )}
                    <div className="relative z-10 p-4 bg-background border-2 border-primary/50 rounded-full shadow-lg">
                        {step.icon}
                    </div>
                    <p className="font-semibold mt-2 max-w-xs">{step.title}</p>
                </div>
             ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-12">
            <section>
                <h2 className="text-3xl font-bold mb-6">Built for Whom?</h2>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                        { title: 'Growth-Minded Owners', icon: <Store className="w-6 h-6" /> },
                        { title: 'High-Volume Retailers', icon: <User className="w-6 h-6" /> },
                        { title: 'Safety-First Operators', icon: <ShieldCheck className="w-6 h-6" /> },
                        { title: 'Digital-Native Dukaan', icon: <Smartphone className="w-6 h-6" /> }
                    ].map(item => (
                        <div key={item.title} className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                            {item.icon}
                            <span className="font-medium text-sm">{item.title}</span>
                        </div>
                    ))}
                 </div>
            </section>
            <section>
                <h2 className="text-3xl font-bold mb-6">Platform Governance</h2>
                <ul className="space-y-3">
                    {adminFeatures.map(item => (
                       <li key={item} className="flex items-center gap-3 text-lg">
                         <CheckCircle className="w-5 h-5 text-green-400" />
                         <span className="font-medium">{item}</span>
                       </li>
                    ))}
                </ul>
            </section>
        </div>

        {/* 6. Benefits */}
        <section>
             <Card className="p-8 bg-gradient-to-br from-primary/10 to-transparent border-2 border-primary/20">
                <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight">The Stage-5 Edge</h2>
                 <ul className="space-y-4 text-xl">
                    {benefits.map(item => (
                       <li key={item} className="flex items-center gap-4 font-semibold">
                         <CheckCircle className="w-6 h-6 text-primary" />
                         <span>{item}</span>
                       </li>
                    ))}
                </ul>
            </Card>
        </section>
      </div>
      
        <FeatureSection title="Deterministic Analytics" description="Fact-based signals, zero guesswork.">
            {advancedAnalytics.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </FeatureSection>

        <FeatureSection title="Guided Intelligence" description="Empowering the owner with smart recommendations.">
            {customerIntelligence.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </FeatureSection>

        <FeatureSection title="Security & Sovereignty" description="Your business, your data, our protection.">
            {securityTrust.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </FeatureSection>

        <FeatureSection title="The Co-Pilot Roadmap" description="Harnessing future tech responsibly." badge="Vision">
            {futureAiUpgrades.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </FeatureSection>


      {/* Call to Action */}
      <section className="text-center py-16 bg-primary/5 rounded-[40px] border-2 border-primary/20 shadow-heavy">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Ready for Safer Growth?</h2>
        <Button size="lg" className="px-12 h-14 text-xl font-black uppercase rounded-full" asChild>
            <Link href="/login">
                Deploy Co-Pilot Intelligence
                <ArrowRight className="ml-2"/>
            </Link>
        </Button>
        <p className="mt-4 text-sm text-muted-foreground font-bold uppercase tracking-widest">
            Deterministic Math • Human Control
        </p>
      </section>
    </div>
  );
}
