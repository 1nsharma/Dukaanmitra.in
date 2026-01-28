import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getPlaceholderImage } from '@/lib/placeholder-images';

export default function Hero() {
  const heroImage = getPlaceholderImage('hero');

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 container flex flex-col items-center gap-6 px-4 md:px-6">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Empower Your Kirana Store
        </h1>
        <p className="max-w-[700px] text-lg text-primary-foreground/80 md:text-xl">
          DukaanMitra is your trusted partner in modernizing your business with powerful, easy-to-use digital tools.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="#pricing">Explore Plans</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
