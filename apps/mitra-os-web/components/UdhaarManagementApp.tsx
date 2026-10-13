import React from "react";
import { Helmet } from "react-helmet-async";

export const UdhaarManagementApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Udhaar Management App | WhatsApp Bahi Khata Alternative</title>
        <meta
          name="description"
          content="Stop losing money in udhaar. Best bahi khata alternative in India to track customer credit and send automated payment reminders on WhatsApp."
        />
        <meta
          name="keywords"
          content="udhaar management app, credit ledger app for shop, bahi khata app alternative, khata book app whatsapp"
        />
        <link
          rel="canonical"
          href="https://dukaanmitra.in/udhaar-management-app"
        />
      </Helmet>

      <section className="py-24 lg:py-32 px-6 lg:px-20 bg-emerald-600 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-tight">
            Stop Losing Money in Udhaar
          </h1>
          <p className="text-2xl font-bold opacity-90 text-emerald-100">
            Track every customer credit automatically using WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
            <div className="bg-red-500/20 p-4 rounded-2xl border border-red-500/30 text-left">
              <p className="text-red-200 font-bold mb-1">No more:</p>
              <ul className="text-sm font-medium space-y-1">
                <li>❌ Forgotten payments</li>
                <li>❌ Missing entries</li>
                <li>❌ Manual calculations</li>
              </ul>
            </div>
          </div>
          <a
            href="https://whatsapp.com/channel/0029VbBxi9eJZg4DGvYpBx0U"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 px-12 py-6 bg-slate-900 text-white rounded-[3rem] font-black text-2xl hover:bg-slate-800 transition-all shadow-2xl italic tracking-tighter"
          >
            Send START on WhatsApp
          </a>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-20 bg-slate-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase leading-tight">
              Just Type. <br />
              <span className="text-emerald-600">That's It.</span>
            </h2>
            <div className="bg-white p-6 rounded-3xl shadow-xl border-l-[8px] border-emerald-500 transform -rotate-1 hover:rotate-0 transition-transform">
              <p className="text-2xl font-black italic tracking-tight text-slate-700">
                "Ramesh 300 oil"
              </p>
            </div>
            <div className="space-y-4">
              <p className="font-bold text-slate-500 uppercase tracking-widest text-sm">
                DukaanMitra Will:
              </p>
              <ul className="space-y-3 text-lg font-bold text-slate-700">
                <li className="flex items-center gap-3">✅ Save transaction</li>
                <li className="flex items-center gap-3">✅ Update ledger</li>
                <li className="flex items-center gap-3">
                  ✅ Track total udhaar automatically
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl border border-slate-800 space-y-8">
            <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner">
              🔔
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-tight">
              Automatic Payment Reminders
            </h2>
            <p className="text-lg font-medium text-slate-300">
              Customers get polite reminders directly on WhatsApp before the due
              date. No awkward phone calls.
            </p>
            <div className="p-5 bg-white/10 rounded-2xl border border-white/20 mt-6">
              <ul className="space-y-2 font-black italic tracking-wide text-emerald-400">
                <li>👉 Get paid faster</li>
                <li>👉 Reduce udhaar defaults instantly</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter text-slate-900 uppercase pb-4">
            Replace Your Bahi Khata Today
          </h2>
          <p className="text-2xl font-bold text-slate-500 pb-8">
            No paper. No tension. Total control.
          </p>
          <a
            href="https://whatsapp.com/channel/0029VbBxi9eJZg4DGvYpBx0U"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-6 bg-indigo-600 text-white rounded-[3rem] font-black text-2xl hover:bg-indigo-500 transition-all shadow-xl italic tracking-tighter"
          >
            Start Free Now 👉
          </a>
        </div>
      </section>
    </div>
  );
};
