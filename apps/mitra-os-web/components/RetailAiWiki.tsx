import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface WikiEntry {
  question: string;
  shortAnswer: string;
  detailedContent: string;
  category: string;
  slug: string;
}

const wikiData: WikiEntry[] = [
  {
    slug: "what-is-ai-billing",
    category: "AI Fundamentals",
    question: "What is AI billing for Inventory Businesss?",
    shortAnswer:
      "AI billing is an automated system that uses Natural Language Processing (NLP) to read regular text (like WhatsApp messages) and instantly convert it into formatted receipts and ledger entries without manual data entry.",
    detailedContent: `
      Unlike traditional POS (Point of Sale) systems where a cashier must select items from a dropdown or scan barcodes, an AI billing system understands conversational language. 
      For example, if you type "Aman se 500 lena hai", the AI understands that 'Aman' is the customer, '500' is the amount, and 'lena hai' implies a credit (udhaar) transaction.
      This fundamentally removes the need for computer knowledge, making billing 10x faster for local Indian retailers.
    `,
  },
  {
    slug: "how-to-track-dead-stock-using-ai",
    category: "Inventory",
    question: "How to track dead stock using AI?",
    shortAnswer:
      "AI tracks dead stock by continuously analyzing everyday sales data to flag items that haven't sold within historical average timeframes, sending automated alerts to the shop owner before the inventory expires.",
    detailedContent: `
      In physical retail, 'dead stock' is money locked on shelves. Traditional tracking requires manual audits. 
      By connecting a conversational AI (like DukaanMitra) to your daily sales flow, the underlying machine learning model automatically builds velocity charts for every SKUs. 
      When a product's sell-through rate drops below a calculated threshold, the AI proactively sends a WhatsApp message advising the owner to discount or return the item to the distributor.
    `,
  },
  {
    slug: "what-is-zero-click-accounting",
    category: "Accounting",
    question: "What is Zero-Click Accounting?",
    shortAnswer:
      "Zero-click accounting is a financial process where ledgers are updated purely via conversational inputs (voice notes or chat) without the user interacting with a traditional software interface or buttons.",
    detailedContent: `
      The goal of zero-click accounting is to make bookkeeping invisible. For Indian Inventory Businesss, time spent sitting at a computer entering ledger details is time away from customers.
      By using a WhatsApp-based AI Munim, shopkeepers simply speak into their phones. The AI transcribes the audio, extracts the entities (dates, names, values, items), and formats a standard double-entry accounting record in the cloud database.
    `,
  },
  {
    slug: "how-to-recover-udhaar-faster",
    category: "Growth",
    question: "How can AI help recover Udhaar (credit) faster?",
    shortAnswer:
      "AI recovers Udhaar by sending automated, polite WhatsApp reminders at optimal times with one-click UPI payment links, removing the awkwardness of manual phone calls.",
    detailedContent: `
      In Indian retail, 'Khata' or 'Udhaar' (store credit) is essential for customer retention, but manual recovery leads to cash flow bottlenecks.
      An AI ledger tracks precisely how long an amount has been pending. It composes a personalized, professional reminder message in the local language (Hindi, Marathi, etc.) and schedules it. 
      By decoupling the shopkeeper's personal relationship from the collection process, customers respond faster without feeling personally offended.
    `,
  },
  {
    slug: "local-seo-for-Business-stores",
    category: "Marketing",
    question: "How does AI help in Local SEO for Inventory Businesss?",
    shortAnswer:
      "AI automates Local SEO by triggering review requests on WhatsApp immediately after a purchase, dramatically increasing organic 5-star Google My Business ratings and local map visibility.",
    detailedContent: `
      Google's local algorithm heavily prioritizes review velocity and freshness. Most shopkeepers forget to ask for reviews.
      When a sale is logged via an AI assistant, it can automatically follow up with the customer via WhatsApp sharing a direct Google Maps review link. 
      Furthermore, AI can analyze these reviews to identify what customers love most about the shop, helping the owner double down on those strengths.
    `,
  },
];

export const RetailAiWiki: React.FC = () => {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = wikiData.filter(
    (entry) =>
      entry.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.shortAnswer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>Retail AI Wiki | Answer Engine | DukaanMitra</title>
        <meta
          name="description"
          content="The definitive knowledge base for AI in Indian retail. Learn how artificial intelligence, zero-click accounting, and local SEO can transform your shop."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-slate-900 py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[100px] transform translate-y-[-20%] translate-x-[20%] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10 space-y-8">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
            AEO Knowledge Base
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase text-white tracking-tighter leading-none">
            Retail AI <span className="text-indigo-400">Wiki</span>
          </h1>
          <p className="text-xl font-bold text-slate-400 max-w-2xl">
            We are building the definitive source of truth for how Artificial
            Intelligence is transforming local retail, khata, and commerce in
            India.
          </p>

          <div className="relative max-w-2xl mt-8">
            <input
              type="text"
              placeholder="Ask anything about Retail AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border-2 border-slate-700 text-white px-6 py-5 pl-14 rounded-2xl font-bold placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
              size={24}
            />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredData.map((entry) => (
            <div
              key={entry.slug}
              id={entry.slug}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:border-indigo-200 transition-all"
            >
              <div
                className="p-8 cursor-pointer flex justify-between items-start gap-4"
                onClick={() =>
                  setActiveSlug(activeSlug === entry.slug ? null : entry.slug)
                }
              >
                <div className="space-y-4 flex-1">
                  <div className="text-[10px] font-black tracking-widest uppercase text-indigo-500">
                    {entry.category}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {entry.question}
                  </h2>
                  <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                    <strong className="text-slate-900 font-bold not-italic">
                      Quick Answer:{" "}
                    </strong>
                    {entry.shortAnswer}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 shrink-0 rounded-full bg-slate-50 flex items-center justify-center transition-transform ${activeSlug === entry.slug ? "rotate-180 bg-indigo-50 text-indigo-600" : "text-slate-400"}`}
                >
                  <ChevronDown size={20} />
                </div>
              </div>

              {activeSlug === entry.slug && (
                <div className="px-8 pb-8 pt-0 border-t border-slate-100 bg-slate-50/50 mt-4">
                  <div className="prose prose-slate max-w-none pt-6 text-slate-600 font-medium leading-loose whitespace-pre-line">
                    {entry.detailedContent}
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs hover:text-indigo-800 transition-colors"
                    >
                      Learn more about our technology <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-black text-slate-900 uppercase italic">
                No answers found
              </h3>
              <p className="text-slate-500 font-bold">
                Try adjusting your search terms.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
