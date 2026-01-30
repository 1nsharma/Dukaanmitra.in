
import type {Metadata} from 'next';
import './globals.css';
import { cn } from "@/lib/utils";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ChatAssistant from '@/components/chat/chat-assistant';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';

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
    <html lang="en" className="!scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen")}>
        <FirebaseClientProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatAssistant />
            <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
