import { ClipboardList, Sparkles, Star } from 'lucide-react';

const kitFeatures = [
  {
    icon: <ClipboardList className="w-8 h-8 text-primary" />,
    title: 'Ready-to-Use Templates',
    description: "Save time with pre-built WhatsApp message templates for common situations like order confirmations, payment reminders, and more.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: 'Festival & Offer Messages',
    description: "Boost your sales during holidays and special events with targeted promotional messages. Announce discounts and special offers with a single click.",
  },
  {
    icon: <Star className="w-8 h-8 text-primary" />,
    title: 'Easy Google Review Scripts',
    description: "Improve your online reputation by sending customers simple, effective scripts to encourage 5-star Google reviews.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything You Need to Grow
          </h2>
          <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl/relaxed mt-4">
            Our Dukaan Growth Kit is packed with features to help you engage customers and increase sales, all through WhatsApp.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {kitFeatures.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center gap-4 p-8 bg-card rounded-lg shadow-sm border">
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
