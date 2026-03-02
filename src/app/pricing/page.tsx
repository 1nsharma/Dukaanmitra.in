import { Check, ShieldCheck, Zap, HelpCircle } from 'lucide-react';
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
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Transparent <span className="text-primary">Pricing.</span>
          </h1>
          <p className="text-lg text-muted-foreground">No hidden fees. No long-term contracts. Cancel anytime.</p>
          <div className="flex justify-center items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground pt-4">
              <span className="flex items-center gap-1"><ShieldCheck size={14}/> Secure Payments</span>
              <span className="flex items-center gap-1"><Zap size={14}/> Instant Activation</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 items-stretch">
          {plans.map((plan) => (
            <Card
              key={plan.title}
              className={cn(
                'flex flex-col rounded-[40px] bg-card border-2 border-border transition-all duration-normal motion-safe:hover:scale-[1.03] motion-safe:hover:border-primary', 
                plan.isRecommended && 'border-primary ring-4 ring-primary/20 shadow-heavy shadow-primary/10'
              )}
            >
              <CardHeader className="items-center text-center pb-8">
                  <div className="h-8 mb-4">
                    {plan.isRecommended && <span className="bg-primary text-primary-foreground text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</span>}
                  </div>
                  <CardTitle className="font-headline text-2xl font-black uppercase tracking-tight">{plan.title}</CardTitle>
                  <div className="flex items-baseline mt-4">
                  <span className="font-headline text-5xl font-black tracking-tighter">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground font-semibold ml-1">{plan.period}</span>}
                  </div>
                  <CardDescription className="pt-2 h-12 text-xs font-medium">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 px-8">
                  <ul className="space-y-4">
                  {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                      <Check className="w-4 h-4 text-success mr-3 mt-1 shrink-0" />
                      <span className="text-sm text-muted-foreground font-medium">{feature}</span>
                      </li>
                  ))}
                  </ul>
              </CardContent>
              <CardFooter className="p-8">
                  <Button asChild className={cn('w-full rounded-full font-black text-lg py-7 uppercase tracking-widest')} variant={plan.isRecommended ? "default" : "secondary"}>
                  <Link href={plan.cta === 'Contact Us' ? '/contact' : '/login?register=true'}>{plan.cta}</Link>
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-24 max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center bg-secondary/30 p-12 rounded-[40px] border border-border">
            <div className="space-y-4">
                <h3 className="font-headline text-3xl font-black uppercase tracking-tighter">Decision <span className="text-primary">Tension?</span></h3>
                <p className="text-muted-foreground font-medium">“Agar 14 din me value na mile to cancel, no questions asked.” Hum jaante hain aapka business kitna important hai.</p>
                <div className="pt-4">
                    <Button variant="outline" className="rounded-full font-bold h-12 px-6" asChild>
                        <Link href="/contact"><HelpCircle className="mr-2 h-4 w-4"/> Talk to Sales</Link>
                    </Button>
                </div>
            </div>
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0"><Check size={20}/></div>
                    <p className="text-sm font-bold uppercase tracking-tight">Free Setup Help on Call/WhatsApp</p>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0"><Check size={20}/></div>
                    <p className="text-sm font-bold uppercase tracking-tight">GST-Ready Exports Included</p>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0"><Check size={20}/></div>
                    <p className="text-sm font-bold uppercase tracking-tight">No Hidden Transaction Fees</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
