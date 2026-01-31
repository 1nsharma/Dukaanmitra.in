
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    ArrowRight, MessageSquare, BookOpen, BarChart3, Bell, Users,
    ShieldCheck, Smartphone, Zap, Bot
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';

const features = {
  "WhatsApp Munim": {
    description: "Entries, receipts, and reminders all happen over WhatsApp. No app needed.",
    items: [
      { title: "Natural Language Entry", description: 'Type "Ravi 500 udhaar" and our AI understands.', icon: <Bot /> },
      { title: "Automatic Digital Receipts", description: "Customers get instant confirmation on WhatsApp.", icon: <MessageSquare /> },
      { title: "Automated Payment Reminders", description: "Polite, timely reminders for pending payments.", icon: <Bell /> },
      { title: "End-of-Day Summary", description: "Get a full sales and credit report every night on WhatsApp.", icon: <BarChart3 /> },
    ]
  },
  "Digital Ledger & Udhaar Management": {
    description: "A secure, cloud-based ledger that never gets lost or damaged.",
    items: [
      { title: "Centralized Credit View", description: "See all pending udhaar from all customers in one place.", icon: <BookOpen /> },
      { title: "Customer-wise Ledger", description: "Drill down into the full transaction history for any customer.", icon: <Users /> },
      { title: "Payment Confirmation", description: 'Log payments easily: "Ravi paid 500".', icon: <ShieldCheck /> },
      { title: "Error Correction", description: "Easily edit or delete wrong entries from the dashboard.", icon: <Zap /> },
    ]
  },
  "Smart Reports & Daily Closing": {
    description: "Make data-driven decisions with powerful, easy-to-understand reports.",
    items: [
      { title: "Live Sales Dashboard", description: "Track your revenue, bills, and average sale value in real-time.", icon: <BarChart3 /> },
      { title: "Daily & Monthly Closing Reports", description: "Automated financial summaries to save you time.", icon: <BarChart3 /> },
      { title: "Product & Category Analysis", description: "See which items are your best-sellers.", icon: <BarChart3 /> },
      { title: "Data Export", description: "Export your sales and customer data to CSV for offline analysis.", icon: <BarChart3 /> },
    ]
  },
  "Customer Intelligence": {
    description: "Understand your customers better to increase loyalty and sales.",
    items: [
      { title: "Automatic Customer Database", description: "Every new number is a new customer profile.", icon: <Users /> },
      { title: "Customer Segmentation", description: "Automatically identify new, regular, and VIP customers.", icon: <Users /> },
      { title: "Purchase History", description: "See what a customer buys and how often they visit.", icon: <Users /> },
      { title: "Churn Detection", description: "Get alerts when a regular customer might be at risk of leaving.", icon: <Users /> },
    ]
  },
  "Inventory & Low Stock Alerts": {
    description: "Manage your stock intelligently to prevent losses.",
    items: [
        { title: "Simple Stock Entry", description: "Add your products and their stock levels.", icon: <BarChart3 /> },
        { title: "Automatic Stock Deduction", description: "Stock is updated automatically when you make a sale.", icon: <BarChart3 /> },
        { title: "Low Stock Alerts", description: "Get timely WhatsApp alerts before you run out of a popular item.", icon: <Bell /> },
        { title: "Fast-Moving Item Reports", description: "Identify which products are your top performers.", icon: <BarChart3 /> },
    ]
  },
  "Secure Cloud & Multi-Device Access": {
    description: "Your data is safe, secure, and accessible from anywhere.",
    items: [
        { title: "Full Data Encryption", description: "All your business data is encrypted and secure.", icon: <ShieldCheck /> },
        { title: "Automatic Cloud Backup", description: "Never worry about losing your hisaab-kitaab again.", icon: <ShieldCheck /> },
        { title: "Mobile & Desktop Dashboard", description: "Access your dashboard from your phone, tablet, or computer.", icon: <Smartphone /> },
        { title: "Multi-User & Staff Access", description: "Give access to your staff with specific permissions (Pro Plan).", icon: <Users /> },
    ]
  }
};

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
    <Card className="bg-card/50 hover:border-primary/50 hover:bg-card transition-all transform hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
            <CardTitle className="text-lg font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

interface SectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const FeatureSection: React.FC<SectionProps> = ({ title, description, children }) => (
    <section className="py-16 border-b border-border last:border-b-0">
        <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">{title}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {children}
        </div>
    </section>
);


export default function FeaturesPage() {
  return (
    <div className="container py-16 md:py-24 space-y-12">
      {/* 1. Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter">
          Features
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Everything you get with DukaanMitra to grow your business.
        </p>
      </section>

      {Object.entries(features).map(([title, data]) => (
        <FeatureSection key={title} title={title} description={data.description}>
          {data.items.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </FeatureSection>
      ))}

      {/* Call to Action */}
      <section className="text-center py-16 bg-card rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Digitize Your Dukaan?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Start your 14-day free trial today. No credit card required. Cancel anytime.</p>
        <Button size="lg" className="px-8 h-12 text-lg font-bold" asChild>
            <Link href="/login?register=true">
              Start Free Trial
              <ArrowRight className="ml-2"/>
            </Link>
        </Button>
      </section>
    </div>
  );
}
