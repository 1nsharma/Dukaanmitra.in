import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    ArrowRight, MessageSquare, Shield, TrendingUp, Users, Zap, CheckCircle2, 
    Lock, BarChart3, BellRing, Smartphone, Scale, Cpu, ShieldCheck
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';

const modules = [
  {
    name: "Munim AI",
    positioning: "Paise ka hisaab, ab bina kisi galti ke",
    icon: <Shield />,
    tagline: "Deterministic Accuracy",
    features: [
      { title: "Pen aur Register chhodo", description: "WhatsApp par entry bhejein. Munim AI usey rule-based logic se 100% sahi jagah record karega." },
      { title: "Guided Billing", description: "Badi entries par AI aapse confirmation maangega. System kabhi akele paise ka faisla nahi leta." },
      { title: "Automatic Udhaar Recovery", description: "AI patterns pehchan kar aapko batayega kisse paise maangne hain. Action aap lenge." },
      { title: "CA-Ready Audit Logs", description: "Har transaction ka deterministic record. Tax aur audit ke liye 100% bharosemand data." }
    ]
  },
  {
    name: "Vyapar AI",
    positioning: "Data se sales badhao, guess-work se nahi",
    icon: <TrendingUp />,
    tagline: "Proactive Signals",
    features: [
      { title: "Sales Drop Alerts", description: "Agar kisi product ki demand giri, toh system aapko signal dega taki aap stock adjust kar sakein." },
      { title: "Smart Inventory Tips", description: "AI batayega kaunsa saaman slow mover hai. Stock clear karne ke liye offers suggest karega." },
      { title: "Area Demand Signals", description: "Aapke region ke trends ke hisaab se naye products mangwane ki intelligence." },
      { title: "Raat 9 baje ki Summary", description: "Din bhar ki performance ka accurate snapshot. Agle din ki strategy banne me madad." }
    ]
  },
  {
    name: "Grahak AI",
    positioning: "Customer relationship ko automate karein",
    icon: <Users />,
    tagline: "Retention Engine",
    features: [
      { title: "VIP Identification", description: "High-value customers ki list taiyaar. Unhe special feel karane ke liye action points." },
      { title: "Churn Risk Detection", description: "Jo grahak kaafi din se nahi aaye, unke liye win-back campaigns propose honge." },
      { title: "24/7 Response Assistant", description: "Grahako ke sawalon ke automated replies (Hinglish). Complex sawal aapke paas aayenge." },
      { title: "Review Nudges", description: "Happy customers ko digital bill ke saath review link suggest karna. Reputation builder." }
    ]
  }
];

export default function FeaturesPage() {
  return (
    <div className="container py-16 md:py-24 space-y-24">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
          AI AGENTS JO <br/> <span className="text-primary text-outline">APKE LIYE</span> KAAM KAREIN
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          DukaanMitra AI apka salesman aur accountant hai, lekin <strong>Boss aap hi hain</strong>. AI propose karega, aap approve karenge.
        </p>
      </section>

      {/* Stage-5 Safety Architecture Section */}
      <section className="bg-primary/5 p-8 md:p-16 rounded-[40px] border-2 border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Cpu size={200} className="text-primary" />
        </div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              <ShieldCheck size={14}/> Layered Safety Architecture
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">AI Proposes, <br/> <span className="text-primary text-outline">Owner Disposes</span></h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Humne MitraOS ko <strong>Risk-Gated Architecture</strong> par banaya hai. Hum paise ke maamle me AI ko "khud se" faisla nahi lene dete.
            </p>
            
            <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-background rounded-2xl border border-border">
                    <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center text-success shrink-0"><Zap size={20}/></div>
                    <div>
                        <h4 className="font-bold text-sm uppercase">Low Risk (Automated)</h4>
                        <p className="text-xs text-muted-foreground mt-1">Greetings aur simple information queries AI khud handle karta hai.</p>
                    </div>
                </div>
                <div className="flex gap-4 p-4 bg-background rounded-2xl border border-border border-l-4 border-l-accent">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0"><Scale size={20}/></div>
                    <div>
                        <h4 className="font-bold text-sm uppercase">Medium Risk (Guided)</h4>
                        <p className="text-xs text-muted-foreground mt-1">Payment reminders aur offers AI suggest karta hai, aap click karke approve karte hain.</p>
                    </div>
                </div>
                <div className="flex gap-4 p-4 bg-background rounded-2xl border border-border border-l-4 border-l-destructive">
                    <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center text-destructive shrink-0"><Lock size={20}/></div>
                    <div>
                        <h4 className="font-bold text-sm uppercase">High Risk (Deterministic)</h4>
                        <p className="text-xs text-muted-foreground mt-1">Financial writes aur ledger updates sirf strict mathematical rules se hote hain.</p>
                    </div>
                </div>
            </div>
          </div>
          
          <div className="relative group">
             <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
             <Card className="relative rounded-[40px] border-4 border-primary/20 bg-card p-8 shadow-heavy">
                <h3 className="font-headline text-2xl font-black uppercase mb-6 flex items-center gap-2">
                    <BarChart3 className="text-primary"/>
                    Safety Dashboard
                </h3>
                <div className="space-y-6">
                    <div className="p-4 bg-secondary/50 rounded-2xl border border-border">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">AI Observation</span>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">VERIFY</Badge>
                        </div>
                        <p className="text-sm font-bold">"Ravi ne ₹2,500 ka udhaar liya hai. Bill confirm karein?"</p>
                        <div className="flex gap-2 mt-4">
                            <Button size="sm" className="rounded-full text-[10px] font-black px-4 uppercase">Approve Bill</Button>
                            <Button size="sm" variant="outline" className="rounded-full text-[10px] font-black px-4 uppercase">Edit</Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[88%]" />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase text-muted-foreground">
                            <span>System Reliability</span>
                            <span className="text-primary">88/100 (Stage-5 Ready)</span>
                        </div>
                    </div>
                </div>
             </Card>
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
      <section className="text-center py-16 bg-card rounded-[40px] border-2 border-border shadow-subtle">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Dukaan apka asset hai, <span className="text-primary">usey secure rakhein</span></h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">MitraOS ke saath 100% accuracy aur 100% control paiye. Trial shuru karein.</p>
        <Button size="lg" className="px-12 h-14 text-xl font-black uppercase tracking-widest rounded-full shadow-lg" asChild>
            <Link href="/login">
              Approve & Start
              <ArrowRight className="ml-2"/>
            </Link>
        </Button>
      </section>
    </div>
  );
}
