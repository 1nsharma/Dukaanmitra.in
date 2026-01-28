import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, LayoutDashboard, MessageCircle, Smartphone } from 'lucide-react';

const features = [
  {
    icon: <MessageCircle className="w-10 h-10 text-primary" />,
    title: 'WhatsApp Integration',
    description: 'Engage customers, take orders, and provide support directly through WhatsApp.',
  },
  {
    icon: <Smartphone className="w-10 h-10 text-primary" />,
    title: 'Mobile App',
    description: 'Manage your store from anywhere with our intuitive and powerful mobile application.',
  },
  {
    icon: <LayoutDashboard className="w-10 h-10 text-primary" />,
    title: 'Admin Panels',
    description: 'Get a complete overview of your business with our comprehensive admin dashboards.',
  },
  {
    icon: <BrainCircuit className="w-10 h-10 text-primary" />,
    title: 'AI-Powered Tools',
    description: 'Leverage AI for inventory management, sales forecasting, and customer insights.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything You Need to Succeed
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed mt-4">
            DukaanMitra provides a comprehensive suite of tools to help you grow your business.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                {feature.icon}
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
