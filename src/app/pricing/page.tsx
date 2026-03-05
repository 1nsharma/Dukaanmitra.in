import { Check, ShieldCheck, Zap, HelpCircle, BadgeCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const plans = [
  {
    title: 'Free Trial',
    price: '₹0',
    period: '/ 90 days',
    description: 'Pilot program special. Full access for 10 shops.',
    features: ['WhatsApp Integration', 'Digital Munim', 'Daily Summaries', 'Unlimited Customers', 'Hinglish AI'],
    isRecommended: false,
    cta: 'Start Free Trial',
  },
  {
    title: 'Mitra Plan',
    price: '₹499',
    period: '/ month',
    description: 'Everything you need to grow your local shop.',
    features: ['Auto Payment Reminders', 'Loyalty Offers', 'Google Review Booster', 'Sales Analytics', 'Priority Support'],
    isRecommended: true,
    cta: 'Activate Mitra',
  },
  {
    title: 'Vyapari Pro',
    price: '₹999',
    period: '/ month',
    description: 'For busy shops with staff and multiple locations.',
    features: ['Everything in Mitra', 'Multi-Staff Access', 'Inventory Alerts', 'Advanced Growth AI', 'Custom Reports'],
    isRecommended: false,
    cta: 'Go Pro',
  }
];

export default function PricingPage() {
  return (
    <div className="bg-background">
      <div className="container py-24 sm:py-32">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-xs font-bold uppercase tracking-widest border border-primary/20 mb-4">
            < Zap size={14} /> Bharat-First Pricing
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Digital Munim, <br/> <span className="text-primary">Pocket-Friendly Price.</span>
          </h1>
          <p className="text-lg text-muted-foreground italic font-medium">"Bas bill bhejo, baaki system yaad rakhega."</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
          {plans.map((plan) => (
            <Card
              key={plan.title}
              className={cn(
                'flex flex-col rounded-[2.5rem] bg-card border-2 border-border transition-all duration-300 hover:scale-[1.02]', 
                plan.isRecommended && 'border-primary ring-4 ring-primary/10 shadow-heavy'
              )}
            >
              <CardHeader className="items-center text-center pb-8">
                  {plan.isRecommended && <span className="bg-primary text-primary-foreground text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">Most Popular</span>}
                  <CardTitle className="font-headline text-2xl font-black uppercase tracking-tight">{plan.title}</CardTitle>
                  <div className="flex items-baseline mt-4">
                  <span className="font-headline text-5xl font-black tracking-tighter">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground font-semibold ml-1">{plan.period}</span>}
                  </div>
                  <CardDescription className="pt-2 text-xs font-medium leading-relaxed">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 px-8">
                  <ul className="space-y-4">
                  {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                      <Check className="w-4 h-4 text-primary mr-3 mt-1 shrink-0" />
                      <span className="text-sm text-muted-foreground font-medium">{feature}</span>
                      </li>
                  ))}
                  </ul>
              </CardContent>
              <CardFooter className="p-8">
                  <Button asChild className={cn('w-full rounded-2xl font-black text-lg py-7 uppercase tracking-widest shadow-lg')} variant={plan.isRecommended ? "default" : "secondary"}>
                  <Link href="/login">{plan.cta}</Link>
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-24 text-center">
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-4">Trusted by shops in your city</p>
            <div className="flex justify-center gap-8 opacity-50 grayscale">
                <span className="font-black text-xl">SHARMA STORE</span>
                <span className="font-black text-xl">APNA CAFE</span>
                <span className="font-black text-xl">NEW MEDICO</span>
            </div>
        </div>
      </div>
    </div>
  );
}