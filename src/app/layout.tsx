
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
import StagingBanner from '@/components/layout/staging-banner';

export const metadata: Metadata = {
  title: 'DukaanMitra - Aapka Digital Munim',
  description: 'Transform your Kirana shop with India\'s first AI-powered WhatsApp Munim. No app downloads. Just message and you\'re done.',
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
                <StagingBanner />
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
