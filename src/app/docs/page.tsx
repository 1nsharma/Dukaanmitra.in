import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'What is DukaanMitra?',
    answer: 'DukaanMitra is a comprehensive platform designed to help Kirana store owners digitize and modernize their operations. From WhatsApp integration to AI-powered analytics, we provide the tools you need to succeed.',
  },
  {
    question: 'How does the WhatsApp integration work?',
    answer: 'Our platform allows you to connect your business WhatsApp number to manage customer communication, take orders, and send updates automatically. It streamlines your customer service and sales process.',
  },
  {
    question: 'Is there a mobile app?',
    answer: 'Yes, DukaanMitra offers a powerful mobile app for both Android and iOS. You can manage your entire store, view reports, and handle orders from anywhere, at any time.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'We offer email and chat support for all our plans. Our Enterprise plan includes a dedicated account manager and priority support to ensure your business runs smoothly.',
  },
];

export default function DocsPage() {
  return (
    <div className="container max-w-4xl py-16 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Documentation & Guides
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to know to get started and make the most out of DukaanMitra.
        </p>
      </div>

      <section className="mt-16">
        <h2 className="font-headline text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg">{item.question}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mt-16">
        <h2 className="font-headline text-3xl font-bold mb-6">API Guides</h2>
        <p className="text-muted-foreground">
          Our API documentation is currently under development and will be available soon. For Enterprise customers who need API access, please contact our sales team.
        </p>
      </section>
    </div>
  );
}
