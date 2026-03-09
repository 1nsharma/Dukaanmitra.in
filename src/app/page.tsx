
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, ShieldCheck, MessageCircle, Zap, Bot, 
  CheckCircle2, XCircle, BadgeCheck, Smartphone
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const WhatsAppBubble = ({ side, text, time }: { side: 'left' | 'right', text: string, time: string }) => (
  <div className={cn("flex flex-col mb-4", side === 'right' ? "items-end" : "items-start")}>
    <div className={cn(
      "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
      side === 'right' ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted text-foreground rounded-tl-none"
    )}>
      <p className="whitespace-pre-line leading-relaxed font-medium">{text}</p>
      <div className={cn("text-[10px] mt-1 text-right opacity-70")}>{time}</div>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* Pilot Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-6 py-20 lg:py-32 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <span className="text-xs font-black text-primary uppercase tracking-widest">Pilot Program: Join 10 Elite Shops</span>
            </div>
            <h1 className="font-headline text-5xl md:text-8xl font-black leading-none tracking-tighter uppercase">
              WhatsApp par Udhaar likho. <br/>
              <span className="text-primary text-outline">Diary band.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed mx-auto">
              Replace manual registers with India's smartest <strong className="text-foreground">Digital Munim</strong>. No app typing needed. Just WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="h-20 px-12 rounded-full font-black text-2xl uppercase tracking-tighter shadow-heavy shadow-primary/20"
                asChild
              >
                <Link href="/login">Start 90-Day Free Trial <ArrowRight className="ml-2" /></Link>
              </Button>
            </div>

            <div className="pt-8 flex flex-wrap justify-center items-center gap-8 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-success" size={18}/>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">100% Private & Safe</span>
                </div>
                <div className="flex items-center gap-2">
                    <BadgeCheck className="text-success" size={18}/>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">GST-Ready Reports</span>
                </div>
                <div className="flex items-center gap-2">
                    <Smartphone className="text-success" size={18}/>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">No App Required</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified How it works */}
      <section className="py-24 border-b border-border bg-slate-50 dark:bg-slate-950">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                Diary ki jagah <br/> <span className="text-primary">Munim AI</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium">Dekhiye kitna simple hai:</p>
              
              <div className="space-y-6">
                {[
                  { title: "Step 1", desc: "WhatsApp par likhein: #ABC Ravi 500 udhaar" },
                  { title: "Step 2", desc: "Munim AI entry record karega aur confirmation bhejega." },
                  { title: "Step 3", desc: "Raat 9 baje automatically poore din ka profit report payein." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-3xl bg-background border-2 border-border transition-all hover:border-primary/20">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm shrink-0">{i+1}</div>
                    <p className="text-foreground text-lg font-bold leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="rounded-[3rem] border-8 border-border shadow-heavy overflow-hidden bg-slate-100 dark:bg-slate-900 max-w-sm mx-auto">
                <div className="bg-primary p-6 flex items-center justify-between text-primary-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-bold text-xl">M</div>
                    <div>
                        <div className="text-sm font-black uppercase tracking-widest">DukaanMitra</div>
                        <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Online Munim</div>
                    </div>
                  </div>
                  <MessageCircle size={24} />
                </div>
                <div className="p-6 h-[450px] overflow-y-auto bg-slate-50 dark:bg-slate-950">
                  <WhatsAppBubble side="right" text="#ABC Ravi 500 udhaar" time="11:00 AM" />
                  <WhatsAppBubble 
                    side="left" 
                    text="Ji Namaste 🙏\n\nRavi ke liye ₹500 udhaar record kar liya gaya hai.\n\nTotal Balance: ₹1,450" 
                    time="11:00 AM" 
                  />
                  <WhatsAppBubble side="right" text="Sunita paid 200" time="02:00 PM" />
                  <WhatsAppBubble 
                    side="left" 
                    text="Shukriya! Sunita ka ₹200 jama kar liya gaya hai. 👍" 
                    time="02:00 PM" 
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Moat Section: Customer Memory */}
      <section className="py-24 border-b border-border bg-primary/5">
        <div className="container text-center space-y-12">
            <h2 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter">System sab <span className="text-primary">yaad rakhega</span></h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 bg-background rounded-[2.5rem] border-2 border-border shadow-subtle text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto"><Zap size={32}/></div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Wapas Bulao Alerts</h3>
                    <p className="text-sm text-muted-foreground">Agar koi regular grahak 15 din se nahi aaya, toh system aapko alert dega.</p>
                </div>
                <div className="p-8 bg-background rounded-[2.5rem] border-2 border-border shadow-subtle text-center space-y-4">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mx-auto"><Bot size={32}/></div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">VIP Identification</h3>
                    <p className="text-sm text-muted-foreground">Kaunsa grahak sabse zyada kharch kar raha hai? System automatic batayega.</p>
                </div>
                <div className="p-8 bg-background rounded-[2.5rem] border-2 border-border shadow-subtle text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mx-auto"><BadgeCheck size={32}/></div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Auto Reminders</h3>
                    <p className="text-sm text-muted-foreground">Udhaar ki vasooli ke liye polite WhatsApp messages automatically jayenge.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 border-b border-border">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-4 border-destructive/10 bg-card rounded-[3rem] overflow-hidden grayscale opacity-60">
              <div className="bg-destructive/5 p-8 border-b border-destructive/10">
                <h3 className="font-black uppercase tracking-widest text-destructive">Purana Tareeka (Register)</h3>
              </div>
              <CardContent className="p-10 space-y-6">
                <p className="flex items-center gap-4 text-lg text-muted-foreground"><XCircle className="text-destructive shrink-0" size={24}/> Calculation galti</p>
                <p className="flex items-center gap-4 text-lg text-muted-foreground"><XCircle className="text-destructive shrink-0" size={24}/> Udhaar bhool jaana</p>
                <p className="flex items-center gap-4 text-lg text-muted-foreground"><XCircle className="text-destructive shrink-0" size={24}/> Diary kho jaane ka darr</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-primary/20 bg-card rounded-[3rem] overflow-hidden shadow-heavy">
              <div className="bg-primary/10 p-8 border-b border-primary/10">
                <h3 className="font-black uppercase tracking-widest text-primary">Naya Tareeka (WhatsApp)</h3>
              </div>
              <CardContent className="p-10 space-y-6">
                <p className="flex items-center gap-4 text-xl font-black text-foreground"><CheckCircle2 className="text-primary shrink-0" size={28}/> 100% Sahi accounting</p>
                <p className="flex items-center gap-4 text-xl font-black text-foreground"><CheckCircle2 className="text-primary shrink-0" size={28}/> Automatic recovery</p>
                <p className="flex items-center gap-4 text-xl font-black text-foreground"><CheckCircle2 className="text-primary shrink-0" size={28}/> Hamesha Cloud par safe</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center bg-primary text-primary-foreground">
        <div className="container max-w-3xl space-y-8">
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-tight">Start Your <br/> 90-Day Free Trial</h2>
          <p className="text-2xl font-bold opacity-90 uppercase tracking-widest">Pilot Launch Exclusive</p>
          <Button size="lg" variant="secondary" className="h-24 px-16 rounded-full font-black text-3xl uppercase tracking-tighter shadow-heavy" asChild>
            <Link href="/login">Activate My Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
