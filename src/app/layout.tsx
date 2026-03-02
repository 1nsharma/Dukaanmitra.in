import type {Metadata} from 'next';
import './globals.css';
import { cn } from "@/lib/utils";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ChatAssistant from '@/components/chat/chat-assistant';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from '@/components/theme-provider';
import Mitraa from '@/components/robot';

export const metadata: Metadata = {
  title: 'MitraOS | The AI Operating System for Local Businesses',
  description: 'MitraOS is the technological backbone for local commerce. DukaanMitra, powered by MitraOS, provides AI-driven business intelligence, automated accounting (Munim AI), and sales growth (Vyapar AI).',
  keywords: 'MitraOS, DukaanMitra, AI Operating System, Kirana Tech, WhatsApp Munim, Vyapar AI, Grahak AI, SMB Automation India',
  openGraph: {
    url: 'https://dukaanmitra.in',
    type: 'website',
    title: 'MitraOS | AI-Powered Business Intelligence for Local Shops',
    description: 'Empower your shop with MitraOS. Automated ledger, smart inventory, and customer loyalty through specialized AI agents.',
    images: [
        {
            url: 'https://images.unsplash.com/photo-1620752763329-37f6d5c5b9f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxraXJhbmElMjBzdG9yZSUyMG93bmVyJTIwcGhvbmV8ZW58MHx8fHwxNzcwMjE3OTM0fDA&ixlib=rb-4.1.0&q=80&w=1200&h=630',
            width: 1200,
            height: 630,
            alt: 'MitraOS - Powering the future of Indian Retail.',
        }
    ],
    siteName: 'MitraOS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MitraOS | The AI Operating System for SMBs',
    description: 'Digitize your shop with Munim AI and Vyapar AI agents on WhatsApp.',
    images: ['https://images.unsplash.com/photo-1620752763329-37f6d5c5b9f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxraXJhbmElMjBzdG9yZSUyMG93bmVyJTIwcGhvbmV8ZW58MHx8fHwxNzcwMjE3OTM0fDA&ixlib=rb-4.1.0&q=80&w=1200&h=630'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-sans antialiased", "min-h-screen")}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <FirebaseClientProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <ChatAssistant />
                <Mitraa />
                <Toaster />
            </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
