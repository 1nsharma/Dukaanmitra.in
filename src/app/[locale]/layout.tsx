import type {Metadata} from 'next';
import '../globals.css';
import { cn } from "@/lib/utils";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from '@/components/theme-provider';
import HoldVerificationGate from '@/components/security/hold-verification-gate';
import dynamic from 'next/dynamic';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';

// Dynamically load heavy interactive components to improve initial page load speed
const ChatAssistant = dynamic(() => import('@/components/chat/chat-assistant'), { ssr: false });
const Mitraa = dynamic(() => import('@/components/robot'), { ssr: false });

export async function generateMetadata({params: {locale}}: {params: {locale: string}}): Promise<Metadata> {
  const t = await getTranslations({locale, namespace: 'Metadata'});
 
  return {
    title: t('title'),
    description: t('description'),
    keywords: 'digital khata, udhaar app, kirana software, WhatsApp Munim, Kirana Billing, Udhaar Ledger, Indian Shop AI, MitraOS, Retail Intelligence India, GST Billing WhatsApp, Digital Manual Book',
    authors: [{ name: 'MitraOS Team' }],
    openGraph: {
      url: 'https://dukaanmitra.in',
      type: 'website',
      title: t('title'),
      description: t('description'),
      images: [
          {
              url: 'https://images.unsplash.com/photo-1620752763329-37f6d5c5b9f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxraXJhbmElMjBzdG9yZSUyMG93bmVyJTIwcGhvbmV8ZW58MHx8fHwxNzcwMjE3OTM0fDA&ixlib=rb-4.1.0&q=80&w=1200&h=630',
              width: 1200,
              height: 630,
              alt: 'DukaanMitra - The Digital Manual Book.',
          }
      ],
      siteName: 'MitraOS',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['https://images.unsplash.com/photo-1620752763329-37f6d5c5b9f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxraXJhbmElMjBzdG9yZSUyMG93bmVyJTIwcGhvbmV8ZW58MHx8fHwxNzcwMjE3OTM0fDA&ixlib=rb-4.1.0&q=80&w=1200&h=630'],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function RootLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // JSON-LD Structured Data for SEO
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "DukaanMitra (MitraOS)",
      "description": "AI-Powered WhatsApp Digital Munim and Udhaar App for Indian Kirana Stores.",
      "url": "https://dukaanmitra.in",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "1999",
        "priceCurrency": "INR"
      },
      "author": {
        "@type": "Organization",
        "name": "MitraOS Technologies"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "DukaanMitra",
      "operatingSystem": "Any",
      "applicationCategory": "BusinessApplication",
      "description": "India's first AI-powered WhatsApp Munim for Kirana stores. Manage udhaar, sales, and inventory via WhatsApp.",
      "softwareVersion": "2.0.0",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "author": {
        "@type": "Person",
        "name": "Amit Sharma"
      },
      "featureList": [
        "WhatsApp-First Interface",
        "AI-Powered Transaction Extraction",
        "Automated Ledger Management",
        "Real-time Udhaar Tracking",
        "Daily Sales Reports",
        "Retail Intelligence Insights"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I start using DukaanMitra?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply send 'START' to our WhatsApp number +91 63937 41171. No app download is required."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data safe?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we use enterprise-grade encryption and secure cloud storage (Firebase) to ensure your shop's data is always protected."
          }
        }
      ]
    }
  ];

  return (
    <html lang={locale} className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:wght@400;500;700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cn("font-sans antialiased", "min-h-screen")}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
          >
              <FirebaseClientProvider>
                  <HoldVerificationGate>
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                    <ChatAssistant />
                    <Mitraa />
                    <Toaster />
                  </HoldVerificationGate>
              </FirebaseClientProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
