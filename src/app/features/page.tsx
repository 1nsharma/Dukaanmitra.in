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
    positioning: "Paise ka hisaab, ab bina kisi galti ke",
    icon: <Shield />,
    tagline: "100% Accurate",
    features: [
      { title: "Pen aur Register chhodo", description: "Bas WhatsApp par 'Ravi 500 udhaar' likho. Munim AI usey turant sahi jagah record kar lega." },
      { title: "Professional Digital Bill", description: "Customer ko turant WhatsApp par bill bhejein. Shop ka trust aur naam badhayein." },
      { title: "Automatic Udhaar Recovery", description: "AI khud pehchanega kiska udhaar baaki hai aur aapke liye polite reminder taiyaar karega." },
      { title: "CA-Ready Reports", description: "Tax aur Audit ki tension khatam. Ek click me pure mahine ki report download karein." }
    ]
  },
  {
    name: "Vyapar AI",
    positioning: "Sales badhao aur stock sahi rakho",
    icon: <TrendingUp />,
    tagline: "Proactive Growth",
    features: [
      { title: "Sales Drop Alert", description: "Agar is hafte bikri kam hui toh AI aapko pehle hi bata dega taki aap action le sakein." },
      { title: "Sabse zyada bikne wala saaman", description: "Jaanein kaunsa saaman hero hai aur kaunsa slow mover. Sahi stock rakhein." },
      { title: "Area ki Demand", description: "Aapke area me kya trend chal raha hai? Jaanein aur wahi saaman mangwayein jo bike." },
      { title: "Raat 9 baje ki Summary", description: "Din bhar ka saara hisaab raat ko aapke WhatsApp par. Sukoon ki neend soyein." }
    ]
  },
  {
    name: "Grahak AI",
    positioning: "Customers ko wapas bulao aur loyal banao",
    icon: <Users />,
    tagline: "Customer Retention",
    features: [
      { title: "VIP Customer ki pehchan", description: "Kaunse customer sabse valuable hain? Unhe pehchanein aur special offers dein." },
      { title: "Purane Grahak wapas", description: "Jo grahak kaafi din se nahi aaye, unhe AI automatic discount bhej kar wapas bulayega." },
      { title: "24/7 AI Salesman", description: "Aap so rahe ho tab bhi AI grahako ke sawalon ka jawab WhatsApp par deta rahega." },
      { title: "Google Rating badhao", description: "Happy customers se automatic review maangein aur apni shop ki rating badhayein." }
    ]
  }
];

export default function FeaturesPage() {
  return (
    <div className="container py-16 md:py-24 space-y-24">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
          APKE BUSINESS KE LIYE <br/> <span className="text-primary">3 SMART AGENTS</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          Ab manual register aur mushkil apps ki zarurat nahi. MitraOS ke AI agents milkar aapki dukaan sambhalenge.
        </p>
      </section>

      {/* Safety Boundary Explanation */}
      <section className="bg-secondary/30 p-8 md:p-12 rounded-[40px] border border-border relative overflow-hidden">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-primary text-xs font-bold uppercase">
              <Scale size={14}/> Human-In-The-Loop
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">AI sirf help karega, <span className="text-primary">Boss aap hi hain</span></h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hum paise ke maamle me AI par bharosa nahi karte. <strong>Munim AI</strong> calculation karta hai, lekin koi bhi bada badlav karne se pehle aapki permission maangta hai.
            </p>
            <ul className="space-y-3">
              {[
                "AI bataiga, Aap faisla lenge.",
                "Hisaab-kitaab me zero galti.",
                "Fraud aur Risk se hamesha suraksha."
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
              <p className="text-xs text-muted-foreground">Aapki permission ke bina balances nahi badlenge.</p>
            </div>
            <div className="p-6 bg-background rounded-3xl border border-border space-y-2">
              <BellRing className="text-primary" />
              <h4 className="font-bold text-sm uppercase">Smart Alerts</h4>
              <p className="text-xs text-muted-foreground">Zaruri cheezon ka notification turant WhatsApp par.</p>
            </div>
            <div className="p-6 bg-background rounded-3xl border border-border space-y-2">
              <Smartphone className="text-primary" />
              <h4 className="font-bold text-sm uppercase">WhatsApp Native</h4>
              <p className="text-xs text-muted-foreground">Staff ko kuch naya sikhane ki zarurat nahi.</p>
            </div>
            <div className="p-6 bg-background rounded-3xl border border-border space-y-2">
              <BarChart3 className="text-primary" />
              <h4 className="font-bold text-sm uppercase">Live Audit</h4>
              <p className="text-xs text-muted-foreground">Har decision ka pura record dashboard par.</p>
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
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Aaj hi apni dukaan digital karein</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Hazaro retailers MitraOS use kar rahe hain. 14-day free trial se shuru karein.</p>
        <Button size="lg" className="px-12 h-14 text-xl font-black uppercase tracking-widest rounded-full shadow-lg" asChild>
            <Link href="/login?register=true">
              Shuru Karein
              <ArrowRight className="ml-2"/>
            </Link>
        </Button>
      </section>
    </div>
  );
}
