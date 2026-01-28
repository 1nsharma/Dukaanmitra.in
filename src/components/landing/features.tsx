import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { BrainCircuit, LayoutDashboard, MessageCircle, Smartphone } from 'lucide-react';

const features = [
  {
    id: 'feature-whatsapp',
    icon: <MessageCircle className="w-8 h-8 text-primary" />,
    title: 'WhatsApp: The Silent Backend',
    description: "Your entire business runs on WhatsApp. We provide the silent, efficient backend to handle orders, customer queries, and payments without the conversational overhead. It's fast, cost-effective, and works the way you already work.",
    imageHint: 'chat mobile'
  },
  {
    id: 'feature-ai',
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    title: 'AI for Ruthless Efficiency',
    description: "We use AI only where it matters: to understand ambiguous orders and customer emotions. For simple tasks like '20 ki cheeni', we use direct parsing for zero-cost, instant transactions. This solves the cost-latency problem for emerging markets.",
    imageHint: 'robot brain'
  },
  {
    id: 'feature-mobile',
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    title: 'Your Shop in Your Pocket',
    description: "While your customers use WhatsApp, you get a powerful mobile app. Manage inventory, track sales, view customer analytics, and launch marketing campaigns from anywhere. It's your complete business command center.",
    imageHint: 'mobile app'
  },
  {
    id: 'feature-admin',
    icon: <LayoutDashboard className="w-8 h-8 text-primary" />,
    title: 'Data-Driven Dashboards',
    description: "Our admin panels turn your raw data into actionable insights. Understand customer behavior, track sales trends, and get a real-time health score for your shop. Make informed decisions that drive growth.",
    imageHint: 'dashboard chart'
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            An AI-First Assistant for Kirana Stores
          </h2>
          <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl/relaxed mt-4">
            We've reimagined how kirana stores operate by building a silent, hyper-efficient backend that works directly within WhatsApp.
          </p>
        </div>

        <div className="grid gap-20">
          {features.map((feature, index) => {
            const image = getPlaceholderImage(feature.id);
            const isReversed = index % 2 !== 0;
            return (
              <div key={feature.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <div className={isReversed ? 'lg:order-last' : ''}>
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      width={600}
                      height={400}
                      className="rounded-lg object-cover shadow-lg aspect-[3/2]"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                </div>
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-primary/10 p-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-headline text-2xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
