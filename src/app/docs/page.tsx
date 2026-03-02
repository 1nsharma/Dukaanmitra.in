
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ShieldCheck, HelpCircle, MessageCircle, Zap, ShieldAlert } from 'lucide-react';
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
    question: 'Mera phone kho gaya toh kya hisaab safe rahega?',
    answer: 'Bilkul! Aapka sara hisaab cloud par secure hai. Naye phone me login karte hi sara data wapas mil jayega. Manual register ki tarah khone ka darr nahi hai.',
  },
];

export default function DocsPage() {
  return (
    <div className="container max-w-4xl py-16 md:py-24">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-xs font-bold uppercase tracking-widest">
          <Zap size={14} /> Quick Start
        </div>
        <h1 className="font-headline text-4xl font-black uppercase tracking-tighter sm:text-6xl">
          Support & <span className="text-primary">Guides</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground font-medium">
          Everything you need to know to automate your shop with the Digital Manual Book.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <Card className="hover:border-primary/50 transition-colors border-2 border-border shadow-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-bold"><FileText className="text-primary"/> Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Learn how to connect your first shop and record transactions via WhatsApp in under 5 minutes.</p>
            <Button variant="link" className="p-0 h-auto text-primary font-bold" asChild>
              <Link href="/blog/upi-lite-kirana">Read 5-Min Guide →</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors border-2 border-border shadow-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-bold"><ShieldCheck className="text-primary"/> Data Safety Pledge</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">A detailed breakdown of how we encrypt your shop data and protect your customer privacy.</p>
            <Button variant="link" className="p-0 h-auto text-primary font-bold" asChild>
              <Link href="/privacy-policy">View Safety Policy →</Link>
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

      <section className="mt-24 p-8 bg-secondary/30 rounded-[40px] border-4 border-border text-center space-y-6 shadow-heavy">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
          <ShieldAlert size={32} />
        </div>
        <h2 className="font-headline text-3xl font-black uppercase tracking-tighter">Need Setup Help?</h2>
        <p className="text-muted-foreground font-medium italic">"Hamari team aapki shop set up karne me madad karegi."</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button size="lg" className="rounded-full h-14 px-10 font-black uppercase tracking-widest" asChild>
            <Link href="/contact">Book Setup Call</Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full h-14 px-10 bg-success/10 border-success/20 text-success hover:bg-success/20 font-black uppercase tracking-widest">
            <MessageCircle className="mr-2" /> WhatsApp Support
          </Button>
        </div>
      </section>
    </div>
  );
}
