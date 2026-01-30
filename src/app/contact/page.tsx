
import ContactForm from '@/components/landing/contact-form';

export default function ContactPage() {
  return (
    <div className="container max-w-2xl py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Have a question or want to talk to sales? Fill out the form below or call us.
        </p>
      </div>
      <ContactForm />
    </div>
  );
}
