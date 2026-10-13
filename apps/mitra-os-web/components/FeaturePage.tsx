import { 
  WhatsAppMockup, 
  DashboardMockup, 
  InventoryMockup, 
  BillingMockup, 
  UdhaarMockup, 
  AnalyticsMockup, 
  CRMMockup, 
  RetailAiMockup 
} from "./ui/Mockups";
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const featureData: Record<string, any> = {
  "whatsapp-ai": {
    title: "WhatsApp AI",
    h1: "WhatsApp AI Munim for Indian Retailers",
    question: "What is a WhatsApp AI Munim?",
    answer:
      "A WhatsApp AI Munim is an intelligent digital assistant that allows shopkeepers to manage billing, inventory, and udhaar simply by chatting on WhatsApp in natural language.",
    explanation:
      'Instead of learning complex POS software, merchants can send messages like "Rahul 500 Chini" to their DukaanMitra WhatsApp number. The AI instantly extracts the customer name, amount, and item, updating the ledger and sending a receipt to the customer. It eliminates the need for app downloads and manual data entry.',
    example:
      'For example, if a customer takes 1kg sugar on credit, you type "Ramesh 40 Chini udhaar". The AI logs ₹40 credit under Ramesh\'s account and sends him a WhatsApp statement automatically.',
    screenshot: "",
    faqs: [
      {
        q: "Do my customers need to install any app?",
        a: "No, customers receive all bills and reminders directly on their existing WhatsApp.",
      },
      {
        q: "Is it secure?",
        a: "Yes, we use enterprise-grade encryption and secure cloud infrastructure.",
      },
    ],
  },
  inventory: {
    title: "Inventory AI",
    h1: "Smart Inventory Management via WhatsApp",
    question: "How can AI help manage shop inventory on WhatsApp?",
    answer:
      "AI automates inventory tracking by instantly reducing stock levels whenever you log a sale on WhatsApp, alerting you before you run out of essential items.",
    explanation:
      "DukaanMitra tracks your purchases and sales in real-time. When you message a sale, the AI updates your Google Sheets or SQL database. It also analyzes sales velocity to predict when you need to reorder items, minimizing dead stock and maximizing profit.",
    example:
      'You buy 50 packets of milk and log "In 50 Milk". After selling 45 packets throughout the day via WhatsApp entries, the AI automatically nudges you: "Only 5 packets of milk left. Reorder soon."',
    screenshot: "",
    faqs: [
      {
        q: "Does it support barcode scanning?",
        a: "Yes, you can scan barcodes using our camera feature.",
      },
      {
        q: "Can I track multiple stores?",
        a: "Yes, the enterprise plan supports multi-store inventory sync.",
      },
    ],
  },
  billing: {
    title: "AI Billing Software",
    h1: "AI Billing Software for India",
    question: "What is the fastest way to generate bills without a PC?",
    answer:
      "The fastest way to generate bills is by using an AI-powered WhatsApp bot that converts casual text or voice notes into professional GST/Non-GST invoices instantly.",
    explanation:
      "Traditional billing software requires typing into dozens of fields. DukaanMitra's AI billing reads a single line of text like \"2 shirt 1000 GST\" and automatically calculates taxes, formats a PDF receipt, and sends it directly to the customer's WhatsApp.",
    example:
      'A customer buys a fan. You type: "Usha Fan 1500 to 9876543210". The customer instantly gets a WhatsApp message with the shop details, item, price, and a link to the PDF invoice.',
    screenshot: "",
    faqs: [
      {
        q: "Can I add my shop logo?",
        a: "Yes, all invoices can be customized with your logo and business details.",
      },
      {
        q: "Is it GST compliant?",
        a: "Yes, the system generates GST-compliant invoices automatically.",
      },
    ],
  },
  udhaar: {
    title: "Udhaar Management",
    h1: "Automated Udhaar Tracking & Recovery",
    question: "How to recover pending Udhaar (credit) faster?",
    answer:
      "Automating polite, timely WhatsApp reminders using an AI ledger helps businesses recover pending Udhaar 3x faster without hurting customer relationships.",
    explanation:
      'Forgetting to ask for pending money is a massive loss for Indian retailers. DukaanMitra maintains a digital khata. It schedules automated, polite reminders for customers whose credit period has expired. This shifts the "asking" burden to the AI.',
    example:
      "If Suresh owes ₹2,000 for 15 days, DukaanMitra automatically sends him a friendly WhatsApp message with a UPI payment link on the 16th day.",
    screenshot: "",
    faqs: [
      {
        q: "Will the reminders annoy customers?",
        a: "No, the reminders are designed to be extremely polite and professional.",
      },
      {
        q: "Can customers pay via UPI?",
        a: "Yes, every reminder includes your direct UPI link for instant payment.",
      },
    ],
  },
  analytics: {
    title: "Retail Analytics",
    h1: "AI Analytics for Retail Shops",
    question: "How can small shops use AI analytics to increase profit?",
    answer:
      "Small shops can use AI analytics to identify their top-selling products, most profitable customers, and optimal reorder times, directly from their WhatsApp data.",
    explanation:
      "DukaanMitra acts as a data scientist for your shop. By analyzing daily transactions, it generates End-of-Day (EOD) reports. It highlights which items bring the most margin, which days are busiest, and which customers are loyal vs churning.",
    example:
      "Every night at 9 PM, you receive a WhatsApp message: \"Today's Sales: ₹12,500. Top item: Basmati Rice. Note: 5 regular customers haven't visited in 30 days. Send them a discount offer?\"",
    screenshot: "",
    faqs: [
      {
        q: "Do I need to understand charts?",
        a: "No, our AI summarizes all data into simple, actionable text insights.",
      },
      {
        q: "Can I export the data?",
        a: "Yes, all data is synced to Google Sheets and can be exported to CSV.",
      },
    ],
  },
  crm: {
    title: "Customer CRM",
    h1: "WhatsApp CRM for Local Businesses",
    question: "What is the best CRM for Indian retail shops?",
    answer:
      "The best CRM for Indian retail is one that integrates seamlessly with WhatsApp, allowing automated loyalty points, personalized offers, and feedback collection.",
    explanation:
      "Building customer loyalty requires consistent engagement. DukaanMitra's CRM features automatically group customers based on their purchase history. You can launch targeted WhatsApp marketing campaigns with 98% open rates without any technical knowledge.",
    example:
      'Filter all customers who bought "Diwali Sweets" last year and send them a 10% discount promo code automatically with one click.',
    screenshot: "",
    faqs: [
      {
        q: "Is it legal to message customers?",
        a: "Yes, as long as you have their consent and adhere to WhatsApp Business policies.",
      },
      {
        q: "Can I collect Google Reviews?",
        a: "Yes, DukaanMitra automatically asks happy customers to rate you on Google.",
      },
    ],
  },
  "retail-ai": {
    title: "Retail AI",
    h1: "AI Commerce Operating System",
    question: "What is an AI Commerce Operating System?",
    answer:
      "An AI Commerce Operating System is a unified platform that handles billing, inventory, CRM, and analytics through natural language interfaces like WhatsApp.",
    explanation:
      "Unlike traditional ERPs that require training and manual data entry across multiple tabs, an AI OS works like a human assistant. It centralizes all business operations into a single conversational interface. It reasons, acts, and reports autonomously.",
    example:
      'You tell the AI: "Run a 15% off campaign for all inactive customers and order 50 boxes of soap." The AI executes the marketing campaign and drafts the purchase order instantly.',
    screenshot: "",
    faqs: [
      {
        q: "Is it expensive?",
        a: "We offer a Free Forever plan for basic usage, making it accessible to all.",
      },
      {
        q: "Do I need technical skills?",
        a: "If you know how to use WhatsApp, you already know how to use our platform.",
      },
    ],
  },
};

const FeaturePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const pathSlug = location.pathname.split("/").pop() || "whatsapp-ai";
  const effectiveSlug = slug || pathSlug;
  const data =
    effectiveSlug && featureData[effectiveSlug]
      ? featureData[effectiveSlug]
      : featureData["whatsapp-ai"];

  // Schema Generation for AI Overviews
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq: any) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.h1,
    description: data.answer,
    image: data.screenshot,
    author: {
      "@type": "Organization",
      name: "DukaanMitra",
    },
    publisher: {
      "@type": "Organization",
      name: "DukaanMitra",
      logo: {
        "@type": "ImageObject",
        url: "https://dukaanmitra.in/logo.svg",
      },
    },
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>{data.title} | DukaanMitra AI</title>
        <meta name="description" content={data.answer} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="bg-slate-900 text-white py-24 px-6 lg:px-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter">
            {data.h1}
          </h1>
          <p className="text-xl text-emerald-400 font-bold max-w-2xl mx-auto">
            {data.title} Workflow & Automation
          </p>
        </div>
      </section>

      {/* AI Overview Optimized Section */}
      <section className="py-24 px-6 lg:px-20 max-w-4xl mx-auto space-y-16">
        <div className="space-y-6 bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 italic tracking-tight">
            {data.question}
          </h2>
          <p className="text-xl md:text-2xl font-bold text-indigo-600 leading-relaxed border-l-4 border-indigo-500 pl-6">
            {data.answer}
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-black text-slate-900 uppercase">
            How It Works in Detail
          </h3>
          <p className="text-lg text-slate-700 leading-relaxed">
            {data.explanation}
          </p>
        </div>

        <div className="bg-slate-900 text-white p-6 md:p-8 rounded-[2rem] space-y-6">
          <h3 className="text-xl font-black text-emerald-400 uppercase">
            Real-World Example
          </h3>
          <p className="text-lg font-medium">{data.example}</p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900">
          {(() => {
            switch (effectiveSlug) {
              case "whatsapp-ai":
                return <WhatsAppMockup />;
              case "inventory":
                return <InventoryMockup />;
              case "billing":
                return <BillingMockup />;
              case "udhaar":
                return <UdhaarMockup />;
              case "analytics":
                return <AnalyticsMockup />;
              case "crm":
                return <CRMMockup />;
              case "retail-ai":
                return <RetailAiMockup />;
              default:
                return <DashboardMockup />;
            }
          })()}
        </div>

        <div className="space-y-8 pt-12 border-t border-slate-200">
          <h3 className="text-3xl font-black text-slate-900 uppercase italic">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {data.faqs.map((faq: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
              >
                <h4 className="text-xl font-bold text-slate-800 mb-2">
                  {faq.q}
                </h4>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturePage;
