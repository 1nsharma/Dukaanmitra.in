
import ContactForm from '@/components/landing/contact-form';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageSquare, Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container max-w-4xl py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Have a question or want to talk to sales? We're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
        <Card>
          <CardContent className="p-6">
            <Phone className="mx-auto mb-2 h-8 w-8 text-primary" />
            <h3 className="text-lg font-bold">Call Us</h3>
            <p className="text-muted-foreground">+91 12345 67890</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <MessageSquare className="mx-auto mb-2 h-8 w-8 text-primary" />
            <h3 className="text-lg font-bold">WhatsApp</h3>
            <p className="text-muted-foreground">+91 12345 67890</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Mail className="mx-auto mb-2 h-8 w-8 text-primary" />
            <h3 className="text-lg font-bold">Email</h3>
            <p className="text-muted-foreground">support@dukaanmitra.ai</p>
          </CardContent>
        </Card>
      </div>

      <ContactForm />
    </div>
  );
}
