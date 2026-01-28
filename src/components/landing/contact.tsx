import ContactForm from "./contact-form";

export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-secondary">
      <div className="container grid items-center justify-center gap-8 px-4 text-center md:px-6 lg:grid-cols-2 lg:text-left lg:gap-16">
        <div className="space-y-4">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Get in Touch
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:mx-0">
            Have questions about our platform or pricing? We're here to help. Reach out to our team.
          </p>
        </div>
        <div className="w-full max-w-md mx-auto">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
