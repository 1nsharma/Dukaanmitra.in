
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const plans = [
  {
    title: 'Free Trial',
    price: '₹0',
    period: '/ 14 days',
    description: 'Get a feel for our platform.',
    features: ['Basic WhatsApp Integration', 'Mobile App Access', '1 Admin User', 'Basic Analytics', '100 Customers Limit'],
    isRecommended: false,
    cta: 'Start Trial',
  },
  {
    title: 'Basic',
    price: '₹1999',
    period: '/ month',
    description: 'Perfect for small stores just getting started.',
    features: ['Full WhatsApp Integration', 'Mobile App Access', '2 Admin Users', 'Standard Analytics & Reports', '1,000 Customers'],
    isRecommended: false,
    cta: 'Choose Basic',
  },
  {
    title: 'Pro',
    price: '₹4999',
    period: '/ month',
    description: 'For growing businesses that need more power.',
    features: ['All Basic features', 'AI-Powered Tools', '5 Admin Users', 'Advanced Analytics & Reports', 'Unlimited Customers'],
    isRecommended: true,
    cta: 'Choose Pro',
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large-scale operations.',
    features: ['All Pro features', 'Dedicated API Access', 'Unlimited Users', 'Dedicated Onboarding & Support', 'Custom Integrations'],
    isRecommended: false,
    cta: 'Contact Us',
  },
];

export default function PricingPage() {
  return (
    <div className="bg-background">
      <div className="container py-24 sm:py-32">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
            Simple, transparent pricing for every Kirana.
          </h1>
          <p className="text-lg text-muted-foreground mt-4">No hidden fees. No long-term contracts. Cancel anytime.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 items-start">
          {plans.map((plan) => (
            <Card
              key={plan.title}
              className={cn(
                'flex flex-col rounded-3xl bg-secondary/50 border-2 border-border transition-all duration-300 hover:scale-[1.03] hover:border-primary', 
                plan.isRecommended && 'border-primary ring-4 ring-primary/20 shadow-2xl shadow-primary/10'
              )}
            >
              <CardHeader className="items-center text-center">
                  <CardTitle className="text-2xl font-bold uppercase tracking-tight">{plan.title}</CardTitle>
                  <div className="flex items-baseline">
                  <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground font-semibold">{plan.period}</span>}
                  </div>
                  <CardDescription className="pt-2 h-12">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                  <ul className="space-y-4">
                  {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mr-3 mt-1 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                      </li>
                  ))}
                  </ul>
              </CardContent>
              <CardFooter>
                  <Button asChild className={cn('w-full rounded-full font-bold text-lg py-7')} variant={plan.isRecommended ? "default" : "secondary"}>
                  <Link href={plan.cta === 'Contact Us' ? '/contact' : '/login?register=true'}>{plan.cta}</Link>
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center space-y-4 max-w-2xl mx-auto">
          <p className="font-bold text-lg text-foreground">“Agar 14 din me value na mile to cancel, no questions asked.”</p>
          <p className="text-primary font-bold text-lg">“Free setup help on call/WhatsApp.”</p>
        </div>
      </div>
    </div>
  );
}
