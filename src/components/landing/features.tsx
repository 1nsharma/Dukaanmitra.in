import { BrainCircuit, Camera, FileText } from 'lucide-react';

const productPillars = [
  {
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    title: 'AI-Native Engine',
    description: 'An agentic, WhatsApp-first framework with retrieval-augmented generation for seamless, autonomous operation.',
  },
  {
    icon: <Camera className="w-8 h-8 text-primary" />,
    title: 'Digital Shutter',
    description: 'Engage customers with AI-powered video marketing, personalized avatars, and dynamic daily offer generation.',
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: 'Source Ingestion & Synthesis',
    description: 'Automatically process WhatsApp chats, voice notes, and competitor data into structured, actionable intelligence.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Our AI-Native Product Pillars
          </h2>
          <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl/relaxed mt-4">
            DukaanMitra is built on a foundation of powerful, interconnected AI systems designed to put your store on autopilot.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {productPillars.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center gap-4 p-8 bg-card rounded-lg shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="inline-block rounded-lg bg-primary/10 p-4">
                    {feature.icon}
                </div>
                <h3 className="font-headline text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">
                    {feature.description}
                </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
