
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cpu, Quote, ShieldCheck, Scale, Lock } from "lucide-react";
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
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              <Cpu size={14} /> The MitraOS (Stage-5) Manifesto
            </div>
            <h1 className="font-headline text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
              Intelligence <br />
              <span className="text-primary text-outline">Without Autonomy</span>
            </h1>
            <p className="text-2xl text-muted-foreground font-medium italic leading-relaxed">
              "We don't trust AI with your money. We trust AI to give you the intelligence to manage it better."
            </p>
          </header>

          <article className="prose prose-invert max-w-none space-y-12 text-xl leading-relaxed">
            <p>
              The world is rushing towards autonomous AI. Everyone wants a system that "does it all." 
              But the Indian shopkeeper knows better. In retail, <strong>control is everything</strong>. 
              A single calculation error or a missed approval can destroy decades of trust.
            </p>

            <div className="bg-card border-2 border-primary/20 p-10 rounded-[40px] relative overflow-hidden">
              <Quote className="absolute -top-4 -left-4 w-32 h-32 text-primary/10 -z-10" />
              <h3 className="text-3xl font-black mb-6 uppercase tracking-tight">The "Deterministic" Core</h3>
              <p className="text-muted-foreground">
                MitraOS is built on a fundamental split: <strong>Deterministic Accounting + Agentic Intelligence</strong>. 
                The "accounting" part of our brain follows strict, unbreakable mathematical rules. 
                The "agent" part of our brain works as your tireless assistant, spotting patterns 
                and proposing actions for you to approve.
              </p>
            </div>

            <section className="space-y-6">
              <h2 className="text-4xl font-black uppercase tracking-tighter pt-8">The Stage-5 Philosophy</h2>
              <p>
                We are building the first <strong>Co-Pilot Operating System</strong> for local commerce. 
                Instead of replacing the owner, we give them "Super-Powers" through three 
                guided safety layers:
              </p>

              <div className="grid md:grid-cols-3 gap-8 py-8">
                <div className="space-y-4">
                  <ShieldCheck className="text-primary" size={32} />
                  <h4 className="font-black uppercase tracking-tight">Financial Governance</h4>
                  <p className="text-base text-muted-foreground">Every ledger write is verified by a human-in-the-loop for total accuracy.</p>
                </div>
                <div className="space-y-4">
                  <Scale className="text-primary" size={32} />
                  <h4 className="font-black uppercase tracking-tight">Guided Intelligence</h4>
                  <p className="text-base text-muted-foreground">AI suggests growth tactics, but never executes them without consent.</p>
                </div>
                <div className="space-y-4">
                  <Lock className="text-primary" size={32} />
                  <h4 className="font-black uppercase tracking-tight">Isolated Execution</h4>
                  <p className="text-base text-muted-foreground">Your data is yours. The AI learns patterns, but you own the dataset.</p>
                </div>
              </div>
            </section>

            <p className="font-black text-3xl text-primary py-12 border-y border-border uppercase tracking-tighter">
              DukaanMitra is not an autonomous driver. <br />
              It is the smartest navigation system ever built for retail.
            </p>
          </article>

          <footer className="pt-12 flex flex-col md:flex-row items-center gap-12">
            <Button size="lg" className="h-20 px-12 text-2xl font-black uppercase rounded-full shadow-2xl" asChild>
              <Link href="/pricing">
                Deploy Co-Pilot
              </Link>
            </Button>
            <div className="text-muted-foreground">
              <p className="font-black text-foreground text-xl uppercase tracking-tight">Amit Sharma</p>
              <p className="font-medium">Chief Architect, MitraOS</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
