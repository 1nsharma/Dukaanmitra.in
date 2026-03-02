import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu, Quote, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function ManifestoPage() {
  return (
    <div className="container max-w-4xl py-16 md:py-24">
      <div className="space-y-12">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-xs font-bold uppercase tracking-widest">
            <Cpu size={14} /> The MitraOS Manifesto
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            REPLACING TOOLS WITH <br />
            <span className="text-primary">INTELLIGENT SYSTEMS</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium italic">
            "A Kirana owner doesn't need another app. They need a digital partner that understands their business."
          </p>
        </header>

        <section className="prose prose-invert max-w-none space-y-8 text-lg leading-relaxed">
          <p>
            For the last decade, we have been telling Indian small business owners to "digitize." 
            We gave them billing apps, inventory apps, ledger apps, and CRM apps. But we forgot one thing: 
            <strong> An Indian shopkeeper is the busiest person in the world.</strong>
          </p>

          <div className="bg-card border border-border p-8 rounded-3xl relative overflow-hidden">
            <Quote className="absolute -top-4 -left-4 w-24 h-24 text-primary/10 -z-10" />
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">The "Fragmented App" Problem</h3>
            <p className="text-muted-foreground">
              Traditional software requires data entry. If you don't type, the app doesn't work. 
              But during peak hours, no shopkeeper has time to navigate a complex UI just to record 
              ₹20 worth of milk. This is why most "digital tools" end up being abandoned.
            </p>
          </div>

          <h2 className="text-3xl font-black uppercase tracking-tighter pt-8">Enter MitraOS</h2>
          <p>
            MitraOS is not an app. It is an <strong>Operating System for Local Commerce</strong>. 
            Built on top of WhatsApp and powered by specialized AI agents, MitraOS removes 
            the friction of data entry.
          </p>

          <div className="grid md:grid-cols-3 gap-6 py-8">
            <div className="space-y-2">
              <Zap className="text-primary" />
              <h4 className="font-bold uppercase">Zero Friction</h4>
              <p className="text-sm text-muted-foreground">Type or talk via WhatsApp. No new apps to learn.</p>
            </div>
            <div className="space-y-2">
              <Shield className="text-primary" />
              <h4 className="font-bold uppercase">Safe Governance</h4>
              <p className="text-sm text-muted-foreground">Deterministic accounting rules ensure your money is always safe.</p>
            </div>
            <div className="space-y-2">
              <Cpu className="text-primary" />
              <h4 className="font-bold uppercase">Agentic Growth</h4>
              <p className="text-sm text-muted-foreground">Munim, Vyapar, and Grahak AI agents work for you 24/7.</p>
            </div>
          </div>

          <p>
            Our flagship product, <strong>DukaanMitra</strong>, is the first realization of this vision. 
            It proves that AI can handle the mundane—the accounting, the reminders, the inventory tracking—so 
            the owner can focus on what they do best: <strong>Growing their business.</strong>
          </p>

          <p className="font-bold text-2xl text-primary py-8 border-t border-border">
            We are building for the next 100 million businesses. <br />
            Join us in defining the category of AI-driven retail.
          </p>
        </section>

        <footer className="pt-12 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
          <Button size="lg" className="px-12 h-16 text-xl font-black uppercase rounded-full" asChild>
            <Link href="/login">
              Launch MitraOS <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <div className="text-muted-foreground text-sm">
            <p className="font-bold text-foreground">Amit Sharma</p>
            <p>Founder, MitraOS (DukaanMitra)</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
