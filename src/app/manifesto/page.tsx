import { Button } from "@/components/ui/button";
import { ArrowLeft, Cpu, Quote, Shield, Zap, Bot } from "lucide-react";
import Link from "next/link";

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-16 md:py-24">
        <Link href="/" className="inline-flex items-center text-primary font-bold uppercase tracking-widest text-sm mb-12 hover:gap-2 transition-all">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Link>

        <div className="space-y-16">
          <header className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-xs font-bold uppercase tracking-widest">
              <Cpu size={14} /> The MitraOS Manifesto
            </div>
            <h1 className="font-headline text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
              Replacing tools with <br />
              <span className="text-primary text-outline">Intelligent Systems</span>
            </h1>
            <p className="text-2xl text-muted-foreground font-medium italic leading-relaxed">
              "An Indian Kirana owner doesn't need another billing app. They need a Digital Munim that understands their business."
            </p>
          </header>

          <article className="prose prose-invert max-w-none space-y-12 text-xl leading-relaxed">
            <p>
              For the last decade, we have been telling small business owners to "digitize." 
              We gave them billing apps, inventory apps, and ledger apps. But we forgot one thing: 
              <strong> The Indian shopkeeper is the busiest person in the world.</strong>
            </p>

            <div className="bg-card border border-border p-10 rounded-[40px] relative overflow-hidden">
              <Quote className="absolute -top-4 -left-4 w-32 h-32 text-primary/10 -z-10" />
              <h3 className="text-3xl font-black mb-6 uppercase tracking-tight">The "Friction" Problem</h3>
              <p className="text-muted-foreground">
                Traditional software requires manual data entry. If you don't type, the app doesn't work. 
                But during peak hours, no shopkeeper has time to navigate a complex UI just to record 
                ₹20 worth of milk. <strong>This is why software fails.</strong>
              </p>
            </div>

            <section className="space-y-6">
              <h2 className="text-4xl font-black uppercase tracking-tighter pt-8">Enter MitraOS</h2>
              <p>
                MitraOS is not an app. It is an <strong>Operating System for Local Commerce</strong>. 
                Built on top of WhatsApp and powered by specialized AI agents, MitraOS removes 
                the friction of manual entry.
              </p>

              <div className="grid md:grid-cols-3 gap-8 py-8">
                <div className="space-y-4">
                  <Zap className="text-primary" size={32} />
                  <h4 className="font-black uppercase tracking-tight">Zero Friction</h4>
                  <p className="text-base text-muted-foreground">Type or talk via WhatsApp. No new apps to learn. No complex buttons.</p>
                </div>
                <div className="space-y-4">
                  <Shield className="text-primary" size={32} />
                  <h4 className="font-black uppercase tracking-tight">Financial Governance</h4>
                  <p className="text-base text-muted-foreground">Deterministic accounting ensures your money is always safe and accurate.</p>
                </div>
                <div className="space-y-4">
                  <Bot className="text-primary" size={32} />
                  <h4 className="font-black uppercase tracking-tight">Agentic Growth</h4>
                  <p className="text-base text-muted-foreground">Munim, Vyapar, and Grahak AI agents work for you 24/7, even while you sleep.</p>
                </div>
              </div>
            </section>

            <p className="font-black text-3xl text-primary py-12 border-y border-border uppercase tracking-tighter">
              We are building for the next 100 million businesses. <br />
              This is the future of retail.
            </p>
          </article>

          <footer className="pt-12 flex flex-col md:flex-row items-center gap-12">
            <Button size="lg" className="h-20 px-12 text-2xl font-black uppercase rounded-full shadow-2xl" asChild>
              <Link href="/pricing">
                Launch MitraOS
              </Link>
            </Button>
            <div className="text-muted-foreground">
              <p className="font-black text-foreground text-xl uppercase tracking-tight">Amit Sharma</p>
              <p className="font-medium">Founder, MitraOS</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
