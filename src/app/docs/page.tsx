import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ShieldCheck, HelpCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const faqItems = [
  {
    question: 'DukaanMitra set up karne me kitna time lagta hai?',
    answer: 'Sirf 2 minute. Aapko bas apna business WhatsApp number connect karna hai aur shop code set karna hai. Uske baad aap directly WhatsApp se billing shuru kar sakte hain.',
  },
  {
    question: 'Kya mera data safe hai? Kya competitors dekh sakte hain?',
    answer: 'Aapka data 100% private aur encrypted hai. Hum aapka sales ya customer data kisi ke saath share nahi karte. MitraOS industry-standard security use karta hai jo bank-level safety provide karti hai.',
  },
  {
    question: 'Agar internet nahi chal raha toh kya hoga?',
    answer: 'DukaanMitra WhatsApp-native hai. Jab bhi aapka internet wapas aayega, aapke messages process ho jayenge. Dashboard offline hone par bhi aap WhatsApp par entry bhej sakte hain.',
  },
  {
    question: 'Kya main purana udhaar data import kar sakta hoon?',
    answer: 'Ji haan! Aap hamare Support team ko excel/CSV sheet bhej sakte hain aur hum usey aapke digital ledger me import kar denge.',
  },
  {
    question: 'Account block toh nahi hoga WhatsApp par?',
    answer: 'Nahi. Hum official Meta Business APIs use karte hain, jo business automation ke liye hi bani hain. Yeh koi "unofficial mod" nahi hai, isliye aapka account safe hai.',
  },
];

export default function DocsPage() {
  return (
    <div className="container max-w-4xl py-16 md:py-24">
      <div className="text-center space-y-4 mb-16">
        <h1 className="font-headline text-4xl font-black uppercase tracking-tighter sm:text-6xl">
          Support & <span className="text-primary">Guides</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to know to automate your shop with MitraOS.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="text-primary"/> Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Learn how to connect your first shop and record transactions via WhatsApp in under 5 minutes.</p>
            <Button variant="link" className="p-0 h-auto text-primary" asChild>
              <Link href="/blog/upi-lite-kirana">Read Guide →</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-primary"/> Data Safety Manual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">A detailed breakdown of how we encrypt your shop data and protect your customer privacy.</p>
            <Button variant="link" className="p-0 h-auto text-primary" asChild>
              <Link href="/privacy-policy">View Policy →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <HelpCircle className="text-primary w-8 h-8" />
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-border py-2">
              <AccordionTrigger className="text-lg font-bold text-left hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mt-24 p-8 bg-secondary/30 rounded-3xl border border-border text-center space-y-6">
        <h2 className="font-headline text-3xl font-black uppercase tracking-tighter">Still have questions?</h2>
        <p className="text-muted-foreground">Hamari team aapki help ke liye hamesha ready hai.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="rounded-full" asChild>
            <Link href="/contact">Talk to Support</Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full bg-success/10 border-success/20 text-success hover:bg-success/20">
            <MessageCircle className="mr-2" /> WhatsApp Help
          </Button>
        </div>
      </section>
    </div>
  );
}
