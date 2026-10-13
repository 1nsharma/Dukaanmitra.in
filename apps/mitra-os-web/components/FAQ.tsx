import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("Whatsapp");

  const faqData = {
    Whatsapp: [
      {
        q: "How do I start using WhatsApp Munim?",
        a: "<strong>Just sign up with your mobile number on our website to get a dedicated WhatsApp Munim number.</strong><br/><br/>Steps to start:<br/><ul><li>Register on dukaanmitra.in</li><li>Save your dedicated AI Munim number</li><li>Say 'Hi' and start logging entries like 'Rahul 500 udhar'</li></ul>",
      },
      {
        q: "Do my customers need to install DukaanMitra app?",
        a: "<strong>No! Your customers do not need to install any apps. Everything happens on simple SMS or WhatsApp.</strong><br/><br/>How it works for customers:<br/><ul><li>You log an entry through your WhatsApp Munim</li><li>Customers receive a friendly SMS/WhatsApp with balance</li><li>Trust increases automatically</li></ul>",
      },
      {
        q: "Can I take orders on WhatsApp?",
        a: "<strong>Yes, you can share your custom WhatsApp catalog link to customers to take direct online orders.</strong><br/><br/>Key benefits:<br/><ul><li>DukaanMitra tracks incoming orders automatically</li><li>Alerts you instantly on your dashboard</li><li>Customers order easily without downloading apps</li></ul>",
      },
      {
        q: "What happens if I lose my phone?",
        a: "<strong>Nothing is lost! Since the AI Munim operates on WhatsApp via cloud, your data is 100% safe.</strong><br/><br/>To recover:<br/><ul><li>Log into WhatsApp on a new phone</li><li>Your entire history is instantly restored</li><li>No local phone storage is used</li></ul>",
      },
    ],
    Security: [
      {
        q: "Is my Khata data safe from competitors?",
        a: "<strong>Absolutely. We use bank-grade 256-bit encryption ensuring no competitor or third-party can access your customer list.</strong><br/><br/>Security features:<br/><ul><li>Automated daily backups</li><li>Strict Vercel AI sandboxing</li><li>Firebase Enterprise cloud security</li></ul>",
      },
      {
        q: "Who owns the data?",
        a: "<strong>You are the sole owner of your data. We strictly do not sell, share, or analyze personal shop data for ads.</strong><br/><br/>Our promise:<br/><ul><li>DukaanMitra acts merely as your software provider</li><li>No targeted advertising using your customers</li><li>Complete privacy maintained</li></ul>",
      },
      {
        q: "Can I download my entire shop history?",
        a: "<strong>Yes. From the Admin Dashboard, you can export your entire ledger, sales history, and customer book anytime.</strong><br/><br/>Export formats available:<br/><ul><li>Excel (.xlsx)</li><li>CSV files</li><li>PDF summary reports</li></ul>",
      },
    ],
    "Hindi/Local Help": [
      {
        q: "Kya mujhe English aani chahiye software use karne ke liye?",
        a: "<strong>Nahi. DukaanMitra ka AI Hinglish (Hindi + English) aasaani se samajhta hai, aap bolkar bhi entry kar sakte hain.</strong><br/><br/>Example usage:<br/><ul><li>Type: 'Aman ne 200 pay kiye'</li><li>Voice Note: 'Rahul bhaiyya ke 500 udhar likho'</li><li>AI naturally tracks everything</li></ul>",
      },
      {
        q: "Kya DukaanMitra free hai?",
        a: "<strong>Aapke liye 14-days ka completely free trial hai (no credit card required), uske baad bohot affordable plans hain.</strong><br/><br/>Pricing highlights:<br/><ul><li>Micro-retailers ke liye chai ki cost se bhi sasta</li><li>Transparent billing, no hidden fees</li><li>100% ROI from day 1</li></ul>",
      },
      {
        q: "Agar internet na chale toh?",
        a: "<strong>Internet na hone par bhi aapka WhatsApp message pending rahega, network aate hi automatically update ho jayega.</strong><br/><br/>Offline-friendly behavior:<br/><ul><li>Message queue mein safe rehta hai</li><li>No data loss on slow networks</li><li>Immediate sync up on internet recovery</li></ul>",
      },
    ],
    Pricing: [
      {
        q: "What is the monthly cost?",
        a: "<strong>For micro-retailers, our basic tier is extremely affordable—starting lower than your daily cup of chai.</strong><br/><br/>Cost benefits:<br/><ul><li>Pay only for what you use</li><li>Local city-wise discounted plans available</li><li>Check Pricing page for latest offers</li></ul>",
      },
      {
        q: "Are there hidden SMS charges?",
        a: "<strong>No. All WhatsApp messaging costs, including customer reminder alerts, are included in your active plan.</strong><br/><br/>What you get:<br/><ul><li>Unlimited khata entries</li><li>Free customer payment reminders</li><li>Zero hidden telecom charges</li></ul>",
      },
      {
        q: "Can I manage multiple shops on one plan?",
        a: "<strong>Yes, our Enterprise and Growth plans allow you to add multiple branches or staff members under one master account.</strong><br/><br/>Multi-store management features:<br/><ul><li>Staff access control</li><li>Branch-wise analytics</li><li>Consolidated owner dashboard</li></ul>",
      },
    ],
  };

  const currentFaqs = faqData[activeCategory as keyof typeof faqData];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Object.values(faqData)
      .flat()
      .map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
  };

  return (
    <div className="bg-slate-50 min-h-screen py-20 px-6">
      <Helmet>
        <title>FAQ | DukaanMitra - AI Shop Management Answers</title>
        <meta
          name="description"
          content="Find answers to common questions about DukaanMitra AI WhatsApp assistant. Learn how to manage your Inventory Business digitally, data security policies, and more."
        />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-bold uppercase tracking-widest text-[10px] mb-4">
            Help Center
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
            Frequently Asked
            <br />
            <span className="text-indigo-600">Questions</span>
          </h1>
          <p className="text-slate-500 font-bold italic text-xl max-w-2xl mx-auto">
            Everything you need to know about the product, billing, security,
            and how to automate your shop.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-2">
            {Object.keys(faqData).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full text-left px-6 py-4 rounded-2xl font-black italic tracking-widest uppercase transition-all ${
                  activeCategory === category
                    ? "bg-indigo-600 text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                    : "bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Content */}
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-black italic uppercase text-slate-900 mb-8 pb-4 border-b-4 border-slate-200">
              {activeCategory} FAQs
            </h2>

            {currentFaqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors"
              >
                <h2 className="text-xl font-black text-slate-900 mb-4 italic tracking-tight">
                  {faq.q}
                </h2>
                <div
                  className="text-slate-600 font-medium leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: faq.a }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-24 p-12 bg-slate-900 rounded-[3rem] text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0  opacity-10 pointer-events-none" />
          <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter relative z-10">
            Still have questions?
          </h3>
          <p className="text-slate-400 font-bold italic max-w-xl mx-auto relative z-10">
            Our support team is available 24/7 to help you set up your digital
            shop.
          </p>
          <button className="bg-emerald-400 text-slate-900 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] relative z-10 italic">
            Contact Support ➔
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
