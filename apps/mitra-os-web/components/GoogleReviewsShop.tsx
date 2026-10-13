import React from "react";
import { Helmet } from "react-helmet-async";

export const GoogleReviewsShop: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Get More Google Reviews for Shop | Automate on WhatsApp</title>
        <meta
          name="description"
          content="Collect Google reviews automatically via WhatsApp. Improve your shop rating, rank higher on Google Maps, and get more customers without manual follow-ups."
        />
        <meta
          name="keywords"
          content="get more google reviews for shop, google my business reviews, google review link generator, how to get more google reviews"
        />
        <link
          rel="canonical"
          href="https://dukaanmitra.in/get-more-google-reviews-for-shop"
        />
      </Helmet>

      <section className="py-24 lg:py-32 px-6 lg:px-20 bg-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-tight">
            Get More Customers from Google Maps
          </h1>
          <p className="text-2xl font-bold opacity-90 text-indigo-100">
            More reviews = more visibility = more sales.
          </p>
          <p className="text-xl font-medium pt-4 max-w-2xl mx-auto opacity-80">
            DukaanMitra helps you collect Google reviews automatically, improve
            your shop rating, and rank higher on Google Maps natively.
          </p>
          <a
            href="https://whatsapp.com/channel/0029VbBxi9eJZg4DGvYpBx0U"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 px-12 py-6 bg-white text-indigo-600 rounded-[3rem] font-black text-2xl hover:bg-slate-100 transition-all shadow-xl italic tracking-tighter"
          >
            Send START on WhatsApp 👉
          </a>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-20 bg-slate-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
            <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
              How It Works
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-black flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">
                    After every sale
                  </p>
                  <p className="text-slate-500">
                    The customer gets an automated WhatsApp message thanking
                    them.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-black flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">
                    They click review link
                  </p>
                  <p className="text-slate-500">
                    A direct link to your shop's Google My Business page is
                    provided.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-black flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">
                    They leave a rating
                  </p>
                  <p className="text-slate-500">
                    Done. You gain a 5-star review effortlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl lg:text-5xl font-black italic tracking-tighter text-slate-900 uppercase leading-tight">
              Why This Matters
            </h2>
            <ul className="space-y-6 text-xl font-bold text-slate-600">
              <li className="flex items-center gap-4">
                <span className="text-emerald-500 text-3xl">🚀</span> Shops with
                more reviews get more customers
              </li>
              <li className="flex items-center gap-4">
                <span className="text-emerald-500 text-3xl">⚖️</span> Higher
                rating builds absolute trust
              </li>
              <li className="flex items-center gap-4">
                <span className="text-emerald-500 text-3xl">🗺️</span> Google
                shows top-rated shops first locally
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-20 text-center">
        <div className="max-w-4xl mx-auto space-y-12 bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">
              No Follow-Ups Needed
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              <div className="p-6 bg-white/10 rounded-3xl border border-white/20">
                <span className="text-red-400 block mb-2 text-2xl">❌</span>
                <p className="font-bold">No need to ask customers manually</p>
              </div>
              <div className="p-6 bg-white/10 rounded-3xl border border-white/20">
                <span className="text-red-400 block mb-2 text-2xl">❌</span>
                <p className="font-bold">No need to send links repeatedly</p>
              </div>
              <div className="p-6 bg-white/10 rounded-3xl border border-white/20">
                <span className="text-red-400 block mb-2 text-2xl">❌</span>
                <p className="font-bold">No need to track who reviewed</p>
              </div>
            </div>
            <p className="text-2xl font-black italic text-emerald-400 pt-4 uppercase tracking-widest">
              Everything is Automated.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
