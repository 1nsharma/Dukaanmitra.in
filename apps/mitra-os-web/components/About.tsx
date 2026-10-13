import React from "react";
import { Helmet } from "react-helmet-async";

const About: React.FC = () => {
  const unifiedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://dukaanmitra.in/about#amitsharma",
        name: "Amit Sharma",
        alternateName: "Amey",
        jobTitle: "Founder & AI Systems Architect",
        description:
          "Founder and AI Systems Builder based in Kanpur, specializing in AEO, GEO, and WhatsApp AI automation.",
        worksFor: {
          "@id": "https://dukaanmitra.in/#organization",
        },
        homeLocation: {
          "@type": "Place",
          name: "Kanpur, Uttar Pradesh, India",
        },
        sameAs: [
          "https://www.linkedin.com/in/aemy29",
          "https://github.com/ameyinside",
          "https://dev.to/ameyinside",
          "https://twitter.com/ameyinside",
          "https://hashnode.com/@dukaanmitra",
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://dukaanmitra.in/#organization",
        name: "DukaanMitra",
        url: "https://dukaanmitra.in",
        founder: {
          "@id": "https://dukaanmitra.in/about#amitsharma",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://dukaanmitra.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: "https://dukaanmitra.in/about",
      },
    ],
  };

  const faqs = [
    {
      q: "Kya DukaanMitra app download karna padta hai?",
      a: "Nahi, yeh WhatsApp pe hi kaam karta hai. Aapko koi naya app seekhne ki zaroorat nahi hai.",
    },
    {
      q: "Kya ye free hai?",
      a: "Haan, DukaanMitra ka free trial available hai taaki aap iski digital power ko samajh sakein.",
    },
    {
      q: "Kya ye offline dukaan ke liye useful hai?",
      a: "Haan, yeh specially small Inventory Businesss aur offline dukaandaaron ke liye hi bana hai jo apna hisaab-kitaab digital karna chahte hain.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <Helmet>
        <title>
          What is DukaanMitra and how does it help Inventory Businesss grow?
        </title>
        <meta
          name="description"
          content="DukaanMitra is an AI-powered WhatsApp assistant for Inventory Business owners that helps them manage bills, track customers, and increase repeat sales without using any app."
        />
        <script type="application/ld+json">
          {JSON.stringify(unifiedSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="space-y-16">
        {/* H1 Title */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight italic leading-tight">
            What is DukaanMitra and how does it help Inventory Businesss grow?
          </h1>
          <div className="w-24 h-2 bg-indigo-600 mx-auto rounded-full"></div>
        </section>

        {/* Opening Paragraph */}
        <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100">
          <p className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed">
            DukaanMitra is an AI-powered WhatsApp assistant for Inventory
            Business owners that helps them manage bills, track customers, and
            increase repeat sales without using any app.{" "}
            <span className="text-indigo-600 font-bold">
              दुकान वाले बस WhatsApp पे message भेजते हैं, बाकी काम AI करता है.
            </span>
          </p>
        </section>

        {/* Subheadings / FAQ Structure */}
        <div className="grid gap-12">
          <section className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tight uppercase">
              How does DukaanMitra work?
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              DukaanMitra works directly inside your WhatsApp. You just send a
              message like "Rahul 500 Sugar" and our AI automatically records
              the transaction, updates the ledger, and sends a professional bill
              to the customer. No complicated software, no training required.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tight uppercase">
              What problems does DukaanMitra solve?
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Most Business owners struggle with manual bahi-khata, forgotten
              udhaar, and losing touch with customers. DukaanMitra automates
              udhaar reminders, tracks inventory trends, and helps you run
              loyalty programs—all through WhatsApp.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tight uppercase">
              Who should use DukaanMitra?
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              If you run a Inventory Business, General store, or any small
              retail business in India and find existing billing apps too
              complex, DukaanMitra is built for you. It's designed for the "busy
              shopkeeper" who wants digital power without the digital headache.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tight uppercase">
              Why is DukaanMitra better than traditional apps?
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Traditional apps require you to open them, navigate menus, and
              type data into small fields. DukaanMitra uses natural language
              processing. You talk to it like you talk to a friend. Plus, since
              it's on WhatsApp, your customers don't need to download anything
              to receive bills.
            </p>
          </section>
        </div>

        {/* Credentials Section */}
        <section className="bg-slate-900 text-white p-10 md:p-16 rounded-[4rem] relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">
              Our Vision & Trust
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
              Built by founders working in AI and small business automation,
              DukaanMitra is designed specifically for Indian Business दुकानदार
              who want digital power without complexity. We believe that
              technology should adapt to the user, not the other way around.
              Founded in 2026, DukaanMitra is proudly leading the "JanSunwai
              2.0" initiative to bring digital inclusion to local businesses.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-full flex items-center justify-center font-black shadow-lg">
                AS
              </div>
              <div>
                <p className="font-black text-xl italic uppercase tracking-wider">
                  Amit Sharma
                </p>
                <p className="text-sm text-slate-400 font-bold tracking-widest">
                  Founder & AI Systems Architect
                </p>
                <div className="flex gap-4 mt-2">
                  <a
                    href="https://linkedin.com/in/aemy29"
                    className="text-indigo-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest italic"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href="https://twitter.com/ameyinside"
                    className="text-indigo-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest italic"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter (X) ↗
                  </a>
                  <a
                    href="https://youtube.com/@officialdukaanmitra?si=pqTRln23pvA-9Fdi"
                    className="text-rose-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest italic"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tight uppercase text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100"
              >
                <h3 className="font-black text-slate-900 mb-2">Q: {faq.q}</h3>
                <p className="text-slate-600 font-medium">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
