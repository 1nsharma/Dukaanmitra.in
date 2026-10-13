import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Services: React.FC = () => {
  const aqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How to get my physical shop online without building an app?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The fastest way to get your shop online is by setting up a WhatsApp Business account and automating it with a tool like DukaanMitra. No app download is required for your customers.",
        },
      },
      {
        "@type": "Question",
        name: "How can I fix a suspended Google Business Profile?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A suspended Google Business Profile is usually caused by name mismatches, non-residential addresses listed as storefronts, or weak external trust signals. Our profile recovery service helps fix these compliance issues.",
        },
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto py-24 px-6 relative z-10">
      <Helmet>
        <title>
          Services | Google Listing & WhatsApp Business | DukaanMitra
        </title>
        <meta
          name="description"
          content="We help local shops in Kanpur and India get digital visibility. Expert Google Business Profile recovery, WhatsApp automation, and retail strategy."
        />
        <link rel="canonical" href="https://dukaanmitra.in/services" />
        <script type="application/ld+json">{JSON.stringify(aqSchema)}</script>
      </Helmet>

      <div className="text-center mb-16 space-y-6">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter uppercase relative inline-block">
          Growth Services
          <div className="absolute -bottom-4 left-0 w-full h-2 bg-emerald-500 rounded-full"></div>
        </h1>
        <p className="text-xl text-slate-600 font-bold max-w-2xl mx-auto">
          Beyond our AI tool, we provide hands-on services to build your local
          digital footprint and drive actual footfall.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Service 1 */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col group hover:-translate-y-2 transition-all duration-300">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-8 font-black shrink-0">
            📍
          </div>
          <h2 className="text-2xl font-black text-slate-900 italic uppercase mb-4">
            Google Business Mastery
          </h2>
          <p className="text-slate-600 font-medium leading-relaxed mb-8 flex-1">
            Is your shop invisible on Google Maps? Or worse, suspended? We
            optimize your Google listing to rank #1 locally when people search
            for "Inventory Business near me".
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <span className="text-blue-500">✓</span> Profile Verification
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <span className="text-blue-500">✓</span> Suspension Recovery
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <span className="text-blue-500">✓</span> Local SEO & Reviews Setup
            </li>
          </ul>
          <Link
            to="/contact"
            className="bg-slate-100 text-slate-900 font-black uppercase text-xs tracking-widest py-3 px-6 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-center"
          >
            Enquire Now
          </Link>
        </div>

        {/* Service 2 */}
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-800 flex flex-col group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[50px]"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-3xl mb-8 font-black shrink-0">
              💬
            </div>
            <h2 className="text-2xl font-black text-white italic uppercase mb-4">
              WhatsApp Retail Setup
            </h2>
            <p className="text-slate-300 font-medium leading-relaxed mb-8 flex-1">
              Move your catalogue, orders, and customer queries to WhatsApp. We
              set up your entire digital storefront without you needing a
              website or app.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm font-bold text-slate-200">
                <span className="text-emerald-400">✓</span> WhatsApp Business
                Profile API
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-200">
                <span className="text-emerald-400">✓</span> Catalogue & Menu
                Integration
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-200">
                <span className="text-emerald-400">✓</span> Automated Customer
                Replies
              </li>
            </ul>
            <Link
              to="/contact"
              className="bg-emerald-500 text-white font-black uppercase text-xs tracking-widest py-3 px-6 rounded-xl hover:bg-emerald-400 shadow-xl shadow-emerald-500/30 transition-all text-center mt-auto"
            >
              Enquire Now
            </Link>
          </div>
        </div>

        {/* Service 3 */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col group hover:-translate-y-2 transition-all duration-300">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-8 font-black shrink-0">
            📊
          </div>
          <h2 className="text-2xl font-black text-slate-900 italic uppercase mb-4">
            Digital Visibility Engine
          </h2>
          <p className="text-slate-600 font-medium leading-relaxed mb-8 flex-1">
            Build strong external trust signals. We ensure your shop is listed
            consistently across Justdial, IndiaMART, and local directories to
            boost authority.
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <span className="text-purple-500">✓</span> Citations & Directories
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <span className="text-purple-500">✓</span> Cross-platform
              Validation
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <span className="text-purple-500">✓</span> AEO/GEO Optimized
              Profiles
            </li>
          </ul>
          <Link
            to="/contact"
            className="bg-slate-100 text-slate-900 font-black uppercase text-xs tracking-widest py-3 px-6 rounded-xl hover:bg-purple-600 hover:text-white transition-all text-center"
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
