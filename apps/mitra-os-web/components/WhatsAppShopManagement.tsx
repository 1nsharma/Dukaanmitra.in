import React from "react";
import { Helmet } from "react-helmet-async";

export const WhatsAppShopManagement: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>WhatsApp Shop Management | Run your Dukaan on WhatsApp</title>
        <meta
          name="description"
          content="Run your entire shop on WhatsApp. No apps, no training. Manage udhaar, inventory, and sales using simple text messages."
        />
        <meta
          name="keywords"
          content="whatsapp shop management, whatsapp billing system india, sell on whatsapp business, manage shop on whatsapp"
        />
        <link
          rel="canonical"
          href="https://dukaanmitra.in/whatsapp-shop-management"
        />
      </Helmet>

      <section className="py-24 lg:py-32 px-6 lg:px-20 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-tight">
            Run Your Entire Dukaan on WhatsApp
          </h1>
          <p className="text-xl lg:text-2xl font-bold opacity-90">
            No apps. No training. No confusion.
          </p>
          <div className="bg-white/10 p-8 rounded-3xl inline-block mt-8 text-left border border-white/20 shadow-xl">
            <p className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-2">
              Just send a message like:
            </p>
            <p className="text-2xl font-bold italic">👉 “Rahul 500 chini”</p>
          </div>
          <p className="text-lg font-medium opacity-80 mt-6 max-w-2xl mx-auto">
            And your AI Munim will record the sale, update udhaar, and track
            inventory automatically.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-20 bg-slate-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-5xl font-black italic tracking-tighter text-slate-900 uppercase leading-tight">
              Still Using Notebook for Udhaar?
            </h2>
            <ul className="space-y-4 text-lg font-bold text-slate-600">
              <li className="flex items-center gap-3">
                <span className="text-red-500">❌</span> Entries get lost
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-500">❌</span> Payments get delayed
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-500">❌</span> No reminders
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-500">❌</span> No business insight
              </li>
            </ul>
            <p className="text-xl font-black text-red-600 italic pt-4">
              You're losing money every day.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 space-y-6">
            <h2 className="text-3xl font-black italic tracking-tighter text-indigo-600 uppercase">
              Meet Your WhatsApp Munim
            </h2>
            <ul className="space-y-4 text-lg font-bold text-slate-700">
              <li className="flex items-center gap-3">
                <span className="text-emerald-500 text-2xl">✔</span> Tracks
                every udhaar automatically
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-500 text-2xl">✔</span> Sends
                payment reminders
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-500 text-2xl">✔</span> Alerts when
                stock is low
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-500 text-2xl">✔</span> Gives daily
                sales reports
              </li>
            </ul>
            <p className="text-lg font-black italic text-slate-400 uppercase tracking-wide pt-4">
              All inside WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-20 text-center">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase">
            Built for Indian Shopkeepers
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <span className="text-4xl block mb-4">🇮🇳</span>
              <p className="font-bold text-slate-700">
                Works in Hindi & Hinglish
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <span className="text-4xl block mb-4">🚫</span>
              <p className="font-bold text-slate-700">No app download needed</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <span className="text-4xl block mb-4">📱</span>
              <p className="font-bold text-slate-700">Works on any phone</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-20 bg-emerald-500 text-slate-900 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-5xl font-black italic tracking-tighter uppercase">
            Start Free in 30 Seconds
          </h2>
          <p className="text-2xl font-bold">
            Simply send a message and start managing your shop intelligently.
          </p>
          <a
            href="https://whatsapp.com/channel/0029VbBxi9eJZg4DGvYpBx0U"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 px-12 py-6 bg-slate-900 text-white rounded-[3rem] font-black text-2xl hover:bg-slate-800 transition-all shadow-xl italic tracking-tighter"
          >
            Send START on WhatsApp 👉 +91 63937 41171
          </a>
        </div>
      </section>
    </div>
  );
};
